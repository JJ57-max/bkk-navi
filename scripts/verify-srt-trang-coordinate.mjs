#!/usr/bin/env node

/**
 * verify-srt-trang-coordinate.mjs
 *
 * Records independent verification evidence for Trang railway station
 * (SRT stationId 636).
 *
 * SAFETY:
 * - Does not modify stations.ts.
 * - Does not modify any production dataset.
 * - Does not mark the coordinate as applied to production.
 * - Keeps approvedCoordinate null until the final production-approval step.
 */

import {
  readFile,
  writeFile,
  rename,
  rm,
} from 'node:fs/promises';

import {
  join,
} from 'node:path';

import process from 'node:process';

const ROOT = process.cwd();

const LEDGER_PATH = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official',
  'srt-coordinate-verification.json'
);

const STATION_ID = 636;

const EXPECTED_NAME = 'ตรัง';

const EXPECTED_CANDIDATE = {
  lat: 7.554413899881685,
  lng: 99.60449510006893,
};

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
      {
        force: true,
      }
    ).catch(() => {});

    throw error;
  }
}

function haversineMeters(
  a,
  b
) {
  const R = 6371008.8;

  const toRad =
    value =>
      value * Math.PI / 180;

  const lat1 =
    toRad(a.lat);

  const lat2 =
    toRad(b.lat);

  const dLat =
    lat2 - lat1;

  const dLng =
    toRad(
      b.lng - a.lng
    );

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(dLng / 2) ** 2;

  return (
    2 *
    R *
    Math.asin(
      Math.min(
        1,
        Math.sqrt(h)
      )
    )
  );
}

function round1(value) {
  return Math.round(
    value * 10
  ) / 10;
}

function assertCoordinateClose(
  actual,
  expected,
  toleranceMeters,
  label
) {
  const distance =
    haversineMeters(
      actual,
      expected
    );

  if (
    distance >
    toleranceMeters
  ) {
    throw new Error(
      `${label} changed unexpectedly: ${distance.toFixed(1)} m from expected value.`
    );
  }
}

async function main() {
  console.log(
    '=== Verify SRT Trang coordinate ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const ledger =
    await readJson(
      LEDGER_PATH
    );

  if (
    !Array.isArray(
      ledger.verifications
    )
  ) {
    throw new Error(
      'Verification ledger has no verifications array.'
    );
  }

  const matches =
    ledger.verifications.filter(
      row =>
        Number(row.stationId) ===
        STATION_ID
    );

  if (
    matches.length !== 1
  ) {
    throw new Error(
      `Expected exactly one stationId ${STATION_ID}; found ${matches.length}.`
    );
  }

  const row =
    matches[0];

  if (
    row.name !==
    EXPECTED_NAME
  ) {
    throw new Error(
      `Unexpected station name: ${row.name}`
    );
  }

  if (
    !row.candidateCoordinate ||
    !Number.isFinite(
      row.candidateCoordinate.lat
    ) ||
    !Number.isFinite(
      row.candidateCoordinate.lng
    )
  ) {
    throw new Error(
      'Trang candidate coordinate is invalid.'
    );
  }

  /*
   * Guard against silently approving a different candidate
   * if an upstream file changes later.
   */
  assertCoordinateClose(
    row.candidateCoordinate,
    EXPECTED_CANDIDATE,
    1,
    'Trang candidate coordinate'
  );

  /*
   * Independent / supplementary evidence.
   *
   * Important distinction:
   *
   * - Government tourism material gives a location immediately
   *   associated with Trang Railway Station.
   * - Wikimedia Commons provides geotagged photographic evidence.
   * - Wikidata is supplementary only because its coordinate
   *   provenance is not strong enough to count as independent
   *   authoritative evidence by itself.
   */
  const evidence = [
    {
      sourceType:
        'GOVERNMENT_TOURISM_MATERIAL',

      sourceName:
        'Tourism Authority of Thailand',

      sourceRole:
        'INDEPENDENT_LOCATION_CORROBORATION',

      stationRelationship:
        'LOCATION_AT_OR_IMMEDIATELY_ADJACENT_TO_STATION',

      observedCoordinate: {
        lat:
          7 + 33.266 / 60,

        lng:
          99 + 36.288 / 60,
      },

      sourceCoordinateText:
        'N07°33.266′ E099°36.288′',

      independence:
        'INDEPENDENT',

      note:
        'Government tourism material identifies the referenced location as being in front of Trang Railway Station.',

      sourceUrl:
        'https://www.thailandtourismus.de/fileadmin/user_upload/E_Broschueren/Destinationen/Trang.pdf',
    },

    {
      sourceType:
        'GEOTAGGED_PHOTOGRAPH',

      sourceName:
        'Wikimedia Commons',

      sourceRole:
        'INDEPENDENT_PHYSICAL_LOCATION_CORROBORATION',

      stationRelationship:
        'PHOTOGRAPH_IDENTIFIED_AS_TRANG_RAILWAY_STATION',

      observedCoordinate: {
        lat:
          7.554411,

        lng:
          99.604692,
      },

      independence:
        'INDEPENDENT',

      note:
        'Geotagged photograph identified as Trang Railway Station; used as physical-location corroboration rather than official railway authority data.',

      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Trang_Railway_Station.jpg',
    },

    {
      sourceType:
        'KNOWLEDGE_BASE',

      sourceName:
        'Wikidata',

      sourceRole:
        'SUPPLEMENTARY_CORROBORATION',

      stationRelationship:
        'TRANG_RAILWAY_STATION_ENTITY',

      observedCoordinate: {
        lat:
          7.554444444444445,

        lng:
          99.60444444444444,
      },

      independence:
        'NOT_COUNTED_AS_INDEPENDENT',

      note:
        'Supplementary only. Coordinate provenance is not relied upon for independent verification.',

      sourceUrl:
        'https://www.wikidata.org/wiki/Q6633276',
    },
  ];

  const processedEvidence =
    evidence.map(
      item => ({
        ...item,

        candidateDistanceMeters:
          round1(
            haversineMeters(
              row.candidateCoordinate,
              item.observedCoordinate
            )
          ),

        reviewedAt:
          nowIso(),
      })
    );

  const independent =
    processedEvidence.filter(
      item =>
        item.independence ===
        'INDEPENDENT'
    );

  if (
    independent.length < 2
  ) {
    throw new Error(
      'Trang requires at least two independent corroborating evidence records.'
    );
  }

  /*
   * Neither independent location should be wildly inconsistent
   * with the candidate. The tourism coordinate describes a
   * station-adjacent location, so use a deliberately conservative
   * 100 m verification bound.
   */
  for (
    const item
    of independent
  ) {
    if (
      item.candidateDistanceMeters >
      100
    ) {
      throw new Error(
        `Independent evidence is too far from candidate: ${item.sourceName} = ${item.candidateDistanceMeters} m`
      );
    }
  }

  row.independentVerificationEvidence =
    processedEvidence;

  row.verificationStatus =
    'VERIFIED_WITH_INDEPENDENT_EVIDENCE';

  row.productionDecision =
    'APPROVED_CANDIDATE';

  /*
   * Critical safety invariant:
   * final production coordinate is deliberately not assigned here.
   */
  row.approvedCoordinate =
    null;

  row.verificationReview = {
    reviewedAt:
      nowIso(),

    candidateCoordinate:
      {
        ...row.candidateCoordinate,
      },

    independentEvidenceCount:
      independent.length,

    result:
      'PASS',

    productionApplied:
      false,

    note:
      'Candidate has passed independent evidence review. Final production application remains a separate controlled step.',
  };

  ledger.generatedAt =
    nowIso();

  ledger.productionModified =
    false;

  /*
   * Recalculate useful status totals rather than manually
   * incrementing an existing summary.
   */
  const statusCounts = {};

  const decisionCounts = {};

  for (
    const item
    of ledger.verifications
  ) {
    statusCounts[
      item.verificationStatus
    ] =
      (
        statusCounts[
          item.verificationStatus
        ] ?? 0
      ) + 1;

    decisionCounts[
      item.productionDecision
    ] =
      (
        decisionCounts[
          item.productionDecision
        ] ?? 0
      ) + 1;
  }

  ledger.summary = {
    ...ledger.summary,

    verificationRecords:
      ledger.verifications.length,

    verificationStatusCounts:
      statusCounts,

    productionDecisionCounts:
      decisionCounts,

    approvedForProduction:
      ledger.verifications.filter(
        item =>
          item.productionDecision ===
          'APPROVED_FOR_PRODUCTION'
      ).length,

    approvedCandidates:
      ledger.verifications.filter(
        item =>
          item.productionDecision ===
          'APPROVED_CANDIDATE'
      ).length,
  };

  await atomicWrite(
    LEDGER_PATH,
    `${JSON.stringify(
      ledger,
      null,
      2
    )}\n`
  );

  console.log();
  console.log(
    '===== TRANG VERIFICATION ====='
  );

  console.log({
    stationId:
      row.stationId,

    name:
      row.name,

    candidateCoordinate:
      row.candidateCoordinate,

    evidence:
      processedEvidence.map(
        item => ({
          source:
            item.sourceName,

          role:
            item.sourceRole,

          independence:
            item.independence,

          candidateDistanceMeters:
            item.candidateDistanceMeters,
        })
      ),

    verificationStatus:
      row.verificationStatus,

    productionDecision:
      row.productionDecision,

    approvedCoordinate:
      row.approvedCoordinate,
  });

  console.log();
  console.log(
    '===== SAFETY ====='
  );

  console.log(
    'production modified:',
    ledger.productionModified
  );

  console.log(
    'approved coordinate:',
    row.approvedCoordinate
  );

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-coordinate-verification.json'
  );
}

main().catch(
  error => {
    console.error(
      'Trang verification failed:'
    );

    console.error(error);

    process.exitCode = 1;
  }
);
