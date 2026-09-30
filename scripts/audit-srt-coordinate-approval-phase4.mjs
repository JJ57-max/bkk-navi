import fs from "node:fs";

const PHASE3 =
  "public/data/srt/staging/osm/srt-osm-identity-phase3.json";

const data =
  JSON.parse(
    fs.readFileSync(PHASE3, "utf8")
  );

const candidates =
  (data.results ?? []).filter(
    r =>
      r.phase3Status === "IDENTITY_REVIEW_CANDIDATE" ||
      r.phase3Status === "HIGH_CONFIDENCE_CANDIDATE"
  );

const BANG_KHEM_ID = 402;

const results =
  candidates.map(row => {
    const osmDistance =
      row.distances?.osmToGistdaMeters;

    const hasOsmCoordinate =
      Number.isFinite(row.osm?.coordinate?.lat) &&
      Number.isFinite(row.osm?.coordinate?.lng);

    const railAligned =
      Number.isFinite(osmDistance) &&
      osmDistance <= 50;

    /*
     * Phase 4 evidence established:
     *
     * - 66/66 have an OSM railway candidate.
     * - 66/66 OSM candidates are <= 50 m from GISTDA rail geometry.
     * - 65/66 match the SRT-recorded province.
     * - Station 402 Bang Khem is the single province-boundary exception
     *   and must remain explicitly documented rather than silently treated
     *   as an ordinary province match.
     *
     * This script is classification only.
     * It does NOT write coordinates to production.
     */

    let approvalClass;
    let reason;

    if (!hasOsmCoordinate) {
      approvalClass = "REJECT";
      reason = "NO_OSM_COORDINATE";
    } else if (!railAligned) {
      approvalClass = "REJECT";
      reason = "OSM_NOT_ALIGNED_WITH_GISTDA";
    } else if (row.stationId === BANG_KHEM_ID) {
      approvalClass = "APPROVE_WITH_DOCUMENTED_EXCEPTION";
      reason =
        "BANG_KHEM_PROVINCE_BOUNDARY_EXCEPTION";
    } else {
      approvalClass = "APPROVE_CANDIDATE";
      reason =
        "NAME_IDENTITY_AND_GISTDA_ALIGNMENT_PHASE4_VERIFIED";
    }

    return {
      stationId:
        row.stationId,

      name:
        row.name,

      currentCoordinate:
        row.srt?.coordinate ?? null,

      proposedCoordinate:
        row.osm?.coordinate ?? null,

      currentCoordinateStatus:
        row.srt?.coordinateStatus ?? null,

      phase3Status:
        row.phase3Status,

      osmSelectionReason:
        row.osm?.selectionReason ?? null,

      osmRailway:
        row.osm?.railway ?? null,

      osmOperator:
        row.osm?.operator ?? null,

      osmNetwork:
        row.osm?.network ?? null,

      osmToGistdaMeters:
        osmDistance ?? null,

      approvalClass,
      reason,

      productionApplied:
        false,
    };
  });

const counts = {};

for (const row of results) {
  counts[row.approvalClass] =
    (counts[row.approvalClass] ?? 0) + 1;
}

console.log(
  "===== PHASE 4D: COORDINATE APPROVAL DRY RUN ====="
);

console.log({
  candidates:
    results.length,
  classifications:
    counts,
  productionApplied:
    0,
});

console.log();
console.log(
  "===== DOCUMENTED EXCEPTIONS ====="
);

console.table(
  results.filter(
    r =>
      r.approvalClass ===
      "APPROVE_WITH_DOCUMENTED_EXCEPTION"
  )
);

console.log();
console.log(
  "===== REJECTED ====="
);

const rejected =
  results.filter(
    r =>
      r.approvalClass === "REJECT"
  );

if (rejected.length === 0) {
  console.log("NONE");
} else {
  console.table(rejected);
}

console.log();
console.log(
  "===== APPROVAL CANDIDATES ====="
);

console.table(
  results.map(r => ({
    id:
      r.stationId,
    name:
      r.name,
    class:
      r.approvalClass,
    reason:
      r.reason,
    gistdaM:
      r.osmToGistdaMeters,
  }))
);

console.log();
console.log(
  "===== SAFETY GATE ====="
);

const exceptionCount =
  results.filter(
    r =>
      r.approvalClass ===
      "APPROVE_WITH_DOCUMENTED_EXCEPTION"
  ).length;

const rejectCount =
  results.filter(
    r =>
      r.approvalClass === "REJECT"
  ).length;

if (
  results.length === 66 &&
  exceptionCount === 1 &&
  rejectCount === 0
) {
  console.log(
    "DRY RUN RESULT: READY FOR FINAL REVIEW"
  );
} else {
  console.log(
    "DRY RUN RESULT: STOP"
  );
}

console.log(
  "Production modified: false"
);
