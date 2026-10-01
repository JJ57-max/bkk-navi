#!/usr/bin/env node

/**
 * build-srt-coordinate-review.mjs
 *
 * SRT coordinate anomaliesを、既存の監査結果と統合して
 * 人間によるレビュー用JSONを生成する。
 *
 * IMPORTANT:
 * - production data is never modified
 * - no coordinate is automatically approved
 * - Transportpoint is evidence/candidate only
 */

import {
  readFile,
  writeFile,
  mkdir,
  rename,
  rm,
} from 'node:fs/promises';

import {
  dirname,
  join,
} from 'node:path';

import process from 'node:process';

const ROOT = process.cwd();

const OFFICIAL_DIR = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official'
);

const FILES = {
  anomalies: join(
    OFFICIAL_DIR,
    'srt-coordinate-anomaly-classification.json'
  ),
  transportpoint: join(
    OFFICIAL_DIR,
    'srt-transportpoint-audit.json'
  ),
  rail: join(
    OFFICIAL_DIR,
    'srt-rail-alignment-audit.json'
  ),
  stations: join(
    OFFICIAL_DIR,
    'srt-stations.normalized.json'
  ),
  output: join(
    OFFICIAL_DIR,
    'srt-coordinate-review.json'
  ),
};

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
    {
      recursive: true,
    }
  );

  const tempPath =
    `${path}.tmp-${process.pid}`;

  try {
    await writeFile(
      tempPath,
      `${JSON.stringify(value, null, 2)}\n`,
      'utf8'
    );

    await rename(
      tempPath,
      path
    );
  } catch (error) {
    await rm(
      tempPath,
      {
        force: true,
      }
    ).catch(() => {});

    throw error;
  }
}

function finiteNumber(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value)
  );
}

function round1(value) {
  if (!finiteNumber(value)) {
    return null;
  }

  return (
    Math.round(value * 10) /
    10
  );
}

function coordinateOrNull(value) {
  if (
    !value ||
    !finiteNumber(value.lat) ||
    !finiteNumber(value.lng)
  ) {
    return null;
  }

  return {
    lat: value.lat,
    lng: value.lng,
  };
}

function buildIndex(
  rows,
  getId,
  label
) {
  const map = new Map();

  for (const row of rows) {
    const id = getId(row);

    if (
      id === null ||
      id === undefined
    ) {
      continue;
    }

    if (map.has(id)) {
      throw new Error(
        `Duplicate ${label} ID: ${id}`
      );
    }

    map.set(id, row);
  }

  return map;
}

function evaluateEvidence({
  anomaly,
  rail,
  transport,
}) {
  const evidence = [];
  const reasons = [];

  const srtToRail =
    rail?.distanceMeters ??
    anomaly?.distanceMeters ??
    null;

  const tpToRail =
    transport
      ?.distancesMeters
      ?.transportpointToRail ??
    null;

  const srtToTp =
    transport
      ?.distancesMeters
      ?.srtToTransportpoint ??
    null;

  if (
    finiteNumber(srtToRail)
  ) {
    evidence.push({
      type: 'SRT_TO_RAIL',
      distanceMeters:
        round1(srtToRail),
      source:
        'SRT official coordinate vs GISTDA national railway geometry',
    });
  }

  if (transport) {
    evidence.push({
      type:
        'TRANSPORTPOINT_NAME_MATCH',
      matchMethod:
        'exact-name',
      osmId:
        transport
          .transportpoint
          ?.osmId ??
        null,
      fclass:
        transport
          .transportpoint
          ?.fclass ??
        null,
      source:
        'GISTDA Thai_Transportpoint',
    });

    if (
      finiteNumber(tpToRail)
    ) {
      evidence.push({
        type:
          'TRANSPORTPOINT_TO_RAIL',
        distanceMeters:
          round1(tpToRail),
        source:
          'GISTDA Transportpoint vs GISTDA national railway geometry',
      });
    }

    if (
      finiteNumber(srtToTp)
    ) {
      evidence.push({
        type:
          'SRT_TO_TRANSPORTPOINT',
        distanceMeters:
          round1(srtToTp),
        source:
          'SRT official coordinate vs GISTDA Transportpoint',
      });
    }
  }

  let confidence =
    'INSUFFICIENT';

  let recommendedAction =
    'MANUAL_REVIEW';

  /*
   * HIGH:
   * - exact-name Transportpoint exists
   * - Transportpoint is extremely close to rail
   * - SRT coordinate is >= 1 km from rail
   * - SRT and Transportpoint are >= 1 km apart
   *
   * Even HIGH does NOT mean automatic production approval.
   */
  if (
    transport &&
    finiteNumber(tpToRail) &&
    finiteNumber(srtToRail) &&
    finiteNumber(srtToTp) &&
    tpToRail <= 100 &&
    srtToRail >= 1000 &&
    srtToTp >= 1000
  ) {
    confidence =
      'HIGH_CANDIDATE';

    recommendedAction =
      'VERIFY_TRANSPORTPOINT_CANDIDATE';

    reasons.push(
      'Exact-name Transportpoint exists.'
    );

    reasons.push(
      `Transportpoint is ${round1(tpToRail)} m from railway geometry.`
    );

    reasons.push(
      `SRT coordinate is ${round1(srtToRail)} m from railway geometry.`
    );

    reasons.push(
      `SRT and Transportpoint coordinates differ by ${round1(srtToTp)} m.`
    );

    reasons.push(
      'Transportpoint is a strong correction candidate, but independent verification is still required.'
    );

    return {
      confidence,
      recommendedAction,
      evidence,
      reasons,
    };
  }

  /*
   * MEDIUM:
   * Transportpoint exists and is close to rail, but displacement
   * is smaller or evidence is less decisive.
   */
  if (
    transport &&
    finiteNumber(tpToRail) &&
    tpToRail <= 100
  ) {
    confidence =
      'MEDIUM_CANDIDATE';

    recommendedAction =
      'VERIFY_TRANSPORTPOINT_CANDIDATE';

    reasons.push(
      'Exact-name Transportpoint exists.'
    );

    reasons.push(
      `Transportpoint is ${round1(tpToRail)} m from railway geometry.`
    );

    if (
      finiteNumber(srtToRail)
    ) {
      reasons.push(
        `SRT coordinate is ${round1(srtToRail)} m from railway geometry.`
      );
    }

    reasons.push(
      'Transportpoint is useful supporting evidence, but is not sufficient for automatic correction.'
    );

    return {
      confidence,
      recommendedAction,
      evidence,
      reasons,
    };
  }

  /*
   * No Transportpoint match:
   * preserve anomaly for external/manual verification.
   */
  if (!transport) {
    confidence =
      'INSUFFICIENT';

    recommendedAction =
      'REQUIRE_EXTERNAL_VERIFICATION';

    reasons.push(
      'No exact-name Transportpoint match is available.'
    );

    if (
      finiteNumber(srtToRail)
    ) {
      reasons.push(
        `SRT coordinate is ${round1(srtToRail)} m from railway geometry.`
      );
    }

    reasons.push(
      'Rail proximity alone cannot establish the correct station coordinate.'
    );

    return {
      confidence,
      recommendedAction,
      evidence,
      reasons,
    };
  }

  confidence =
    'LOW_OR_CONFLICTING';

  recommendedAction =
    'MANUAL_REVIEW';

  reasons.push(
    'Transportpoint evidence exists but does not satisfy the current candidate thresholds.'
  );

  if (
    finiteNumber(tpToRail)
  ) {
    reasons.push(
      `Transportpoint is ${round1(tpToRail)} m from railway geometry.`
    );
  }

  if (
    finiteNumber(srtToRail)
  ) {
    reasons.push(
      `SRT coordinate is ${round1(srtToRail)} m from railway geometry.`
    );
  }

  return {
    confidence,
    recommendedAction,
    evidence,
    reasons,
  };
}

async function main() {
  console.log(
    '=== SRT coordinate review builder ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const [
    anomalyData,
    transportData,
    railData,
    stationData,
  ] = await Promise.all([
    readJson(FILES.anomalies),
    readJson(FILES.transportpoint),
    readJson(FILES.rail),
    readJson(FILES.stations),
  ]);

  const anomalies =
    anomalyData.anomalies ?? [];

  const transportRows =
    transportData.results ?? [];

  const railRows =
    railData.results ?? [];

  const stations =
    stationData.stations ?? [];

  const transportById =
    buildIndex(
      transportRows,
      row => row.stationId,
      'Transportpoint'
    );

  const railById =
    buildIndex(
      railRows,
      row => row.stationId,
      'rail audit'
    );

  const stationById =
    buildIndex(
      stations,
      row => row.id,
      'SRT station'
    );

  const seenAnomalyIds =
    new Set();

  const reviews = [];

  for (const anomaly of anomalies) {
    const id =
      anomaly.id;

    if (
      id === null ||
      id === undefined
    ) {
      throw new Error(
        'Anomaly without station ID'
      );
    }

    if (
      seenAnomalyIds.has(id)
    ) {
      throw new Error(
        `Duplicate anomaly ID: ${id}`
      );
    }

    seenAnomalyIds.add(id);

    const station =
      stationById.get(id) ??
      null;

    const rail =
      railById.get(id) ??
      null;

    const transport =
      transportById.get(id) ??
      null;

    if (!station) {
      throw new Error(
        `SRT station not found for anomaly ID ${id}`
      );
    }

    if (!rail) {
      throw new Error(
        `Rail audit record not found for anomaly ID ${id}`
      );
    }

    if (
      station.name !== anomaly.name
    ) {
      throw new Error(
        `Name mismatch for station ID ${id}: "${station.name}" vs "${anomaly.name}"`
      );
    }

    if (
      station.province !==
      anomaly.province
    ) {
      throw new Error(
        `Province mismatch for station ID ${id}: "${station.province}" vs "${anomaly.province}"`
      );
    }

    const evaluation =
      evaluateEvidence({
        anomaly,
        rail,
        transport,
      });

    reviews.push({
      stationId: id,

      name:
        station.name,

      province:
        station.province,

      district:
        station.district ??
        null,

      subdistrict:
        station.subdistrict ??
        null,

      postcode:
        station.postcode ??
        null,

      detail:
        station.detail ??
        null,

      anomaly: {
        classification:
          anomaly.classification,

        classificationLabel:
          anomaly.classificationLabel,

        displacement:
          anomaly.displacement,

        coordinateStatus:
          anomaly.coordinateStatus,
      },

      coordinates: {
        srt:
          coordinateOrNull(
            rail.stationCoordinate
          ),

        nearestRail:
          coordinateOrNull(
            anomaly.nearestRailCoordinate
          ),

        transportpoint:
          coordinateOrNull(
            transport
              ?.transportpoint
              ?.coordinate
          ),
      },

      distancesMeters: {
        srtToRail:
          round1(
            rail.distanceMeters
          ),

        srtToTransportpoint:
          round1(
            transport
              ?.distancesMeters
              ?.srtToTransportpoint
          ),

        transportpointToRail:
          round1(
            transport
              ?.distancesMeters
              ?.transportpointToRail
          ),
      },

      rail: {
        band:
          rail.band,

        track:
          rail.track,
      },

      transportpoint:
        transport
          ? {
              osmId:
                transport
                  .transportpoint
                  ?.osmId ??
                null,

              fclass:
                transport
                  .transportpoint
                  ?.fclass ??
                null,

              name:
                transport
                  .transportpoint
                  ?.name ??
                null,

              matchMethod:
                'exact-name',
            }
          : null,

      evidence:
        evaluation.evidence,

      confidence:
        evaluation.confidence,

      recommendedAction:
        evaluation
          .recommendedAction,

      reasons:
        evaluation.reasons,

      reviewStatus:
        'PENDING',

      approvedCoordinate:
        null,

      reviewerNote:
        null,
    });
  }

  const confidenceCounts = {};
  const actionCounts = {};

  for (const row of reviews) {
    confidenceCounts[
      row.confidence
    ] =
      (
        confidenceCounts[
          row.confidence
        ] ??
        0
      ) + 1;

    actionCounts[
      row.recommendedAction
    ] =
      (
        actionCounts[
          row.recommendedAction
        ] ??
        0
      ) + 1;
  }

  const output = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    productionModified:
      false,

    purpose:
      'Human-review evidence layer for SRT coordinate anomalies',

    warning:
      'Candidate confidence is diagnostic only. No coordinate in this file is automatically approved for production.',

    sources: {
      anomalies:
        'srt-coordinate-anomaly-classification.json',

      transportpoint:
        'srt-transportpoint-audit.json',

      rail:
        'srt-rail-alignment-audit.json',

      stations:
        'srt-stations.normalized.json',
    },

    policy: {
      automaticProductionCorrection:
        false,

      highCandidateRule:
        'Exact-name Transportpoint; Transportpoint <=100m from rail; SRT >=1000m from rail; SRT-to-Transportpoint >=1000m.',

      transportpointRole:
        'Validation and correction candidate only; independent verification required.',
    },

    summary: {
      anomalyRecords:
        anomalies.length,

      reviewRecords:
        reviews.length,

      withTransportpoint:
        reviews.filter(
          row =>
            row.transportpoint !== null
        ).length,

      withoutTransportpoint:
        reviews.filter(
          row =>
            row.transportpoint === null
        ).length,

      confidence:
        confidenceCounts,

      recommendedActions:
        actionCounts,

      pending:
        reviews.filter(
          row =>
            row.reviewStatus ===
            'PENDING'
        ).length,
    },

    reviews,
  };

  if (
    output.summary.anomalyRecords !==
    output.summary.reviewRecords
  ) {
    throw new Error(
      'Review count does not match anomaly count'
    );
  }

  await atomicWriteJson(
    FILES.output,
    output
  );

  console.log();
  console.log(
    '===== REVIEW SUMMARY ====='
  );

  console.log(
    output.summary
  );

  console.log();
  console.log(
    '===== HIGH CANDIDATES ====='
  );

  for (
    const row
    of reviews.filter(
      r =>
        r.confidence ===
        'HIGH_CANDIDATE'
    )
  ) {
    console.log({
      stationId:
        row.stationId,

      name:
        row.name,

      province:
        row.province,

      srtToRail:
        row.distancesMeters
          .srtToRail,

      srtToTransportpoint:
        row.distancesMeters
          .srtToTransportpoint,

      transportpointToRail:
        row.distancesMeters
          .transportpointToRail,
    });
  }

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-coordinate-review.json'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(
  error => {
    console.error(
      'Review build failed:'
    );

    console.error(error);

    process.exitCode = 1;
  }
);
