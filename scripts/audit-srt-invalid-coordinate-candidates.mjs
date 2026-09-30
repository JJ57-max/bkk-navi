#!/usr/bin/env node

/**
 * audit-srt-invalid-coordinate-candidates.mjs
 *
 * Audit externally discovered candidate coordinates for the five
 * SRT normalized records whose official raw coordinates were rejected
 * as invalid-bounds.
 *
 * IMPORTANT:
 * - Candidate coordinates are UNVERIFIED.
 * - GISTDA proximity is only a geometric consistency check.
 * - Passing this audit does NOT approve a coordinate for production.
 * - Does not modify production data.
 * - Does not modify the verification ledger.
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

const STATIONS_PATH = join(
  ROOT,
  'public/data/srt/staging/official/srt-stations.normalized.json'
);

const TRACKS_PATH = join(
  ROOT,
  'public/data/srt/staging/tracks.gistda-national.raw.geojson'
);

const OUTPUT_PATH = join(
  ROOT,
  'public/data/srt/staging/official/srt-invalid-coordinate-candidate-audit.json'
);

const EARTH_RADIUS_M = 6371008.8;

/*
 * These are discovery candidates only.
 *
 * They MUST NOT be interpreted as approved coordinates.
 * Their purpose here is solely to test geometric consistency
 * against the existing GISTDA national railway geometry.
 */
const CANDIDATES = [
  {
    stationId: 26,
    expectedName: 'มาบพระจันทร์',
    candidateCoordinate: {
      lat: 14.4023,
      lng: 100.6321,
    },
    candidateStatus: 'UNVERIFIED_EXTERNAL_CANDIDATE',
  },
  {
    stationId: 29,
    expectedName: 'ชุมทางบ้านภาชี',
    candidateCoordinate: {
      lat: 14.4508,
      lng: 100.7212,
    },
    candidateStatus: 'UNVERIFIED_EXTERNAL_CANDIDATE',
  },
  {
    stationId: 50,
    expectedName: 'ช่องแค',
    candidateCoordinate: {
      lat: 15.1650,
      lng: 100.4208,
    },
    candidateStatus: 'UNVERIFIED_EXTERNAL_CANDIDATE',
  },
  {
    stationId: 281,
    expectedName: 'บ้านเหลื่อม',
    candidateCoordinate: {
      lat: 15.6002,
      lng: 102.1200,
    },
    candidateStatus: 'UNVERIFIED_EXTERNAL_CANDIDATE',
  },
  {
    stationId: 356,
    expectedName: 'บางละมุง',
    candidateCoordinate: {
      lat: 13.0345,
      lng: 100.9400,
    },
    candidateStatus: 'UNVERIFIED_EXTERNAL_CANDIDATE',
  },
];

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
      `${JSON.stringify(value, null, 2)}\n`
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

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function toLocalXY(
  lat,
  lng,
  originLat,
  originLng
) {
  const lat0 =
    toRadians(originLat);

  const x =
    EARTH_RADIUS_M *
    toRadians(lng - originLng) *
    Math.cos(lat0);

  const y =
    EARTH_RADIUS_M *
    toRadians(lat - originLat);

  return {
    x,
    y,
  };
}

function pointToSegmentDistanceMeters(
  stationLat,
  stationLng,
  a,
  b
) {
  const p = {
    x: 0,
    y: 0,
  };

  const pa =
    toLocalXY(
      a[1],
      a[0],
      stationLat,
      stationLng
    );

  const pb =
    toLocalXY(
      b[1],
      b[0],
      stationLat,
      stationLng
    );

  const abX =
    pb.x - pa.x;

  const abY =
    pb.y - pa.y;

  const lengthSquared =
    abX * abX +
    abY * abY;

  if (lengthSquared === 0) {
    return {
      distance:
        Math.hypot(
          pa.x - p.x,
          pa.y - p.y
        ),

      t: 0,
    };
  }

  let t =
    (
      (p.x - pa.x) * abX +
      (p.y - pa.y) * abY
    ) /
    lengthSquared;

  t =
    Math.max(
      0,
      Math.min(
        1,
        t
      )
    );

  const closestX =
    pa.x + t * abX;

  const closestY =
    pa.y + t * abY;

  return {
    distance:
      Math.hypot(
        closestX,
        closestY
      ),

    t,
  };
}

function interpolateCoordinate(
  a,
  b,
  t
) {
  return {
    lng:
      a[0] +
      (b[0] - a[0]) * t,

    lat:
      a[1] +
      (b[1] - a[1]) * t,
  };
}

function extractLineStrings(
  feature
) {
  const geometry =
    feature?.geometry;

  if (!geometry) {
    return [];
  }

  if (
    geometry.type === 'LineString' &&
    Array.isArray(
      geometry.coordinates
    )
  ) {
    return [
      geometry.coordinates,
    ];
  }

  if (
    geometry.type === 'MultiLineString' &&
    Array.isArray(
      geometry.coordinates
    )
  ) {
    return geometry.coordinates;
  }

  return [];
}

function validCoordinatePair(
  coordinate
) {
  return (
    Array.isArray(coordinate) &&
    coordinate.length >= 2 &&
    Number.isFinite(coordinate[0]) &&
    Number.isFinite(coordinate[1])
  );
}

function buildSegments(
  geojson
) {
  const segments = [];

  for (
    let featureIndex = 0;
    featureIndex <
      (geojson.features ?? []).length;
    featureIndex += 1
  ) {
    const feature =
      geojson.features[
        featureIndex
      ];

    const lines =
      extractLineStrings(
        feature
      );

    for (
      let lineIndex = 0;
      lineIndex < lines.length;
      lineIndex += 1
    ) {
      const line =
        lines[lineIndex];

      for (
        let i = 0;
        i < line.length - 1;
        i += 1
      ) {
        const a = line[i];
        const b = line[i + 1];

        if (
          !validCoordinatePair(a) ||
          !validCoordinatePair(b)
        ) {
          continue;
        }

        segments.push({
          a,
          b,

          minLat:
            Math.min(
              a[1],
              b[1]
            ),

          maxLat:
            Math.max(
              a[1],
              b[1]
            ),

          minLng:
            Math.min(
              a[0],
              b[0]
            ),

          maxLng:
            Math.max(
              a[0],
              b[0]
            ),

          featureIndex,
          lineIndex,
          segmentIndex: i,

          properties:
            feature.properties ??
            {},
        });
      }
    }
  }

  return segments;
}

function candidateSegments(
  segments,
  lat,
  lng
) {
  const margin = 0.1;

  const candidates =
    segments.filter(
      (segment) =>
        segment.maxLat >=
          lat - margin &&
        segment.minLat <=
          lat + margin &&
        segment.maxLng >=
          lng - margin &&
        segment.minLng <=
          lng + margin
    );

  return candidates.length > 0
    ? candidates
    : segments;
}

function findNearestSegment(
  coordinate,
  segments
) {
  const lat =
    coordinate.lat;

  const lng =
    coordinate.lng;

  const candidates =
    candidateSegments(
      segments,
      lat,
      lng
    );

  let best = null;

  for (
    const segment
    of candidates
  ) {
    const result =
      pointToSegmentDistanceMeters(
        lat,
        lng,
        segment.a,
        segment.b
      );

    if (
      best === null ||
      result.distance <
        best.distanceMeters
    ) {
      best = {
        distanceMeters:
          result.distance,

        closestPoint:
          interpolateCoordinate(
            segment.a,
            segment.b,
            result.t
          ),

        featureIndex:
          segment.featureIndex,

        lineIndex:
          segment.lineIndex,

        segmentIndex:
          segment.segmentIndex,

        trackProperties:
          segment.properties,
      };
    }
  }

  return best;
}

/*
 * This classification is intentionally conservative.
 *
 * It describes only rail-geometry consistency.
 * It is NOT a verification or production decision.
 */
function railConsistency(
  distanceMeters
) {
  if (
    !Number.isFinite(
      distanceMeters
    )
  ) {
    return 'NO_RESULT';
  }

  if (distanceMeters <= 50) {
    return 'STRONG_GEOMETRIC_CONSISTENCY';
  }

  if (distanceMeters <= 250) {
    return 'PLAUSIBLE_GEOMETRIC_CONSISTENCY';
  }

  if (distanceMeters <= 1000) {
    return 'REQUIRES_REVIEW';
  }

  return 'GEOMETRIC_CONFLICT';
}

function extractRawCoordinate(
  station
) {
  return (
    station?.coordinate?.raw ??
    null
  );
}

async function main() {
  console.log(
    '=== SRT invalid-coordinate candidate audit ==='
  );

  console.log(
    'started:',
    nowIso()
  );

  const [
    stationData,
    tracks,
  ] =
    await Promise.all([
      readJson(
        STATIONS_PATH
      ),
      readJson(
        TRACKS_PATH
      ),
    ]);

  const stations =
    stationData.stations ?? [];

  const segments =
    buildSegments(
      tracks
    );

  if (segments.length === 0) {
    throw new Error(
      'No GISTDA railway segments found'
    );
  }

  console.log();
  console.log(
    'SRT stations:',
    stations.length
  );

  console.log(
    'GISTDA features:',
    (tracks.features ?? []).length
  );

  console.log(
    'GISTDA segments:',
    segments.length
  );

  const results = [];

  for (
    const candidate
    of CANDIDATES
  ) {
    const station =
      stations.find(
        row =>
          Number(row.id) ===
          candidate.stationId
      );

    if (!station) {
      throw new Error(
        `Station not found: ${candidate.stationId}`
      );
    }

    if (
      station.name !==
      candidate.expectedName
    ) {
      throw new Error(
        [
          'Station identity mismatch:',
          candidate.stationId,
          `expected=${candidate.expectedName}`,
          `actual=${station.name}`,
        ].join(' ')
      );
    }

    if (
      station.coordinate?.status !==
      'invalid-bounds'
    ) {
      throw new Error(
        [
          'Expected invalid-bounds:',
          candidate.stationId,
          station.name,
          `actual=${station.coordinate?.status}`,
        ].join(' ')
      );
    }

    const nearest =
      findNearestSegment(
        candidate.candidateCoordinate,
        segments
      );

    if (!nearest) {
      throw new Error(
        `No rail match for station ${candidate.stationId}`
      );
    }

    results.push({
      stationId:
        candidate.stationId,

      name:
        station.name,

      province:
        station.province ?? null,

      normalizedCoordinateStatus:
        station.coordinate?.status ??
        null,

      invalidSrtRawCoordinate:
        extractRawCoordinate(
          station
        ),

      candidateCoordinate:
        candidate.candidateCoordinate,

      candidateStatus:
        candidate.candidateStatus,

      candidateProvenance: {
        type:
          'EXTERNAL_DISCOVERY_VALUE',

        verificationState:
          'UNVERIFIED',

        note:
          'Candidate is supplied only for geometric audit. Source-level verification is required separately before any approval.',
      },

      gistdaRailCheck: {
        distanceMeters:
          Number(
            nearest.distanceMeters.toFixed(1)
          ),

        nearestRailCoordinate:
          nearest.closestPoint,

        consistency:
          railConsistency(
            nearest.distanceMeters
          ),

        trackReference: {
          featureIndex:
            nearest.featureIndex,

          lineIndex:
            nearest.lineIndex,

          segmentIndex:
            nearest.segmentIndex,

          properties:
            nearest.trackProperties,
        },
      },

      verificationStatus:
        'NOT_VERIFIED',

      productionDecision:
        'NOT_APPROVED',

      approvedCoordinate:
        null,
    });
  }

  const consistencyCounts = {};

  for (const row of results) {
    const key =
      row.gistdaRailCheck.consistency;

    consistencyCounts[key] =
      (consistencyCounts[key] ?? 0) + 1;
  }

  const output = {
    schemaVersion: 1,
    generatedAt: nowIso(),

    productionModified:
      false,

    purpose:
      'Geometric consistency audit for external candidates corresponding to SRT normalized invalid-bounds records.',

    warning:
      'GISTDA rail proximity does not independently verify station coordinates and must not by itself authorize production changes.',

    sources: {
      stations:
        'srt-stations.normalized.json',

      railwayGeometry:
        'tracks.gistda-national.raw.geojson',
    },

    policy: {
      candidateState:
        'UNVERIFIED_EXTERNAL_CANDIDATE',

      geometryRole:
        'CONSISTENCY_CHECK_ONLY',

      productionApproval:
        'PROHIBITED_BY_THIS_SCRIPT',
    },

    summary: {
      targetRecords:
        CANDIDATES.length,

      auditedRecords:
        results.length,

      consistency:
        consistencyCounts,

      approvedForProduction:
        0,
    },

    results,
  };

  await atomicWriteJson(
    OUTPUT_PATH,
    output
  );

  console.log();
  console.log(
    '===== RESULTS ====='
  );

  for (const row of results) {
    console.log({
      stationId:
        row.stationId,

      name:
        row.name,

      province:
        row.province,

      raw:
        row.invalidSrtRawCoordinate,

      candidate:
        row.candidateCoordinate,

      railDistanceMeters:
        row.gistdaRailCheck
          .distanceMeters,

      railConsistency:
        row.gistdaRailCheck
          .consistency,

      productionDecision:
        row.productionDecision,
    });
  }

  console.log();
  console.log(
    '===== SUMMARY ====='
  );

  console.dir(
    output.summary,
    {
      depth: null,
    }
  );

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-invalid-coordinate-candidate-audit.json'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(
  error => {
    console.error(
      'Invalid-coordinate candidate audit failed:'
    );

    console.error(error);

    process.exitCode = 1;
  }
);
