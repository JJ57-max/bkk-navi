#!/usr/bin/env node

/**
 * classify-srt-coordinate-anomalies.mjs
 *
 * SRT公式駅座標のうち、GISTDA national railway geometry から
 * 1km以上離れている駅を対象に、ずれ方を分類する。
 *
 * IMPORTANT:
 * - Audit / classification only
 * - Production data is NOT modified
 * - A classification is a diagnostic hint, NOT proof that the SRT
 *   coordinate or GISTDA geometry is wrong.
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

const INPUT_PATH = join(
  ROOT,
  'public/data/srt/staging/official/srt-rail-alignment-audit.json'
);

const OUTPUT_PATH = join(
  ROOT,
  'public/data/srt/staging/official/srt-coordinate-anomaly-classification.json'
);

const THRESHOLD_METERS = 1000;

/*
 * Component thresholds.
 *
 * <= 250m:
 *   Treat this axis as approximately aligned.
 *
 * > 1000m:
 *   Treat this axis as materially displaced.
 *
 * The area between 250m and 1000m is intentionally classified
 * as mixed/uncertain rather than forcing a diagnosis.
 */
const ALIGNED_AXIS_METERS = 250;
const DISPLACED_AXIS_METERS = 1000;

function nowIso() {
  return new Date().toISOString();
}

async function readJson(path) {
  return JSON.parse(
    await readFile(path, 'utf8')
  );
}

async function atomicWrite(path, data) {
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
      data
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

async function writeJson(path, value) {
  await atomicWrite(
    path,
    `${JSON.stringify(value, null, 2)}\n`
  );
}

function validCoordinate(value) {
  return (
    value &&
    Number.isFinite(value.lat) &&
    Number.isFinite(value.lng)
  );
}

function haversineMeters(a, b) {
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
 * Convert the lat/lng difference into approximate
 * north/south and east/west displacement.
 *
 * We calculate each component independently using
 * Haversine distance while fixing the other axis.
 */
function coordinateComponents(
  station,
  rail
) {
  const latitudeOnlyPoint = {
    lat: rail.lat,
    lng: station.lng,
  };

  const longitudeOnlyPoint = {
    lat: station.lat,
    lng: rail.lng,
  };

  const latitudeMeters =
    haversineMeters(
      station,
      latitudeOnlyPoint
    );

  const longitudeMeters =
    haversineMeters(
      station,
      longitudeOnlyPoint
    );

  return {
    latitudeMeters,
    longitudeMeters,

    latitudeDeltaDegrees:
      rail.lat -
      station.lat,

    longitudeDeltaDegrees:
      rail.lng -
      station.lng,
  };
}

function classify(
  latitudeMeters,
  longitudeMeters
) {
  const latAligned =
    latitudeMeters <=
    ALIGNED_AXIS_METERS;

  const lngAligned =
    longitudeMeters <=
    ALIGNED_AXIS_METERS;

  const latDisplaced =
    latitudeMeters >
    DISPLACED_AXIS_METERS;

  const lngDisplaced =
    longitudeMeters >
    DISPLACED_AXIS_METERS;

  if (
    latAligned &&
    lngDisplaced
  ) {
    return {
      code:
        'LONGITUDE_DOMINANT',

      label:
        'Latitude approximately aligned; longitude strongly displaced',
    };
  }

  if (
    lngAligned &&
    latDisplaced
  ) {
    return {
      code:
        'LATITUDE_DOMINANT',

      label:
        'Longitude approximately aligned; latitude strongly displaced',
    };
  }

  if (
    latDisplaced &&
    lngDisplaced
  ) {
    return {
      code:
        'BOTH_AXES_DISPLACED',

      label:
        'Both latitude and longitude strongly displaced',
    };
  }

  if (
    latAligned &&
    lngAligned
  ) {
    /*
     * This should normally not occur for >1km total distance,
     * but keep it explicit as an integrity check.
     */
    return {
      code:
        'INCONSISTENT',

      label:
        'Total distance and component distances are inconsistent',
    };
  }

  return {
    code:
      'MIXED_OR_UNCERTAIN',

    label:
      'Mixed displacement; no single-axis diagnosis is safe',
  };
}

function getResults(data) {
  if (
    Array.isArray(data)
  ) {
    return data;
  }

  for (
    const key
    of [
      'results',
      'stations',
      'records',
      'audit',
    ]
  ) {
    if (
      Array.isArray(data?.[key])
    ) {
      return data[key];
    }
  }

  throw new Error(
    'Could not locate audit result array'
  );
}

function getStationCoordinate(record) {
  const candidates = [
    record.stationCoordinate,
    record.srtCoordinate,
    record.coordinate,
  ];

  for (const candidate of candidates) {
    if (
      validCoordinate(candidate)
    ) {
      return {
        lat:
          Number(candidate.lat),

        lng:
          Number(candidate.lng),
      };
    }
  }

  return null;
}

function getRailCoordinate(record) {
  const candidates = [
    record.closestTrackPoint,
    record.nearestTrackPoint,
    record.nearestPoint,
    record.nearestRail?.nearestPoint,
  ];

  for (const candidate of candidates) {
    if (
      validCoordinate(candidate)
    ) {
      return {
        lat:
          Number(candidate.lat),

        lng:
          Number(candidate.lng),
      };
    }

    /*
     * Some earlier audit output uses GeoJSON order.
     */
    if (
      Array.isArray(candidate) &&
      candidate.length >= 2 &&
      Number.isFinite(
        Number(candidate[0])
      ) &&
      Number.isFinite(
        Number(candidate[1])
      )
    ) {
      return {
        lng:
          Number(candidate[0]),

        lat:
          Number(candidate[1]),
      };
    }
  }

  return null;
}

function getDistance(record) {
  const candidates = [
    record.distanceMeters,
    record.distance,
    record.railDistanceMeters,
  ];

  for (const candidate of candidates) {
    const value =
      Number(candidate);

    if (
      Number.isFinite(value)
    ) {
      return value;
    }
  }

  return null;
}

function round(value, digits = 1) {
  if (
    !Number.isFinite(value)
  ) {
    return null;
  }

  const factor =
    10 ** digits;

  return (
    Math.round(
      value * factor
    ) / factor
  );
}

async function main() {
  console.log(
    '=== SRT coordinate anomaly classification ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const data =
    await readJson(
      INPUT_PATH
    );

  const records =
    getResults(data);

  console.log(
    'audit records:',
    records.length
  );

  const anomalies = [];

  const skipped = [];

  for (
    const record
    of records
  ) {
    const distanceMeters =
      getDistance(record);

    if (
      !Number.isFinite(
        distanceMeters
      ) ||
      distanceMeters <=
        THRESHOLD_METERS
    ) {
      continue;
    }

    const stationCoordinate =
      getStationCoordinate(
        record
      );

    const railCoordinate =
      getRailCoordinate(
        record
      );

    if (
      !stationCoordinate ||
      !railCoordinate
    ) {
      skipped.push({
        id:
          record.stationId ?? null,

        name:
          record.name ?? null,

        province:
          record.province ?? null,

        reason:
          'Missing station or nearest-rail coordinate',
      });

      continue;
    }

    const components =
      coordinateComponents(
        stationCoordinate,
        railCoordinate
      );

    const classification =
      classify(
        components.latitudeMeters,
        components.longitudeMeters
      );

    anomalies.push({
      id:
        record.stationId ?? null,

      name:
        record.name ?? null,

      province:
        record.province ?? null,

      coordinateStatus:
        record.coordinateStatus ??
        null,

      distanceMeters:
        round(
          distanceMeters
        ),

      classification:
        classification.code,

      classificationLabel:
        classification.label,

      stationCoordinate,

      nearestRailCoordinate:
        railCoordinate,

      displacement: {
        latitudeMeters:
          round(
            components.latitudeMeters
          ),

        longitudeMeters:
          round(
            components.longitudeMeters
          ),

        latitudeDeltaDegrees:
          round(
            components.latitudeDeltaDegrees,
            7
          ),

        longitudeDeltaDegrees:
          round(
            components.longitudeDeltaDegrees,
            7
          ),
      },

      track: {
        featureIndex:
          record.track?.featureIndex ??
          null,

        properties:
          record.track?.properties ??
          null,
      },
    });
  }

  const counts = {};

  for (
    const row
    of anomalies
  ) {
    counts[
      row.classification
    ] =
      (
        counts[
          row.classification
        ] ?? 0
      ) + 1;
  }

  const byClassification = {};

  for (
    const row
    of anomalies
  ) {
    (
      byClassification[
        row.classification
      ] ??= []
    ).push(row);
  }

  for (
    const rows
    of Object.values(
      byClassification
    )
  ) {
    rows.sort(
      (a, b) =>
        b.distanceMeters -
        a.distanceMeters
    );
  }

  const output = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    productionModified:
      false,

    source:
      'public/data/srt/staging/official/srt-rail-alignment-audit.json',

    thresholds: {
      anomalyDistanceMeters:
        THRESHOLD_METERS,

      alignedAxisMeters:
        ALIGNED_AXIS_METERS,

      displacedAxisMeters:
        DISPLACED_AXIS_METERS,
    },

    warning:
      'Classification is diagnostic only. It does not establish whether SRT coordinates or GISTDA railway geometry are correct.',

    summary: {
      sourceRecords:
        records.length,

      anomalies:
        anomalies.length,

      skipped:
        skipped.length,

      classifications:
        counts,
    },

    byClassification,

    skipped,

    anomalies:
      [...anomalies].sort(
        (a, b) =>
          b.distanceMeters -
          a.distanceMeters
      ),
  };

  await writeJson(
    OUTPUT_PATH,
    output
  );

  console.log();
  console.log(
    '===== SUMMARY ====='
  );

  console.log(
    output.summary
  );

  const order = [
    'LONGITUDE_DOMINANT',
    'LATITUDE_DOMINANT',
    'BOTH_AXES_DISPLACED',
    'MIXED_OR_UNCERTAIN',
    'INCONSISTENT',
  ];

  for (
    const type
    of order
  ) {
    const rows =
      byClassification[type] ??
      [];

    console.log();
    console.log(
      `===== ${type} (${rows.length}) =====`
    );

    for (
      const row
      of rows
    ) {
      console.log({
        id:
          row.id,

        name:
          row.name,

        province:
          row.province,

        distance:
          row.distanceMeters,

        latShift:
          row.displacement
            .latitudeMeters,

        lngShift:
          row.displacement
            .longitudeMeters,

        latDelta:
          row.displacement
            .latitudeDeltaDegrees,

        lngDelta:
          row.displacement
            .longitudeDeltaDegrees,
      });
    }
  }

  if (
    skipped.length > 0
  ) {
    console.log();
    console.log(
      '===== SKIPPED ====='
    );

    console.log(skipped);
  }

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-coordinate-anomaly-classification.json'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(
  error => {
    console.error(
      'Classification failed:'
    );

    console.error(error);

    process.exitCode = 1;
  }
);
