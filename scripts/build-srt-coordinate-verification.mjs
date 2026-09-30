#!/usr/bin/env node

/**
 * build-srt-coordinate-verification.mjs
 *
 * Builds a separate verification ledger from
 * srt-coordinate-review.json.
 *
 * IMPORTANT:
 * - Does not modify production data.
 * - Does not approve coordinates.
 * - Does not fabricate external evidence.
 * - Only HIGH_CANDIDATE records enter this ledger.
 */

import {
  readFile,
  writeFile,
  rename,
  mkdir,
  rm,
} from 'node:fs/promises';

import {
  dirname,
  join,
} from 'node:path';

import process from 'node:process';

const ROOT = process.cwd();

const INPUT =
  join(
    ROOT,
    'public',
    'data',
    'srt',
    'staging',
    'official',
    'srt-coordinate-review.json'
  );

const OUTPUT =
  join(
    ROOT,
    'public',
    'data',
    'srt',
    'staging',
    'official',
    'srt-coordinate-verification.json'
  );

function nowIso() {
  return new Date().toISOString();
}

async function readJson(path) {
  return JSON.parse(
    await readFile(path, 'utf8')
  );
}

async function atomicWrite(
  path,
  data
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
      data
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

async function writeJson(
  path,
  value
) {
  await atomicWrite(
    path,
    `${JSON.stringify(
      value,
      null,
      2
    )}\n`
  );
}

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

async function main() {
  console.log(
    '=== SRT coordinate verification ledger builder ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const review =
    await readJson(INPUT);

  const reviews =
    Array.isArray(review.reviews)
      ? review.reviews
      : [];

  const candidates =
    reviews.filter(
      row =>
        row.confidence ===
        'HIGH_CANDIDATE'
    );

  if (reviews.length !== 76) {
    throw new Error(
      `Unexpected review count: ${reviews.length}`
    );
  }

  if (candidates.length !== 11) {
    throw new Error(
      `Unexpected HIGH_CANDIDATE count: ${candidates.length}`
    );
  }

  const verificationRecords =
    candidates.map(row => {
      const candidate =
        row.coordinates
          ?.transportpoint;

      if (
        !candidate ||
        !Number.isFinite(candidate.lat) ||
        !Number.isFinite(candidate.lng)
      ) {
        throw new Error(
          `Missing Transportpoint coordinate for station ${row.stationId}`
        );
      }

      return {
        stationId:
          row.stationId,

        name:
          row.name,

        province:
          row.province,

        sourceReview: {
          confidence:
            row.confidence,

          recommendedAction:
            row.recommendedAction,

          reviewStatus:
            row.reviewStatus,
        },

        originalSrtCoordinate:
          clone(
            row.coordinates.srt
          ),

        candidateCoordinate:
          clone(candidate),

        spatialEvidence: {
          transportpoint: {
            osmId:
              row.transportpoint
                ?.osmId ?? null,

            fclass:
              row.transportpoint
                ?.fclass ?? null,

            name:
              row.transportpoint
                ?.name ?? null,

            matchMethod:
              row.transportpoint
                ?.matchMethod ?? null,
          },

          distancesMeters:
            clone(
              row.distancesMeters
            ),
        },

        externalEvidence: [],

        verificationStatus:
          'AWAITING_EXTERNAL_EVIDENCE',

        productionDecision:
          'NOT_APPROVED',

        approvedCoordinate:
          null,

        reviewerNote:
          null,
      };
    });

  const output = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    productionModified:
      false,

    purpose:
      'Separate evidence ledger for SRT coordinate anomaly verification.',

    warning:
      'Candidate coordinates are not production-approved coordinates.',

    source:
      'public/data/srt/staging/official/srt-coordinate-review.json',

    policy: {
      identityAuthority:
        'SRT official station data',

      candidateSource:
        'GISTDA Transportpoint cross-audit',

      geometryRole:
        'Spatial corroboration only; GISTDA railway geometry is not treated as SRT-surveyed geometry.',

      externalEvidenceRequired:
        true,

      automaticProductionApproval:
        false,

      allowedVerificationStatuses: [
        'AWAITING_EXTERNAL_EVIDENCE',
        'EXTERNALLY_CORROBORATED',
        'CONFLICTING_EVIDENCE',
        'REJECTED',
        'APPROVED_FOR_PRODUCTION',
      ],

      approvalRule:
        'No candidate becomes production-approved solely because it is close to railway geometry or a Transportpoint.',
    },

    summary: {
      sourceReviewRecords:
        reviews.length,

      verificationRecords:
        verificationRecords.length,

      awaitingExternalEvidence:
        verificationRecords.length,

      externallyCorroborated:
        0,

      conflictingEvidence:
        0,

      rejected:
        0,

      approvedForProduction:
        0,
    },

    verifications:
      verificationRecords,
  };

  await writeJson(
    OUTPUT,
    output
  );

  console.log();
  console.log(
    '===== VERIFICATION SUMMARY ====='
  );

  console.log(
    output.summary
  );

  console.log();
  console.log(
    '===== CANDIDATES ====='
  );

  for (
    const row
    of verificationRecords
  ) {
    console.log({
      stationId:
        row.stationId,

      name:
        row.name,

      province:
        row.province,

      candidateCoordinate:
        row.candidateCoordinate,

      transportpointToRail:
        row.spatialEvidence
          .distancesMeters
          .transportpointToRail,

      verificationStatus:
        row.verificationStatus,

      productionDecision:
        row.productionDecision,
    });
  }

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-coordinate-verification.json'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(error => {
  console.error(
    'Verification ledger build failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
