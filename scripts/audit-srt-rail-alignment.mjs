#!/usr/bin/env node

/**
 * audit-srt-rail-alignment.mjs
 *
 * Compare SRT official/normalized station coordinates
 * against GISTDA national railway geometry.
 *
 * READ ONLY:
 * - Does not modify production data.
 * - Does not modify SRT staging data.
 * - Does not infer missing station coordinates.
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
  'public/data/srt/staging/official/srt-rail-alignment-audit.json'
);

const EARTH_RADIUS_M = 6371008.8;

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

/*
 * Convert a geographic point to a local metric plane
 * centred around the station.
 *
 * For station-to-nearby-track distance this gives
 * sufficiently accurate metre-scale measurements
 * without introducing another dependency.
 */
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

/*
 * Build segment list once.
 *
 * A simple bounding-box prefilter is stored for each
 * segment to avoid unnecessary exact distance work.
 */
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

/*
 * Initial search window.
 *
 * 0.1 degree is intentionally generous for auditing.
 * If no candidate is found, we fall back to all
 * segments rather than silently returning no match.
 */
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
  station,
  segments
) {
  const lat =
    station.coordinate.lat;

  const lng =
    station.coordinate.lng;

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

function distanceBand(
  distance
) {
  if (distance <= 50) {
    return '0-50m';
  }

  if (distance <= 100) {
    return '50-100m';
  }

  if (distance <= 250) {
    return '100-250m';
  }

  if (distance <= 500) {
    return '250-500m';
  }

  if (distance <= 1000) {
    return '500-1000m';
  }

  return '1000m+';
}

function percentile(
  sortedValues,
  p
) {
  if (
    sortedValues.length === 0
  ) {
    return null;
  }

  const index =
    (sortedValues.length - 1) *
    p;

  const lower =
    Math.floor(index);

  const upper =
    Math.ceil(index);

  if (lower === upper) {
    return sortedValues[lower];
  }

  const fraction =
    index - lower;

  return (
    sortedValues[lower] *
      (1 - fraction) +
    sortedValues[upper] *
      fraction
  );
}

async function main() {
  console.log(
    '=== SRT / GISTDA rail alignment audit ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const stationData =
    await readJson(
      STATIONS_PATH
    );

  const trackData =
    await readJson(
      TRACKS_PATH
    );

  const stations =
    (
      stationData.stations ??
      []
    ).filter(
      (station) =>
        (
          station.coordinate
            ?.status ===
            'official-valid' ||
          station.coordinate
            ?.status ===
            'official-normalized'
        ) &&
        Number.isFinite(
          station.coordinate.lat
        ) &&
        Number.isFinite(
          station.coordinate.lng
        )
    );

  console.log(
    'usable SRT stations:',
    stations.length
  );

  const segments =
    buildSegments(
      trackData
    );

  console.log(
    'GISTDA features:',
    trackData.features?.length ??
      0
  );

  console.log(
    'GISTDA segments:',
    segments.length
  );

  if (
    stations.length === 0
  ) {
    throw new Error(
      'No usable SRT station coordinates found'
    );
  }

  if (
    segments.length === 0
  ) {
    throw new Error(
      'No GISTDA railway segments found'
    );
  }

  const results = [];

  for (
    let i = 0;
    i < stations.length;
    i += 1
  ) {
    const station =
      stations[i];

    const nearest =
      findNearestSegment(
        station,
        segments
      );

    if (!nearest) {
      throw new Error(
        `No railway match for station ${station.id} ${station.name ?? ''}`
      );
    }

    results.push({
      stationId:
        station.id,

      name:
        station.name,

      province:
        station.province,

      coordinateStatus:
        station.coordinate.status,

      stationCoordinate: {
        lat:
          station.coordinate.lat,

        lng:
          station.coordinate.lng,
      },

      distanceMeters:
        nearest.distanceMeters,

      band:
        distanceBand(
          nearest.distanceMeters
        ),

      closestTrackPoint:
        nearest.closestPoint,

      track: {
        featureIndex:
          nearest.featureIndex,

        lineIndex:
          nearest.lineIndex,

        segmentIndex:
          nearest.segmentIndex,

        properties:
          nearest.trackProperties,
      },
    });

    if (
      (i + 1) % 100 === 0 ||
      i + 1 === stations.length
    ) {
      console.log(
        `processed: ${i + 1}/${stations.length}`
      );
    }
  }

  const bands = {
    '0-50m': 0,
    '50-100m': 0,
    '100-250m': 0,
    '250-500m': 0,
    '500-1000m': 0,
    '1000m+': 0,
  };

  for (
    const result
    of results
  ) {
    bands[result.band] += 1;
  }

  const distances =
    results
      .map(
        (result) =>
          result.distanceMeters
      )
      .sort(
        (a, b) =>
          a - b
      );

  const sortedWorstFirst =
    [...results]
      .sort(
        (a, b) =>
          b.distanceMeters -
          a.distanceMeters
      );

  const summary = {
    stationsAudited:
      results.length,

    bands,

    statisticsMeters: {
      min:
        distances[0],

      median:
        percentile(
          distances,
          0.5
        ),

      p90:
        percentile(
          distances,
          0.9
        ),

      p95:
        percentile(
          distances,
          0.95
        ),

      p99:
        percentile(
          distances,
          0.99
        ),

      max:
        distances[
          distances.length - 1
        ],
    },

    over250m:
      results.filter(
        (result) =>
          result.distanceMeters >
          250
      ).length,

    over500m:
      results.filter(
        (result) =>
          result.distanceMeters >
          500
      ).length,

    over1000m:
      results.filter(
        (result) =>
          result.distanceMeters >
          1000
      ).length,
  };

  const output = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    purpose:
      'Audit SRT official station coordinates against GISTDA national railway geometry',

    productionModified:
      false,

    inputs: {
      stations:
        'public/data/srt/staging/official/srt-stations.normalized.json',

      tracks:
        'public/data/srt/staging/tracks.gistda-national.raw.geojson',
    },

    summary,

    worst50:
      sortedWorstFirst.slice(
        0,
        50
      ),

    results,
  };

  await atomicWriteJson(
    OUTPUT_PATH,
    output
  );

  console.log();
  console.log(
    '===== ALIGNMENT SUMMARY ====='
  );

  console.log(
    'stations:',
    summary.stationsAudited
  );

  console.log(
    'bands:',
    summary.bands
  );

  console.log(
    'statistics meters:',
    summary.statisticsMeters
  );

  console.log(
    '>250m:',
    summary.over250m
  );

  console.log(
    '>500m:',
    summary.over500m
  );

  console.log(
    '>1000m:',
    summary.over1000m
  );

  console.log();
  console.log(
    '===== WORST 20 ====='
  );

  for (
    const row
    of sortedWorstFirst.slice(
      0,
      20
    )
  ) {
    console.log({
      id:
        row.stationId,

      name:
        row.name,

      province:
        row.province,

      coordinateStatus:
        row.coordinateStatus,

      distanceMeters:
        Math.round(
          row.distanceMeters *
          10
        ) / 10,

      trackName:
        row.track.properties
          ?.NAME ??
        row.track.properties
          ?.NAMT ??
        null,
    });
  }

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-rail-alignment-audit.json'
  );

  console.log(
    'production modified: false'
  );
}

main().catch(
  (error) => {
    console.error();
    console.error(
      'Alignment audit failed:'
    );

    console.error(error);

    process.exitCode = 1;
  }
);