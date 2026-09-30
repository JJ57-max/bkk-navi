#!/usr/bin/env node

/**
 * register-srt-physical-gps-evidence.mjs
 *
 * Independently geotagged physical-location evidenceを
 * SRT coordinate verification ledgerへ登録する。
 *
 * IMPORTANT:
 * - GPSは駅代表座標ではなくcamera position
 * - candidate coordinateを書き換えない
 * - approvedCoordinateを書き換えない
 * - production dataを書き換えない
 */

import {
  readFile,
  writeFile,
  rename,
  rm,
} from 'node:fs/promises';

import {
  dirname,
} from 'node:path';

import {
  mkdir,
} from 'node:fs/promises';

import process from 'node:process';

const FILE =
  'public/data/srt/staging/official/srt-coordinate-verification.json';

const EVIDENCE = [
  {
    stationId: 570,

    expectedName:
      'บูกิต',

    sourceName:
      'Wikimedia Commons',

    sourceRole:
      'INDEPENDENT_PHYSICAL_LOCATION_CORROBORATION',

    independence:
      'INDEPENDENT',

    evidenceType:
      'GPS_EXIF_PHOTO',

    coordinateSemantics:
      'CAMERA_POSITION',

    observedCoordinate: {
      lat: 6.198842,
      lng: 101.818650,
    },

    observedAt:
      '2025-06-12',

    sourceDescription:
      'Geotagged on-site photograph of Bukit Railway Station; GPS represents camera position, not station centroid.',

    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Bukit_Railway_Station.jpg',
  },

  {
    stationId: 567,

    expectedName:
      'ตันหยงมัส',

    sourceName:
      'Wikimedia Commons',

    sourceRole:
      'INDEPENDENT_PHYSICAL_LOCATION_CORROBORATION',

    independence:
      'INDEPENDENT',

    evidenceType:
      'GPS_EXIF_PHOTO',

    coordinateSemantics:
      'CAMERA_POSITION',

    observedCoordinate: {
      lat: 6.293564,
      lng: 101.713150,
    },

    observedAt:
      '2025-06-12',

    sourceDescription:
      'Geotagged on-site photograph of Tanyong Mat Railway Station; GPS represents camera position, not station centroid.',

    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Tanyong_Mat_Railway_Station.jpg',
  },
];

function haversineMeters(a, b) {
  const R = 6371008.8;

  const rad =
    value =>
      value * Math.PI / 180;

  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);

  const dLat =
    lat2 - lat1;

  const dLng =
    rad(b.lng - a.lng);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(h)
    )
  );
}

async function atomicWriteJson(
  path,
  value
) {
  await mkdir(
    dirname(path),
    { recursive: true }
  );

  const temp =
    `${path}.tmp-${process.pid}`;

  try {
    await writeFile(
      temp,
      `${JSON.stringify(value, null, 2)}\n`
    );

    await rename(
      temp,
      path
    );
  } catch (error) {
    await rm(
      temp,
      { force: true }
    ).catch(() => {});

    throw error;
  }
}

async function main() {
  console.log(
    '=== Register SRT physical GPS evidence ==='
  );

  const ledger =
    JSON.parse(
      await readFile(
        FILE,
        'utf8'
      )
    );

  if (
    ledger.productionModified !== false
  ) {
    throw new Error(
      'Safety guard failed: productionModified must be false'
    );
  }

  for (const evidence of EVIDENCE) {
    const row =
      ledger.verifications?.find(
        item =>
          Number(item.stationId) ===
          evidence.stationId
      );

    if (!row) {
      throw new Error(
        `Station ${evidence.stationId} not found`
      );
    }

    if (
      row.name !==
      evidence.expectedName
    ) {
      throw new Error(
        `Station identity mismatch for ${evidence.stationId}: ${row.name}`
      );
    }

    if (
      !row.candidateCoordinate
    ) {
      throw new Error(
        `Candidate coordinate missing for ${evidence.stationId}`
      );
    }

    const distance =
      haversineMeters(
        row.candidateCoordinate,
        evidence.observedCoordinate
      );

    const record = {
      sourceName:
        evidence.sourceName,

      sourceRole:
        evidence.sourceRole,

      role:
        evidence.sourceRole,

      independence:
        evidence.independence,

      evidenceType:
        evidence.evidenceType,

      coordinateSemantics:
        evidence.coordinateSemantics,

      observedCoordinate:
        evidence.observedCoordinate,

      candidateDistanceMeters:
        Math.round(
          distance * 10
        ) / 10,

      observedAt:
        evidence.observedAt,

      sourceDescription:
        evidence.sourceDescription,

      sourceUrl:
        evidence.sourceUrl,

      registeredAt:
        new Date().toISOString(),
    };

    if (
      !Array.isArray(
        row.independentVerificationEvidence
      )
    ) {
      row.independentVerificationEvidence =
        [];
    }

    const duplicate =
      row.independentVerificationEvidence
        .some(
          item =>
            item.sourceName ===
              record.sourceName &&
            item.evidenceType ===
              record.evidenceType &&
            item.sourceUrl ===
              record.sourceUrl
        );

    if (!duplicate) {
      row.independentVerificationEvidence
        .push(record);
    }

    /*
     * IMPORTANT:
     * One physical GPS item is not enough
     * to approve the candidate.
     */
    row.verificationStatus =
      'EXTERNALLY_CORROBORATED';

    row.productionDecision =
      'NOT_APPROVED';

    row.approvedCoordinate =
      null;

    delete row.verificationReview;

    console.log({
      stationId:
        row.stationId,

      name:
        row.name,

      candidateDistanceMeters:
        record.candidateDistanceMeters,

      evidenceType:
        record.evidenceType,

      coordinateSemantics:
        record.coordinateSemantics,

      productionDecision:
        row.productionDecision,
    });
  }

  ledger.productionModified =
    false;

  await atomicWriteJson(
    FILE,
    ledger
  );

  console.log();
  console.log(
    'production modified:',
    false
  );

  console.log(
    'approved coordinates modified:',
    false
  );
}

main().catch(error => {
  console.error(
    'GPS evidence registration failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
