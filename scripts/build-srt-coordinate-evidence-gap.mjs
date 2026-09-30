#!/usr/bin/env node

/**
 * build-srt-coordinate-evidence-gap.mjs
 *
 * Coordinate verification ledger から、
 * production approval に不足している独立証拠を可視化する。
 *
 * IMPORTANT:
 * - production data は変更しない
 * - approvedCoordinate は変更しない
 * - verification ledger 自体も変更しない
 */

import {
  readFile,
  writeFile,
  rename,
  rm,
  mkdir,
} from 'node:fs/promises';

import {
  dirname,
  join,
} from 'node:path';

import process from 'node:process';

const ROOT = process.cwd();

const INPUT = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official',
  'srt-coordinate-verification.json'
);

const REGISTRY = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official',
  'srt-verification-source-registry.json'
);

const OUTPUT = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official',
  'srt-coordinate-evidence-gap.json'
);

const REQUIRED_INDEPENDENT_EVIDENCE = 2;

function nowIso() {
  return new Date().toISOString();
}

async function readJson(path) {
  return JSON.parse(
    await readFile(path, 'utf8')
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

    await rename(temp, path);
  } catch (error) {
    await rm(
      temp,
      { force: true }
    ).catch(() => {});

    throw error;
  }
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function findRegisteredSource(
  registry,
  evidence
) {
  const name =
    normalize(evidence.sourceName);

  return registry.sources.find(source => {
    if (
      normalize(source.displayName) ===
      name
    ) {
      return true;
    }

    if (
      source.sourceId ===
        'wikimedia-gps-exif' &&
      name ===
        'wikimedia commons' &&
      evidence.evidenceType ===
        'GPS_EXIF_PHOTO'
    ) {
      return true;
    }

    return false;
  });
}

function validIndependentEvidence(
  registry,
  row
) {
  const evidence =
    row.independentVerificationEvidence ??
    [];

  return evidence
    .map(item => {
      const source =
        findRegisteredSource(
          registry,
          item
        );

      if (!source) {
        return null;
      }

      if (
        item.independence !==
          'INDEPENDENT' ||
        source.mayCountAsIndependentVerification !==
          true
      ) {
        return null;
      }

      if (
        source.requiredEvidenceType &&
        item.evidenceType !==
          source.requiredEvidenceType
      ) {
        return null;
      }

      if (
        source.requiredCoordinateSemantics &&
        item.coordinateSemantics !==
          source.requiredCoordinateSemantics
      ) {
        return null;
      }

      const role =
        item.sourceRole ??
        item.role ??
        null;

      if (
        role &&
        !source.allowedRoles.includes(role)
      ) {
        return null;
      }

      return {
        evidence: item,
        sourceId:
          source.sourceId,
        sourceFamily:
          source.sourceFamily,
      };
    })
    .filter(Boolean);
}

function hasPhysicalGpsEvidence(
  evidence
) {
  return evidence.some(
    e =>
      e.role ===
        'INDEPENDENT_PHYSICAL_LOCATION_CORROBORATION' ||
      e.evidenceType ===
        'GPS_EXIF_PHOTO'
  );
}

function nextAction({
  missing,
  productionDecision,
}) {
  if (
    productionDecision ===
    'APPROVED_CANDIDATE'
  ) {
    return 'READY_FOR_CONTROLLED_PRODUCTION_REVIEW';
  }

  if (missing <= 0) {
    return 'RUN_VERIFICATION_REVIEW';
  }

  if (missing === 1) {
    return 'FIND_ONE_ADDITIONAL_INDEPENDENT_LOCATION_SOURCE';
  }

  return 'FIND_ADDITIONAL_INDEPENDENT_LOCATION_SOURCES';
}

async function main() {
  console.log(
    '=== SRT coordinate evidence-gap builder ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const ledger =
    await readJson(INPUT);

  const registry =
    await readJson(REGISTRY);

  const rows =
    ledger.verifications ?? [];

  const reviews =
    rows.map(row => {
      const independent =
        validIndependentEvidence(
          registry,
          row
        );

      const sourceFamilies =
        [
          ...new Set(
            independent
              .map(
                item =>
                  item.sourceFamily
              )
              .filter(Boolean)
          )
        ];

      const count =
        sourceFamilies.length;

      const missing =
        Math.max(
          0,
          REQUIRED_INDEPENDENT_EVIDENCE -
            count
        );

      return {
        stationId:
          row.stationId,

        name:
          row.name,

        province:
          row.province,

        candidateCoordinate:
          row.candidateCoordinate ??
          null,

        verificationStatus:
          row.verificationStatus ??
          null,

        productionDecision:
          row.productionDecision ??
          null,

        approvedCoordinate:
          row.approvedCoordinate ??
          null,

        independentEvidenceCount:
          count,

        independentEvidenceRequired:
          REQUIRED_INDEPENDENT_EVIDENCE,

        independentEvidenceMissing:
          missing,

        physicalGpsEvidence:
          hasPhysicalGpsEvidence(
            independent.map(
              item => item.evidence
            )
          ),

        independentSourceFamilies:
          sourceFamilies,

        independentEvidence:
          independent.map(item => ({
            sourceId:
              item.sourceId,

            sourceFamily:
              item.sourceFamily,

            sourceName:
              item.evidence.sourceName ??
              null,

            role:
              item.evidence.sourceRole ??
              item.evidence.role ??
              null,

            evidenceType:
              item.evidence.evidenceType ??
              null,

            observedCoordinate:
              item.evidence.observedCoordinate ??
              null,

            candidateDistanceMeters:
              item.evidence.candidateDistanceMeters ??
              null,
          })),

        verificationReviewResult:
          row.verificationReview?.result ??
          null,

        nextAction:
          nextAction({
            missing,
            productionDecision:
              row.productionDecision,
          }),
      };
    });

  const summary = {
    records:
      reviews.length,

    approvedCandidates:
      reviews.filter(
        r =>
          r.productionDecision ===
          'APPROVED_CANDIDATE'
      ).length,

    missingZero:
      reviews.filter(
        r =>
          r.independentEvidenceMissing === 0
      ).length,

    missingOne:
      reviews.filter(
        r =>
          r.independentEvidenceMissing === 1
      ).length,

    missingTwoOrMore:
      reviews.filter(
        r =>
          r.independentEvidenceMissing >= 2
      ).length,

    physicalGpsEvidence:
      reviews.filter(
        r => r.physicalGpsEvidence
      ).length,
  };

  const output = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    productionModified:
      false,

    purpose:
      'Track independent evidence gaps before any SRT coordinate production change.',

    policy: {
      requiredIndependentEvidence:
        REQUIRED_INDEPENDENT_EVIDENCE,

      verificationPassRequired:
        true,

      productionApplicationSeparate:
        true,

      automaticProductionModification:
        false,
    },

    summary,

    reviews,
  };

  await atomicWriteJson(
    OUTPUT,
    output
  );

  console.log();
  console.log(
    '===== SUMMARY ====='
  );

  console.log(summary);

  console.log();
  console.log(
    '===== EVIDENCE GAPS ====='
  );

  for (const row of reviews) {
    console.log({
      stationId:
        row.stationId,

      name:
        row.name,

      independentEvidenceCount:
        row.independentEvidenceCount,

      missing:
        row.independentEvidenceMissing,

      physicalGpsEvidence:
        row.physicalGpsEvidence,

      verificationStatus:
        row.verificationStatus,

      productionDecision:
        row.productionDecision,

      nextAction:
        row.nextAction,
    });
  }

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-coordinate-evidence-gap.json'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(error => {
  console.error(
    'Evidence-gap build failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
