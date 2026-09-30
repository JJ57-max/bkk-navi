import fs from "node:fs";
import path from "node:path";

const SRT_PATH =
  "public/data/srt/staging/official/srt-stations.normalized.json";

const CROSSCHECK_PATH =
  "public/data/srt/staging/osm/srt-osm-gistda-crosscheck.json";

const OUTPUT_PATH =
  "public/data/srt/staging/osm/srt-osm-identity-phase3.json";

function readJson(file) {
  return JSON.parse(
    fs.readFileSync(file, "utf8")
  );
}

function finite(value) {
  return Number.isFinite(value);
}

const srtJson = readJson(SRT_PATH);
const crosscheck = readJson(CROSSCHECK_PATH);

const srtRows =
  Array.isArray(srtJson)
    ? srtJson
    : srtJson.stations ??
      srtJson.records ??
      srtJson.results ??
      srtJson.data ??
      [];

const srtById =
  new Map(
    srtRows.map(row => [
      Number(
        row.id ??
        row.stationId ??
        row.station_id
      ),
      row,
    ])
  );

const suspects =
  (crosscheck.results ?? [])
    .filter(
      row =>
        row.evidenceClassification ===
        "SRT_COORDINATE_SUSPECT"
    );

function classifyIdentity(row) {
  const srtToOsm =
    row.distances?.srtToOsmMeters;

  const osmToRail =
    row.distances?.osmToGistdaRailMeters;

  const selected =
    row.osm?.selected;

  const selectionReason =
    row.osm?.selectionReason;

  if (
    !selected ||
    !finite(osmToRail)
  ) {
    return {
      phase3Status: "MANUAL_REVIEW",
      reason: "INSUFFICIENT_OSM_EVIDENCE",
    };
  }

  /*
   * Extreme separation remains manual even when the
   * OSM point lies on railway geometry. This protects
   * against same-name station collisions.
   */
  if (
    finite(srtToOsm) &&
    srtToOsm > 100000
  ) {
    return {
      phase3Status: "MANUAL_REVIEW",
      reason: "EXTREME_SRT_OSM_SEPARATION_OVER_100KM",
    };
  }

  if (
    finite(srtToOsm) &&
    srtToOsm > 50000
  ) {
    return {
      phase3Status: "MANUAL_REVIEW",
      reason: "LARGE_SRT_OSM_SEPARATION_OVER_50KM",
    };
  }

  /*
   * A selected OSM point must itself agree strongly
   * with the independent GISTDA railway geometry.
   */
  if (osmToRail > 50) {
    return {
      phase3Status: "MANUAL_REVIEW",
      reason: "OSM_NOT_TIGHTLY_ALIGNED_WITH_GISTDA",
    };
  }

  /*
   * Explicit SRT operator/network tagging is stronger
   * identity evidence than name matching alone.
   */
  if (
    selectionReason ===
    "UNIQUE_EXPLICIT_SRT_OPERATOR_OR_NETWORK"
  ) {
    return {
      phase3Status: "HIGH_CONFIDENCE_CANDIDATE",
      reason:
        "EXPLICIT_SRT_TAG_AND_GISTDA_ALIGNMENT",
    };
  }

  /*
   * Unique Thai-name match + <=50m from GISTDA is
   * strong corroboration, but still not production
   * approval. Administrative review follows.
   */
  if (
    selectionReason === "UNIQUE_NAME_MATCH" &&
    osmToRail <= 50
  ) {
    return {
      phase3Status: "IDENTITY_REVIEW_CANDIDATE",
      reason:
        "UNIQUE_NAME_AND_GISTDA_ALIGNMENT",
    };
  }

  return {
    phase3Status: "MANUAL_REVIEW",
    reason: "OTHER",
  };
}

const results =
  suspects.map(row => {
    const official =
      srtById.get(
        Number(row.stationId)
      ) ?? {};

    const identity =
      classifyIdentity(row);

    return {
      stationId: row.stationId,

      name: row.name,

      administrative: {
        province:
          official.province ??
          row.province ??
          null,

        district:
          official.district ??
          null,

        subdistrict:
          official.subdistrict ??
          null,

        postcode:
          official.postcode ??
          null,

        detail:
          official.detail ??
          null,
      },

      srt: {
        coordinate:
          row.srt?.coordinate ??
          null,

        coordinateStatus:
          official.coordinate?.status ??
          null,

        coordinateSource:
          official.coordinate?.source ??
          null,

        gistdaRailDistanceMeters:
          row.srt
            ?.gistdaRailDistanceMeters ??
          null,
      },

      osm: {
        selectionReason:
          row.osm?.selectionReason ??
          null,

        name:
          row.osm?.selected?.name ??
          null,

        nameEn:
          row.osm?.selected?.nameEn ??
          null,

        railway:
          row.osm?.selected?.railway ??
          null,

        operator:
          row.osm?.selected?.operator ??
          null,

        network:
          row.osm?.selected?.network ??
          null,

        coordinate:
          row.osm?.selected?.coordinate ??
          null,
      },

      distances: {
        srtToOsmMeters:
          row.distances?.srtToOsmMeters ??
          null,

        srtToGistdaMeters:
          row.srt
            ?.gistdaRailDistanceMeters ??
          null,

        osmToGistdaMeters:
          row.distances
            ?.osmToGistdaRailMeters ??
          null,
      },

      phase3Status:
        identity.phase3Status,

      phase3Reason:
        identity.reason,

      productionDecision:
        "NOT_APPROVED",
    };
  });

const statusCounts = {};
const reasonCounts = {};

for (const row of results) {
  statusCounts[row.phase3Status] =
    (statusCounts[row.phase3Status] ?? 0) + 1;

  reasonCounts[row.phase3Reason] =
    (reasonCounts[row.phase3Reason] ?? 0) + 1;
}

const output = {
  schemaVersion: 1,

  generatedAt:
    new Date().toISOString(),

  purpose:
    "Phase 3 identity review of SRT coordinate suspects",

  productionModified: false,

  policy: {
    osmRole:
      "CORROBORATING_EVIDENCE_ONLY",

    automaticProductionApproval:
      false,

    note:
      "Phase 3 classification is review prioritization, not permission to copy OSM coordinates into production.",
  },

  summary: {
    suspectsFromPhase2:
      suspects.length,

    phase3Rows:
      results.length,

    statusCounts,
    reasonCounts,

    productionApproved: 0,
  },

  results,
};

fs.mkdirSync(
  path.dirname(OUTPUT_PATH),
  { recursive: true }
);

fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(
    output,
    null,
    2
  ) + "\n"
);

console.log(
  "=============================================="
);
console.log(
  "SRT OSM IDENTITY AUDIT — PHASE 3"
);
console.log(
  "=============================================="
);

console.log(output.summary);

console.log();
console.log(
  "===== MANUAL REVIEW ====="
);

console.table(
  results
    .filter(
      r =>
        r.phase3Status ===
        "MANUAL_REVIEW"
    )
    .sort(
      (a, b) =>
        (b.distances.srtToOsmMeters ?? 0) -
        (a.distances.srtToOsmMeters ?? 0)
    )
    .map(r => ({
      id: r.stationId,
      name: r.name,
      province:
        r.administrative.province,

      district:
        r.administrative.district,

      srtToOsmM:
        r.distances.srtToOsmMeters,

      srtToGistdaM:
        r.distances.srtToGistdaMeters,

      osmToGistdaM:
        r.distances.osmToGistdaMeters,

      reason:
        r.phase3Reason,
    }))
);

console.log();
console.log(
  "===== HIGH CONFIDENCE CANDIDATES ====="
);

console.table(
  results
    .filter(
      r =>
        r.phase3Status ===
        "HIGH_CONFIDENCE_CANDIDATE"
    )
    .map(r => ({
      id: r.stationId,
      name: r.name,
      province:
        r.administrative.province,

      operator:
        r.osm.operator,

      network:
        r.osm.network,

      srtToOsmM:
        r.distances.srtToOsmMeters,

      osmToGistdaM:
        r.distances.osmToGistdaMeters,
    }))
);

console.log();
console.log(
  "===== IDENTITY REVIEW CANDIDATES ====="
);

console.table(
  results
    .filter(
      r =>
        r.phase3Status ===
        "IDENTITY_REVIEW_CANDIDATE"
    )
    .sort(
      (a, b) =>
        (b.distances.srtToOsmMeters ?? 0) -
        (a.distances.srtToOsmMeters ?? 0)
    )
    .map(r => ({
      id: r.stationId,
      name: r.name,
      province:
        r.administrative.province,

      district:
        r.administrative.district,

      subdistrict:
        r.administrative.subdistrict,

      osmName:
        r.osm.name,

      osmNameEn:
        r.osm.nameEn,

      srtToOsmM:
        r.distances.srtToOsmMeters,

      osmToGistdaM:
        r.distances.osmToGistdaMeters,
    }))
);

console.log();
console.log(
  "output:",
  OUTPUT_PATH
);

console.log(
  "Production modified: false"
);

console.log(
  "Production approved: 0"
);
