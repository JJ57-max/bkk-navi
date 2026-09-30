#!/usr/bin/env node

import {
  readFile,
  writeFile,
  rename,
  rm,
} from 'node:fs/promises';

import process from 'node:process';

const LEDGER =
  'public/data/srt/staging/official/srt-coordinate-verification.json';

const REGISTRY =
  'public/data/srt/staging/official/srt-verification-source-registry.json';

async function readJson(path) {
  return JSON.parse(
    await readFile(path, 'utf8')
  );
}

async function atomicWrite(path, value) {
  const temp =
    `${path}.tmp-${process.pid}`;

  try {
    await writeFile(
      temp,
      `${JSON.stringify(value, null, 2)}\n`
    );

    await rename(temp, path);
  } catch (error) {
    await rm(
      temp,
      { force: true }
    ).catch(() => {});

    throw error;
  }
}

function unwrapMarkdownUrl(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const match =
    value.match(
      /^\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)$/
    );

  if (!match) {
    return value;
  }

  if (match[1] !== match[2]) {
    throw new Error(
      `Markdown URL targets differ: ${value}`
    );
  }

  return match[1];
}

async function main() {
  console.log(
    '=== Normalize Trang verification provenance ==='
  );

  const ledger =
    await readJson(LEDGER);

  const registry =
    await readJson(REGISTRY);

  if (
    ledger.productionModified !== false
  ) {
    throw new Error(
      'Safety guard failed: productionModified must be false'
    );
  }

  const row =
    ledger.verifications?.find(
      r => Number(r.stationId) === 636
    );

  if (
    !row ||
    row.name !== 'ตรัง'
  ) {
    throw new Error(
      'Trang station identity check failed'
    );
  }

  const evidence =
    row.independentVerificationEvidence ??
    [];

  const tat =
    evidence.find(
      e =>
        e.sourceName ===
        'Tourism Authority of Thailand'
    );

  const commons =
    evidence.find(
      e =>
        e.sourceName ===
        'Wikimedia Commons'
    );

  const wikidata =
    evidence.find(
      e =>
        e.sourceName ===
        'Wikidata'
    );

  if (!tat || !commons) {
    throw new Error(
      'Required Trang evidence missing'
    );
  }

  /*
   * Normalize URLs only.
   */
  for (const item of evidence) {
    item.sourceUrl =
      unwrapMarkdownUrl(
        item.sourceUrl
      );
  }

  /*
   * TAT: preserve existing evidence meaning.
   */
  tat.evidenceType =
    'GOVERNMENT_PUBLISHED_LOCATION';

  tat.coordinateSemantics =
    'LOCATION_AT_OR_IMMEDIATELY_ADJACENT_TO_STATION';

  tat.role =
    tat.sourceRole;

  /*
   * Wikimedia Commons:
   * existing source has GPS EXIF and is a camera position.
   */
  commons.evidenceType =
    'GPS_EXIF_PHOTO';

  commons.coordinateSemantics =
    'CAMERA_POSITION';

  commons.role =
    commons.sourceRole;

  if (wikidata) {
    wikidata.role =
      wikidata.sourceRole;
  }

  /*
   * Register TAT as a distinct source family.
   * This does not itself alter any station decision.
   */
  const tatSource = {
    sourceId:
      'tourism-authority-thailand',

    displayName:
      'Tourism Authority of Thailand',

    sourceFamily:
      'THAILAND_GOVERNMENT_TOURISM',

    coordinateOrigin:
      'GOVERNMENT_PUBLISHED_LOCATION',

    defaultIndependence:
      'INDEPENDENT',

    mayCountAsIndependentVerification:
      true,

    allowedRoles: [
      'INDEPENDENT_LOCATION_CORROBORATION'
    ],

    requiredEvidenceType:
      'GOVERNMENT_PUBLISHED_LOCATION',

    requiredCoordinateSemantics:
      'LOCATION_AT_OR_IMMEDIATELY_ADJACENT_TO_STATION',

    notes:
      'May count when the government tourism material itself identifies the referenced location as at or immediately adjacent to the named station.'
  };

  const existing =
    registry.sources.findIndex(
      source =>
        source.sourceId ===
        tatSource.sourceId
    );

  if (existing >= 0) {
    registry.sources[existing] =
      tatSource;
  } else {
    registry.sources.push(
      tatSource
    );
  }

  await atomicWrite(
    LEDGER,
    ledger
  );

  await atomicWrite(
    REGISTRY,
    registry
  );

  console.log({
    stationId:
      row.stationId,

    name:
      row.name,

    verificationStatus:
      row.verificationStatus,

    productionDecision:
      row.productionDecision,

    approvedCoordinate:
      row.approvedCoordinate,

    tatEvidenceType:
      tat.evidenceType,

    commonsEvidenceType:
      commons.evidenceType,

    commonsCoordinateSemantics:
      commons.coordinateSemantics,
  });

  console.log();
  console.log(
    'production modified:',
    false
  );

  console.log(
    'decision modified:',
    false
  );
}

main().catch(error => {
  console.error(
    'Trang provenance normalization failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
