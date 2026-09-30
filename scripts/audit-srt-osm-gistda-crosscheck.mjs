import fs from "node:fs";
import path from "node:path";

const SRT_PATH =
  "public/data/srt/staging/official/srt-stations.normalized.json";

const OSM_PATH =
  "public/data/srt/staging/osm/thailand-railway-stations.geojson";

const ALIGNMENT_PATH =
  "public/data/srt/staging/official/srt-rail-alignment-audit.json";

const OUTPUT_PATH =
  "public/data/srt/staging/osm/srt-osm-gistda-crosscheck.json";

const GISTDA_PATH =
  "public/data/srt/staging/tracks.gistda-national.raw.geojson";

const EARTH_RADIUS_M = 6371008.8;

const SRT_OPERATOR_THAI = "การรถไฟแห่งประเทศไทย";

// ------------------------------------------------------------
// Generic helpers
// ------------------------------------------------------------

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function firstArray(obj, keys) {
  if (Array.isArray(obj)) return obj;

  for (const key of keys) {
    if (Array.isArray(obj?.[key])) {
      return obj[key];
    }
  }

  return [];
}

function finiteNumber(value) {
  // Missing coordinate values must stay missing.
  // Number(null) and Number("") both become 0 in JavaScript,
  // which would incorrectly turn unresolved SRT coordinates
  // into the geographic point (0, 0).
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return null;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeThai(value) {
  return String(value ?? "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^สถานีรถไฟ/, "")
    .replace(/^สถานี/, "");
}

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371008.8;
  const rad = (d) => (d * Math.PI) / 180;

  const p1 = rad(lat1);
  const p2 = rad(lat2);
  const dp = rad(lat2 - lat1);
  const dl = rad(lng2 - lng1);

  const a =
    Math.sin(dp / 2) ** 2 +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(dl / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

// ------------------------------------------------------------
// GISTDA geometry-distance engine
//
// Keep this algorithm aligned with:
// scripts/audit-srt-rail-alignment.mjs
// ------------------------------------------------------------

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

  return { x, y };
}

function pointToSegmentDistanceMeters(
  stationLat,
  stationLng,
  a,
  b
) {
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

  const abX = pb.x - pa.x;
  const abY = pb.y - pa.y;

  const lengthSquared =
    abX * abX + abY * abY;

  if (lengthSquared === 0) {
    return {
      distance:
        Math.hypot(pa.x, pa.y),
      t: 0,
    };
  }

  let t =
    (
      (-pa.x) * abX +
      (-pa.y) * abY
    ) /
    lengthSquared;

  t =
    Math.max(
      0,
      Math.min(1, t)
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

function extractLineStrings(feature) {
  const geometry =
    feature?.geometry;

  if (!geometry) return [];

  if (
    geometry.type === "LineString" &&
    Array.isArray(
      geometry.coordinates
    )
  ) {
    return [geometry.coordinates];
  }

  if (
    geometry.type === "MultiLineString" &&
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

function buildSegments(geojson) {
  const segments = [];

  for (
    let featureIndex = 0;
    featureIndex <
      (geojson.features ?? []).length;
    featureIndex += 1
  ) {
    const feature =
      geojson.features[featureIndex];

    const lines =
      extractLineStrings(feature);

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
            Math.min(a[1], b[1]),

          maxLat:
            Math.max(a[1], b[1]),

          minLng:
            Math.min(a[0], b[0]),

          maxLng:
            Math.max(a[0], b[0]),

          featureIndex,
          lineIndex,
          segmentIndex: i,

          properties:
            feature.properties ?? {},
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
        segment.maxLat >= lat - margin &&
        segment.minLat <= lat + margin &&
        segment.maxLng >= lng - margin &&
        segment.minLng <= lng + margin
    );

  return candidates.length > 0
    ? candidates
    : segments;
}

function findNearestSegment(
  coordinate,
  segments
) {
  const lat = coordinate.lat;
  const lng = coordinate.lng;

  const candidates =
    candidateSegments(
      segments,
      lat,
      lng
    );

  let best = null;

  for (const segment of candidates) {
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

// ------------------------------------------------------------
// SRT extraction
// ------------------------------------------------------------

function getSrtId(row) {
  return finiteNumber(
    row?.stationId ??
      row?.id ??
      row?.StationID ??
      row?.station_id
  );
}

function getSrtName(row) {
  return String(
    row?.name ??
      row?.stationName ??
      row?.station_name ??
      row?.nameTh ??
      ""
  ).trim();
}

function getProvince(row) {
  return String(
    row?.province ??
      row?.provinceName ??
      row?.province_name ??
      ""
  ).trim();
}

function getCoordinate(row) {
  const lat =
    finiteNumber(row?.lat) ??
    finiteNumber(row?.latitude) ??
    finiteNumber(row?.coordinate?.latitude) ??
    finiteNumber(row?.coordinate?.lat);

  const lng =
    finiteNumber(row?.lng) ??
    finiteNumber(row?.lon) ??
    finiteNumber(row?.longitude) ??
    finiteNumber(row?.coordinate?.longitude) ??
    finiteNumber(row?.coordinate?.lng);

  if (lat === null || lng === null) {
    return null;
  }

  return { lat, lng };
}

// ------------------------------------------------------------
// Alignment-audit extraction
// ------------------------------------------------------------

function getAlignmentDistance(row) {
  const candidates = [
    row?.distanceMeters,
    row?.railDistanceMeters,
    row?.distanceToRailMeters,
    row?.gistdaRailDistanceMeters,
    row?.nearestRailDistanceMeters,
  ];

  for (const value of candidates) {
    const n = finiteNumber(value);
    if (n !== null) return n;
  }

  return null;
}

// ------------------------------------------------------------
// OSM extraction
// ------------------------------------------------------------

function osmNames(properties) {
  return [
    properties?.["name:th"],
    properties?.name,
    properties?.["official_name:th"],
    properties?.official_name,
    properties?.["alt_name:th"],
    properties?.alt_name,
    properties?.["short_name:th"],
    properties?.short_name,
  ].filter(
    (value) =>
      typeof value === "string" &&
      value.trim()
  );
}

function isSrtTagged(candidate) {
  const values = [
    candidate.operator,
    candidate.network,
  ]
    .filter(Boolean)
    .map((v) => String(v));

  return values.some(
    (v) =>
      v.includes(SRT_OPERATOR_THAI) ||
      /State Railway of Thailand/i.test(v)
  );
}

// ------------------------------------------------------------
// Classification
// ------------------------------------------------------------

function classify({
  osmMatches,
  selectedOsm,
  srtRailDistance,
  osmRailDistance,
}) {
  if (osmMatches.length === 0) {
    return "NO_OSM_NAME_MATCH";
  }

  if (osmMatches.length > 1 && !selectedOsm) {
    return "AMBIGUOUS_OSM_MATCH";
  }

  if (
    srtRailDistance !== null &&
    osmRailDistance !== null &&
    srtRailDistance > 1000 &&
    osmRailDistance <= 100
  ) {
    return "SRT_COORDINATE_SUSPECT";
  }

  if (
    osmRailDistance !== null &&
    osmRailDistance <= 100
  ) {
    return "STRONG_CORROBORATION";
  }

  return "REQUIRES_REVIEW";
}

// ------------------------------------------------------------
// Load
// ------------------------------------------------------------

for (const file of [
  SRT_PATH,
  OSM_PATH,
  ALIGNMENT_PATH,
]) {
  if (!fs.existsSync(file)) {
    throw new Error(`Required file not found: ${file}`);
  }
}

const srtJson = readJson(SRT_PATH);
const osmJson = readJson(OSM_PATH);
const alignmentJson = readJson(ALIGNMENT_PATH);
const gistdaJson = readJson(GISTDA_PATH);

const gistdaSegments =
  buildSegments(gistdaJson);

if (!gistdaSegments.length) {
  throw new Error(
    "No GISTDA railway segments found"
  );
}

const srtRows = firstArray(
  srtJson,
  ["stations", "records", "results", "data"]
);

const alignmentRows = firstArray(
  alignmentJson,
  ["results", "records", "stations", "audits", "data"]
);

if (!srtRows.length) {
  throw new Error("SRT station array not found");
}

if (!alignmentRows.length) {
  throw new Error("Alignment audit array not found");
}

// ------------------------------------------------------------
// Index GISTDA alignment audit
// ------------------------------------------------------------

const alignmentById = new Map();

for (const row of alignmentRows) {
  const id = getSrtId(row);

  if (id !== null) {
    alignmentById.set(id, row);
  }
}

// ------------------------------------------------------------
// Normalize OSM candidates
// ------------------------------------------------------------

const osmCandidates = (osmJson.features ?? [])
  .filter((feature) => {
    const railway = feature?.properties?.railway;

    return (
      (railway === "station" ||
        railway === "halt") &&
      feature?.geometry?.type === "Point" &&
      Array.isArray(feature.geometry.coordinates)
    );
  })
  .map((feature, index) => {
    const p = feature.properties ?? {};
    const names = osmNames(p);

    return {
      index,
      railway: p.railway ?? null,
      name: p.name ?? null,
      nameTh: p["name:th"] ?? null,
      nameEn: p["name:en"] ?? null,
      operator: p.operator ?? null,
      network: p.network ?? null,
      normalizedNames: [
        ...new Set(names.map(normalizeThai)),
      ],
      coordinate: {
        lat: Number(feature.geometry.coordinates[1]),
        lng: Number(feature.geometry.coordinates[0]),
      },
    };
  });

// ------------------------------------------------------------
// Cross-check
// ------------------------------------------------------------

const results = [];

for (const row of srtRows) {
  const stationId = getSrtId(row);
  const name = getSrtName(row);
  const province = getProvince(row);
  const srtCoordinate = getCoordinate(row);

  const key = normalizeThai(name);

  const osmMatches = osmCandidates.filter((candidate) =>
    candidate.normalizedNames.includes(key)
  );

  // Conservative disambiguation:
  // unique name match -> use it for audit
  // multiple matches -> select only when exactly one is explicitly SRT-tagged
  let selectedOsm = null;
  let osmSelectionReason = null;

  if (osmMatches.length === 1) {
    selectedOsm = osmMatches[0];
    osmSelectionReason = "UNIQUE_NAME_MATCH";
  } else if (osmMatches.length > 1) {
    const srtTagged = osmMatches.filter(isSrtTagged);

    if (srtTagged.length === 1) {
      selectedOsm = srtTagged[0];
      osmSelectionReason =
        "UNIQUE_EXPLICIT_SRT_OPERATOR_OR_NETWORK";
    }
  }

  const alignment =
    alignmentById.get(stationId) ?? null;

  const srtRailDistance =
    alignment
      ? getAlignmentDistance(alignment)
      : null;

  const osmNearest =
    selectedOsm
      ? findNearestSegment(
          selectedOsm.coordinate,
          gistdaSegments
        )
      : null;

  const osmRailDistance =
    osmNearest
      ? osmNearest.distanceMeters
      : null;

  const srtToOsmDistance =
    srtCoordinate && selectedOsm
      ? haversineMeters(
          srtCoordinate.lat,
          srtCoordinate.lng,
          selectedOsm.coordinate.lat,
          selectedOsm.coordinate.lng
        )
      : null;

  const evidenceClassification = classify({
    osmMatches,
    selectedOsm,
    srtRailDistance,
    osmRailDistance,
  });

  results.push({
    stationId,
    name,
    province,

    srt: {
      coordinate: srtCoordinate,
      gistdaRailDistanceMeters:
        srtRailDistance,
    },

    osm: {
      matchCount: osmMatches.length,
      selectionReason: osmSelectionReason,

      selected: selectedOsm
        ? {
            railway: selectedOsm.railway,
            name:
              selectedOsm.nameTh ??
              selectedOsm.name,
            nameEn: selectedOsm.nameEn,
            operator: selectedOsm.operator,
            network: selectedOsm.network,
            coordinate:
              selectedOsm.coordinate,
          }
        : null,

      candidates: osmMatches.map((candidate) => ({
        railway: candidate.railway,
        name:
          candidate.nameTh ??
          candidate.name,
        nameEn: candidate.nameEn,
        operator: candidate.operator,
        network: candidate.network,
        coordinate:
          candidate.coordinate,
        explicitlySrtTagged:
          isSrtTagged(candidate),
      })),
    },

    distances: {
      srtToOsmMeters:
        srtToOsmDistance === null
          ? null
          : Number(
              srtToOsmDistance.toFixed(1)
            ),

      osmToGistdaRailMeters:
        osmRailDistance === null
          ? null
          : Number(
              osmRailDistance.toFixed(1)
            ),
    },

    evidenceClassification,

    productionDecision: "NOT_APPROVED",

    notes: [
      "OSM is corroborating audit evidence only.",
      "OSM coordinates must not be copied directly into production.",
      "OSM-to-GISTDA distance uses the same segment-distance algorithm as the existing SRT alignment audit.",
    ],
  });
}

// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------

const classificationCounts = {};

for (const result of results) {
  classificationCounts[
    result.evidenceClassification
  ] =
    (classificationCounts[
      result.evidenceClassification
    ] ?? 0) + 1;
}

const summary = {
  generatedAt: new Date().toISOString(),

  srtStations: results.length,

  osmRailPoints:
    osmCandidates.length,

  uniqueNameMatches:
    results.filter(
      (r) =>
        r.osm.matchCount === 1
    ).length,

  ambiguousNameMatches:
    results.filter(
      (r) =>
        r.osm.matchCount > 1
    ).length,

  noNameMatches:
    results.filter(
      (r) =>
        r.osm.matchCount === 0
    ).length,

  selectedOsmCandidates:
    results.filter(
      (r) => r.osm.selected
    ).length,

  classifications:
    classificationCounts,

  productionApproved: 0,
};

const output = {
  metadata: {
    purpose:
      "READ_ONLY_SRT_OSM_GISTDA_CROSSCHECK",

    osmRole:
      "CORROBORATING_EVIDENCE_ONLY",

    productionMutation: false,

    warning:
      "OSM coordinates are not production coordinate sources.",
  },

  summary,
  results,
};

fs.mkdirSync(
  path.dirname(OUTPUT_PATH),
  { recursive: true }
);

fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(output, null, 2) + "\n"
);

console.log(
  "=============================================="
);
console.log(
  "SRT x OSM x GISTDA CROSSCHECK — PHASE 2"
);
console.log(
  "=============================================="
);

console.log(summary);

console.log();
console.log(
  "===== OSM SELECTION REASONS ====="
);

const selectionReasons = {};

for (const result of results) {
  const reason =
    result.osm.selectionReason ??
    "NONE";

  selectionReasons[reason] =
    (selectionReasons[reason] ?? 0) + 1;
}

console.table(
  Object.entries(selectionReasons).map(
    ([reason, count]) => ({
      reason,
      count,
    })
  )
);

console.log();
console.log(
  "===== LARGEST SRT -> OSM DISTANCES ====="
);

console.table(
  results
    .filter(
      (r) =>
        r.distances.srtToOsmMeters !== null
    )
    .sort(
      (a, b) =>
        b.distances.srtToOsmMeters -
        a.distances.srtToOsmMeters
    )
    .slice(0, 30)
    .map((r) => ({
      id: r.stationId,
      name: r.name,
      province: r.province,
      distanceM:
        r.distances.srtToOsmMeters,
      selection:
        r.osm.selectionReason,
    }))
);

console.log();
console.log(
  "output:",
  OUTPUT_PATH
);

console.log(
  "production modified: false"
);

console.log(
  "OSM coordinates copied to production: false"
);
