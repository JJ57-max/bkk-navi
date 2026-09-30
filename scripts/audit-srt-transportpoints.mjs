#!/usr/bin/env node

/**
 * SRT / GISTDA Transportpoint / GISTDA Railway cross audit
 *
 * Purpose:
 *  - Match official SRT passenger stations against GISTDA-hosted
 *    railway_station / railway_halt transport points.
 *  - Compare SRT coordinates with Transportpoint coordinates.
 *  - Compare both coordinates with the same national railway geometry.
 *
 * IMPORTANT:
 *  - Audit only.
 *  - Does NOT modify production data.
 *  - Transportpoint contains osm_id and must NOT be treated as an
 *    independent official SRT coordinate source.
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

const SRT_PATH = join(
  ROOT,
  'public/data/srt/staging/official/srt-stations.normalized.json'
);

const RAIL_PATH = join(
  ROOT,
  'public/data/srt/staging/tracks.gistda-national.raw.geojson'
);

const OUTPUT_PATH = join(
  ROOT,
  'public/data/srt/staging/official/srt-transportpoint-audit.json'
);

const TRANSPORTPOINT_URL =
  'https://gistdaportal.gistda.or.th/arcgis/rest/services/Hosted/Thai_Transportpoint/FeatureServer/0/query';

const FETCH_TIMEOUT_MS = 30000;

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
    { recursive: true }
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
      { force: true }
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

function normalizeThaiName(value) {
  return String(value ?? '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[()（）.\-–—_/]/g, '')
    .toLowerCase();
}

function validLatLng(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= 5 &&
    lat <= 21 &&
    lng >= 97 &&
    lng <= 106
  );
}

function getStationCoordinate(station) {
  const candidates = [
    station.coordinate,
    station.coordinates,
    station.location,
  ];

  for (const c of candidates) {
    if (!c || typeof c !== 'object') {
      continue;
    }

    const lat =
      Number(
        c.lat ??
        c.latitude
      );

    const lng =
      Number(
        c.lng ??
        c.lon ??
        c.long ??
        c.longitude
      );

    if (validLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  const lat =
    Number(
      station.lat ??
      station.latitude ??
      station.officialLat
    );

  const lng =
    Number(
      station.lng ??
      station.lon ??
      station.long ??
      station.longitude ??
      station.officialLng
    );

  if (validLatLng(lat, lng)) {
    return { lat, lng };
  }

  return null;
}

function getStationName(station) {
  return (
    station.name ??
    station.nameTh ??
    station.thaiName ??
    station.stationName ??
    station['ชื่อสถานีรถไฟ'] ??
    null
  );
}

function getStationId(station, index) {
  return (
    station.id ??
    station._id ??
    station.stationId ??
    index + 1
  );
}

function getProvince(station) {
  return (
    station.province ??
    station.provinceTh ??
    station['จังหวัด'] ??
    null
  );
}

function getCoordinateStatus(station) {
  return (
    station.coordinateStatus ??
    station.coordinate_status ??
    null
  );
}

function haversineMeters(a, b) {
  const R = 6371008.8;

  const toRad =
    deg => deg * Math.PI / 180;

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const dLat =
    lat2 - lat1;

  const dLng =
    toRad(b.lng - a.lng);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(dLng / 2) ** 2;

  return (
    2 *
    R *
    Math.asin(
      Math.min(1, Math.sqrt(h))
    )
  );
}

/**
 * Local equirectangular projection.
 * Sufficient for point-to-segment distance calculation
 * at the scale used by this audit.
 */
function projectAround(lat, lng, refLat) {
  const R = 6371008.8;
  const rad = Math.PI / 180;

  return {
    x:
      R *
      lng *
      rad *
      Math.cos(refLat * rad),

    y:
      R *
      lat *
      rad,
  };
}

function pointToSegmentDistanceMeters(
  point,
  a,
  b
) {
  const refLat =
    (
      point.lat +
      a.lat +
      b.lat
    ) / 3;

  const p =
    projectAround(
      point.lat,
      point.lng,
      refLat
    );

  const p1 =
    projectAround(
      a.lat,
      a.lng,
      refLat
    );

  const p2 =
    projectAround(
      b.lat,
      b.lng,
      refLat
    );

  const dx =
    p2.x - p1.x;

  const dy =
    p2.y - p1.y;

  const length2 =
    dx * dx +
    dy * dy;

  let t = 0;

  if (length2 > 0) {
    t =
      (
        (p.x - p1.x) * dx +
        (p.y - p1.y) * dy
      ) / length2;

    t =
      Math.max(
        0,
        Math.min(1, t)
      );
  }

  const nearestX =
    p1.x + t * dx;

  const nearestY =
    p1.y + t * dy;

  const distance =
    Math.hypot(
      p.x - nearestX,
      p.y - nearestY
    );

  const nearest = {
    lat:
      a.lat +
      t * (b.lat - a.lat),

    lng:
      a.lng +
      t * (b.lng - a.lng),
  };

  return {
    distance,
    nearest,
  };
}

function buildRailSegments(geojson) {
  const segments = [];

  for (
    let featureIndex = 0;
    featureIndex < geojson.features.length;
    featureIndex++
  ) {
    const feature =
      geojson.features[featureIndex];

    const geometry =
      feature.geometry;

    if (!geometry) {
      continue;
    }

    const lines = [];

    if (
      geometry.type === 'LineString'
    ) {
      lines.push(
        geometry.coordinates
      );
    } else if (
      geometry.type === 'MultiLineString'
    ) {
      lines.push(
        ...geometry.coordinates
      );
    } else {
      continue;
    }

    for (const line of lines) {
      for (
        let i = 0;
        i < line.length - 1;
        i++
      ) {
        const c1 = line[i];
        const c2 = line[i + 1];

        if (
          !Array.isArray(c1) ||
          !Array.isArray(c2)
        ) {
          continue;
        }

        const a = {
          lng: Number(c1[0]),
          lat: Number(c1[1]),
        };

        const b = {
          lng: Number(c2[0]),
          lat: Number(c2[1]),
        };

        if (
          !validLatLng(
            a.lat,
            a.lng
          ) ||
          !validLatLng(
            b.lat,
            b.lng
          )
        ) {
          continue;
        }

        segments.push({
          a,
          b,
          featureIndex,
          properties:
            feature.properties ?? {},
        });
      }
    }
  }

  return segments;
}

function nearestRail(point, segments) {
  let best = null;

  for (const segment of segments) {
    const result =
      pointToSegmentDistanceMeters(
        point,
        segment.a,
        segment.b
      );

    if (
      !best ||
      result.distance <
        best.distanceMeters
    ) {
      best = {
        distanceMeters:
          result.distance,

        nearestPoint:
          result.nearest,

        featureIndex:
          segment.featureIndex,

        properties:
          segment.properties,
      };
    }
  }

  return best;
}

async function fetchTransportpoints() {
  const params =
    new URLSearchParams({
      where:
        "fclass IN ('railway_station','railway_halt')",

      outFields:
        'osm_id,fclass,name',

      returnGeometry:
        'true',

      outSR:
        '4326',

      f:
        'geojson',
    });

  const controller =
    new AbortController();

  const timer =
    setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT_MS
    );

  try {
    const response =
      await fetch(
        `${TRANSPORTPOINT_URL}?${params}`,
        {
          signal:
            controller.signal,

          headers: {
            'user-agent':
              'bkk-navi-srt-audit/1.0',
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        `Transportpoint HTTP ${response.status} ${response.statusText}`
      );
    }

    const json =
      await response.json();

    if (json.error) {
      throw new Error(
        `Transportpoint API: ${JSON.stringify(json.error)}`
      );
    }

    return json;
  } finally {
    clearTimeout(timer);
  }
}

function transportpointRecord(
  feature,
  index
) {
  const coordinates =
    feature.geometry?.coordinates;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2
  ) {
    return null;
  }

  const lng =
    Number(coordinates[0]);

  const lat =
    Number(coordinates[1]);

  if (!validLatLng(lat, lng)) {
    return null;
  }

  const name =
    String(
      feature.properties?.name ??
      ''
    ).trim();

  if (!name) {
    return null;
  }

  return {
    index,
    osmId:
      feature.properties?.osm_id ??
      null,

    fclass:
      feature.properties?.fclass ??
      null,

    name,

    normalizedName:
      normalizeThaiName(name),

    coordinate: {
      lat,
      lng,
    },
  };
}

function distanceBand(value) {
  if (!Number.isFinite(value)) {
    return 'unknown';
  }

  if (value <= 50) {
    return '0-50m';
  }

  if (value <= 100) {
    return '50-100m';
  }

  if (value <= 250) {
    return '100-250m';
  }

  if (value <= 500) {
    return '250-500m';
  }

  if (value <= 1000) {
    return '500-1000m';
  }

  return '1000m+';
}

function summarizeDistances(values) {
  const clean =
    values
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

  if (clean.length === 0) {
    return null;
  }

  function percentile(p) {
    const index =
      Math.min(
        clean.length - 1,
        Math.floor(
          p * clean.length
        )
      );

    return clean[index];
  }

  return {
    count:
      clean.length,

    min:
      clean[0],

    median:
      percentile(0.5),

    p90:
      percentile(0.9),

    p95:
      percentile(0.95),

    max:
      clean[clean.length - 1],
  };
}

async function main() {
  console.log(
    '=== SRT / Transportpoint / Railway cross audit ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  const [
    srtData,
    railData,
    transportGeojson,
  ] =
    await Promise.all([
      readJson(SRT_PATH),
      readJson(RAIL_PATH),
      fetchTransportpoints(),
    ]);

  const srtStations =
    Array.isArray(srtData)
      ? srtData
      : (
          srtData.stations ??
          srtData.records ??
          []
        );

  if (
    !Array.isArray(srtStations) ||
    srtStations.length === 0
  ) {
    throw new Error(
      'No SRT stations found in normalized file'
    );
  }

  const transportpoints =
    (
      transportGeojson.features ??
      []
    )
      .map(transportpointRecord)
      .filter(Boolean);

  const railSegments =
    buildRailSegments(
      railData
    );

  console.log();
  console.log(
    'SRT stations:',
    srtStations.length
  );

  console.log(
    'Transportpoints:',
    transportpoints.length
  );

  console.log(
    'Rail features:',
    railData.features?.length ?? 0
  );

  console.log(
    'Rail segments:',
    railSegments.length
  );

  const tpByName =
    new Map();

  for (const tp of transportpoints) {
    const list =
      tpByName.get(
        tp.normalizedName
      ) ?? [];

    list.push(tp);

    tpByName.set(
      tp.normalizedName,
      list
    );
  }

  const results = [];

  const unmatched = [];

  const ambiguous = [];

  for (
    let index = 0;
    index < srtStations.length;
    index++
  ) {
    const station =
      srtStations[index];

    const name =
      getStationName(station);

    const normalizedName =
      normalizeThaiName(name);

    const matches =
      tpByName.get(
        normalizedName
      ) ?? [];

    if (matches.length === 0) {
      unmatched.push({
        stationId:
          getStationId(
            station,
            index
          ),

        name,

        province:
          getProvince(station),
      });

      continue;
    }

    if (matches.length > 1) {
      ambiguous.push({
        stationId:
          getStationId(
            station,
            index
          ),

        name,

        province:
          getProvince(station),

        candidates:
          matches,
      });

      continue;
    }

    const tp =
      matches[0];

    const srtCoordinate =
      getStationCoordinate(
        station
      );

    const tpCoordinate =
      tp.coordinate;

    const srtToTp =
      srtCoordinate
        ? haversineMeters(
            srtCoordinate,
            tpCoordinate
          )
        : null;

    const srtRail =
      srtCoordinate
        ? nearestRail(
            srtCoordinate,
            railSegments
          )
        : null;

    const tpRail =
      nearestRail(
        tpCoordinate,
        railSegments
      );

    results.push({
      stationId:
        getStationId(
          station,
          index
        ),

      name,

      province:
        getProvince(station),

      coordinateStatus:
        getCoordinateStatus(
          station
        ),

      srtCoordinate,

      transportpoint: {
        osmId:
          tp.osmId,

        fclass:
          tp.fclass,

        name:
          tp.name,

        coordinate:
          tpCoordinate,
      },

      distancesMeters: {
        srtToTransportpoint:
          srtToTp,

        srtToRail:
          srtRail?.distanceMeters ??
          null,

        transportpointToRail:
          tpRail?.distanceMeters ??
          null,
      },

      bands: {
        srtToTransportpoint:
          distanceBand(
            srtToTp
          ),

        srtToRail:
          distanceBand(
            srtRail?.distanceMeters
          ),

        transportpointToRail:
          distanceBand(
            tpRail?.distanceMeters
          ),
      },

      nearestRailFromSrt:
        srtRail,

      nearestRailFromTransportpoint:
        tpRail,
    });
  }

  const comparable =
    results.filter(
      r =>
        Number.isFinite(
          r.distancesMeters
            .srtToRail
        ) &&
        Number.isFinite(
          r.distancesMeters
            .transportpointToRail
        )
    );

  const transportMuchBetter =
    comparable.filter(
      r =>
        r.distancesMeters
          .srtToRail > 1000 &&
        r.distancesMeters
          .transportpointToRail <= 250
    );

  const bothClose =
    comparable.filter(
      r =>
        r.distancesMeters
          .srtToRail <= 250 &&
        r.distancesMeters
          .transportpointToRail <= 250
    );

  const bothFar =
    comparable.filter(
      r =>
        r.distancesMeters
          .srtToRail > 1000 &&
        r.distancesMeters
          .transportpointToRail > 1000
    );

  const summary = {
    srtStations:
      srtStations.length,

    transportpoints:
      transportpoints.length,

    exactNameMatches:
      results.length,

    ambiguous:
      ambiguous.length,

    unmatched:
      unmatched.length,

    matchesWithSrtCoordinate:
      results.filter(
        r => r.srtCoordinate
      ).length,

    comparable:
      comparable.length,

    transportMuchBetter:
      transportMuchBetter.length,

    bothClose:
      bothClose.length,

    bothFar:
      bothFar.length,

    srtToTransportpoint:
      summarizeDistances(
        results.map(
          r =>
            r.distancesMeters
              .srtToTransportpoint
        )
      ),

    srtToRail:
      summarizeDistances(
        comparable.map(
          r =>
            r.distancesMeters
              .srtToRail
        )
      ),

    transportpointToRail:
      summarizeDistances(
        comparable.map(
          r =>
            r.distancesMeters
              .transportpointToRail
        )
      ),
  };

  const output = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    productionModified:
      false,

    sources: {
      srt:
        'public/data/srt/staging/official/srt-stations.normalized.json',

      railway:
        'public/data/srt/staging/tracks.gistda-national.raw.geojson',

      transportpoint:
        TRANSPORTPOINT_URL,
    },

    notes: [
      'Transportpoint contains osm_id and is treated only as a validation/candidate source.',
      'Exact normalized Thai-name matching is used in this first audit.',
      'No production data is modified.',
    ],

    summary,

    transportMuchBetter:
      transportMuchBetter
        .sort(
          (a, b) =>
            b.distancesMeters.srtToRail -
            a.distancesMeters.srtToRail
        ),

    bothFar,

    ambiguous,

    unmatched,

    results,
  };

  await writeJson(
    OUTPUT_PATH,
    output
  );

  console.log();
  console.log(
    '===== MATCH SUMMARY ====='
  );

  console.log(summary);

  console.log();
  console.log(
    '===== TRANSPORTPOINT MUCH BETTER ====='
  );

  for (
    const r
    of transportMuchBetter
      .sort(
        (a, b) =>
          b.distancesMeters.srtToRail -
          a.distancesMeters.srtToRail
      )
      .slice(0, 30)
  ) {
    console.log({
      id:
        r.stationId,

      name:
        r.name,

      province:
        r.province,

      srtToTp:
        Math.round(
          r.distancesMeters
            .srtToTransportpoint
        ),

      srtToRail:
        Math.round(
          r.distancesMeters
            .srtToRail
        ),

      tpToRail:
        Math.round(
          r.distancesMeters
            .transportpointToRail
        ),

      srt:
        r.srtCoordinate,

      transportpoint:
        r.transportpoint.coordinate,
    });
  }

  console.log();
  console.log(
    '===== BOTH FAR ====='
  );

  for (const r of bothFar) {
    console.log({
      id:
        r.stationId,

      name:
        r.name,

      province:
        r.province,

      srtToRail:
        Math.round(
          r.distancesMeters
            .srtToRail
        ),

      tpToRail:
        Math.round(
          r.distancesMeters
            .transportpointToRail
        ),
    });
  }

  console.log();
  console.log(
    'output:',
    'public/data/srt/staging/official/srt-transportpoint-audit.json'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(error => {
  console.error(
    'Audit failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
