#!/usr/bin/env node

/**
 * apply-srt-coordinate-verification-evidence.mjs
 *
 * Adds reviewed external corroboration evidence to the
 * SRT coordinate verification ledger.
 *
 * SAFETY:
 * - Does not modify stations.ts.
 * - Does not approve production coordinates.
 * - Does not overwrite candidate coordinates.
 * - Evidence and production approval remain separate.
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

const INPUT = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official',
  'srt-coordinate-verification.json'
);

const OUTPUT = INPUT;

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
      { force: true }
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

/*
 * Reviewed evidence only.
 *
 * IMPORTANT:
 * "independence: UNKNOWN" means that the source may ultimately
 * derive some geographic information from OSM or another shared
 * upstream dataset.
 *
 * These records corroborate candidate locations but do NOT
 * independently authorize production use.
 */
const EVIDENCE = {
  636: [
    {
      sourceType:
        'PUBLIC_MAP_DIRECTORY',

      sourceName:
        'Mapcarta',

      observedCoordinate: {
        lat: 7.55445,
        lng: 99.60461,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public geographic listing consistent with the Transportpoint candidate.',
    },
  ],

  475: [
    {
      sourceType:
        'PUBLIC_MAP_DIRECTORY',

      sourceName:
        'Mapcarta',

      observedCoordinate: {
        lat: 9.47068,
        lng: 99.17934,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public geographic listing consistent with the Transportpoint candidate.',
    },
  ],

  516: [
    {
      sourceType:
        'PUBLIC_BUSINESS_DIRECTORY',

      sourceName:
        'Thailand YellowPages',

      observedCoordinate: {
        lat: 7.90158,
        lng: 100.01174,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public station listing consistent with the Transportpoint candidate.',
    },
  ],

  461: [
    {
      sourceType:
        'PUBLIC_BUSINESS_DIRECTORY',

      sourceName:
        'Thailand YellowPages',

      observedCoordinate: {
        lat: 10.16676,
        lng: 99.10695,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public station listing broadly consistent with the Transportpoint candidate.',
    },
  ],

  532: [
    {
      sourceType:
        'PUBLIC_MAP_DIRECTORY',

      sourceName:
        'Mapcarta',

      observedCoordinate: {
        lat: 7.34724,
        lng: 100.23099,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public geographic listing consistent with the Transportpoint candidate.',
    },
  ],

  479: [
    {
      sourceType:
        'PUBLIC_BUSINESS_DIRECTORY',

      sourceName:
        'Thailand YellowPages',

      observedCoordinate: {
        lat: 9.20883,
        lng: 99.16456,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public station listing consistent with the Transportpoint candidate.',
    },
  ],

  545: [
    {
      sourceType:
        'PUBLIC_BUSINESS_DIRECTORY',

      sourceName:
        'Thailand YellowPages',

      observedCoordinate: {
        lat: 6.89097,
        lng: 100.80508,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public station listing broadly consistent with the Transportpoint candidate.',
    },
  ],

  570: [
    {
      sourceType:
        'PUBLIC_BUSINESS_DIRECTORY',

      sourceName:
        'Thailand YellowPages',

      observedCoordinate: {
        lat: 6.19859,
        lng: 101.8194,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public station listing broadly consistent with the Transportpoint candidate.',
    },
  ],

  550: [
    {
      sourceType:
        'PUBLIC_BUSINESS_DIRECTORY',

      sourceName:
        'Thailand YellowPages',

      observedCoordinate: {
        lat: 6.72882,
        lng: 101.09415,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public Pattani/Khok Pho station listing consistent with the candidate.',
    },
  ],

  489: [
    {
      sourceType:
        'PUBLIC_LOCATION_DIRECTORY',

      sourceName:
        'WorldPlaces',

      observedCoordinate: {
        lat: 8.80129,
        lng: 99.3624,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public location listing consistent with the Transportpoint candidate.',
    },
  ],

  567: [
    {
      sourceType:
        'PUBLIC_MAP_DIRECTORY',

      sourceName:
        'Mapcarta',

      observedCoordinate: {
        lat: 6.2925,
        lng: 101.71379,
      },

      independence:
        'UNKNOWN',

      role:
        'CORROBORATION_ONLY',

      note:
        'Public geographic listing consistent with the Transportpoint candidate.',
    },
  ],
};

async function main() {
  console.log(
    '=== Apply SRT coordinate verification evidence ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const ledger =
    await readJson(INPUT);

  const rows =
    ledger.verifications;

  if (!Array.isArray(rows)) {
    throw new Error(
      'Verification ledger has no verifications array.'
    );
  }

  if (rows.length !== 11) {
    throw new Error(
      `Expected 11 verification records; found ${rows.length}.`
    );
  }

  const ledgerIds =
    new Set(
      rows.map(
        row => Number(row.stationId)
      )
    );

  const evidenceIds =
    Object.keys(EVIDENCE)
      .map(Number);

  for (const id of evidenceIds) {
    if (!ledgerIds.has(id)) {
      throw new Error(
        `Evidence station ${id} is not present in ledger.`
      );
    }
  }

  for (const row of rows) {
    const id =
      Number(row.stationId);

    const evidence =
      EVIDENCE[id];

    if (!evidence) {
      throw new Error(
        `No reviewed evidence for station ${id}.`
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
        `Invalid candidate coordinate for station ${id}.`
      );
    }

    row.externalEvidence =
      evidence.map(item => {
        const distance =
          haversineMeters(
            row.candidateCoordinate,
            item.observedCoordinate
          );

        return {
          ...item,

          candidateDistanceMeters:
            Math.round(
              distance * 10
            ) / 10,

          reviewedAt:
            nowIso(),
        };
      });

    row.verificationStatus =
      'EXTERNALLY_CORROBORATED';

    /*
     * Safety invariant:
     * corroboration is not production approval.
     */
    row.productionDecision =
      'NOT_APPROVED';

    row.approvedCoordinate =
      null;
  }

  const counts = {
    awaitingExternalEvidence: 0,
    externallyCorroborated: 0,
    conflictingEvidence: 0,
    rejected: 0,
    approvedForProduction: 0,
  };

  for (const row of rows) {
    switch (
      row.verificationStatus
    ) {
      case 'AWAITING_EXTERNAL_EVIDENCE':
        counts.awaitingExternalEvidence++;
        break;

      case 'EXTERNALLY_CORROBORATED':
        counts.externallyCorroborated++;
        break;

      case 'CONFLICTING_EVIDENCE':
        counts.conflictingEvidence++;
        break;

      case 'REJECTED':
        counts.rejected++;
        break;

      case 'APPROVED_FOR_PRODUCTION':
        counts.approvedForProduction++;
        break;

      default:
        throw new Error(
          `Unknown verification status for station ${row.stationId}: ${row.verificationStatus}`
        );
    }

    if (
      row.productionDecision !==
      'NOT_APPROVED'
    ) {
      throw new Error(
        `Unexpected production approval for station ${row.stationId}.`
      );
    }

    if (
      row.approvedCoordinate !==
      null
    ) {
      throw new Error(
        `approvedCoordinate must remain null for station ${row.stationId}.`
      );
    }
  }

  ledger.generatedAt =
    nowIso();

  ledger.productionModified =
    false;

  ledger.summary = {
    ...ledger.summary,

    verificationRecords:
      rows.length,

    ...counts,
  };

  ledger.evidencePolicy = {
    externalSourcesAreCorroborationOnly:
      true,

    sourceIndependenceGuaranteed:
      false,

    productionApprovalPerformed:
      false,

    note:
      'Public map/directory evidence may share upstream geographic data. Corroboration must not be interpreted as independent authoritative coordinate verification.',
  };

  await atomicWrite(
    OUTPUT,
    `${JSON.stringify(
      ledger,
      null,
      2
    )}\n`
  );

  console.log();
  console.log(
    '===== RESULT ====='
  );

  console.log(
    ledger.summary
  );

  console.log();
  console.log(
    '===== EVIDENCE DISTANCES ====='
  );

  for (const row of rows) {
    console.log({
      stationId:
        row.stationId,

      name:
        row.name,

      verificationStatus:
        row.verificationStatus,

      evidence:
        row.externalEvidence.map(
          evidence => ({
            source:
              evidence.sourceName,

            distanceMeters:
              evidence.candidateDistanceMeters,

            independence:
              evidence.independence,
          })
        ),

      productionDecision:
        row.productionDecision,

      approvedCoordinate:
        row.approvedCoordinate,
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
    'Evidence application failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
