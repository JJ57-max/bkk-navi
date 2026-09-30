#!/usr/bin/env node

import {
  readFile,
} from 'node:fs/promises';

const LEDGER =
  'public/data/srt/staging/official/srt-coordinate-verification.json';

const GAP =
  'public/data/srt/staging/official/srt-coordinate-evidence-gap.json';

const REQUIRED_FAMILIES = 2;

async function readJson(path) {
  return JSON.parse(
    await readFile(path, 'utf8')
  );
}

function fail(
  violations,
  row,
  code,
  detail
) {
  violations.push({
    stationId:
      row.stationId ?? null,

    name:
      row.name ?? null,

    code,
    detail,
  });
}

async function main() {
  console.log(
    '=== SRT coordinate verification gate ==='
  );

  const ledger =
    await readJson(LEDGER);

  const gap =
    await readJson(GAP);

  const gapRows =
    gap.records ??
    gap.reviews ??
    gap.evidenceGaps ??
    [];

  if (!Array.isArray(gapRows)) {
    throw new Error(
      'Evidence-gap record array not found'
    );
  }

  const gapById =
    new Map(
      gapRows.map(row => [
        Number(row.stationId),
        row,
      ])
    );

  const violations = [];

  for (
    const row
    of ledger.verifications ?? []
  ) {
    const id =
      Number(row.stationId);

    const derived =
      gapById.get(id);

    if (!derived) {
      fail(
        violations,
        row,
        'MISSING_EVIDENCE_GAP_RECORD',
        'Verification record has no derived evidence-gap record.'
      );

      continue;
    }

    const count =
      Number(
        derived.independentEvidenceCount ??
        0
      );

    const missing =
      Number(
        derived.missing ??
        Math.max(
          0,
          REQUIRED_FAMILIES - count
        )
      );

    const families =
      derived.independentSourceFamilies ??
      [];

    /*
     * Defensive consistency checks on derived data.
     */
    if (
      count !== families.length
    ) {
      fail(
        violations,
        row,
        'EVIDENCE_COUNT_FAMILY_MISMATCH',
        `count=${count}, families=${families.length}`
      );
    }

    if (
      missing !==
      Math.max(
        0,
        REQUIRED_FAMILIES - count
      )
    ) {
      fail(
        violations,
        row,
        'INVALID_MISSING_COUNT',
        `count=${count}, missing=${missing}`
      );
    }

    const hasRequiredEvidence =
      count >= REQUIRED_FAMILIES &&
      missing === 0;

    /*
     * No candidate may be approved without
     * the required registry-derived evidence.
     */
    if (
      row.productionDecision ===
        'APPROVED_CANDIDATE' &&
      !hasRequiredEvidence
    ) {
      fail(
        violations,
        row,
        'APPROVED_WITH_INSUFFICIENT_EVIDENCE',
        `independent source families=${count}`
      );
    }

    /*
     * VERIFIED status must also satisfy the
     * same evidence requirement.
     */
    if (
      row.verificationStatus ===
        'VERIFIED_WITH_INDEPENDENT_EVIDENCE' &&
      !hasRequiredEvidence
    ) {
      fail(
        violations,
        row,
        'VERIFIED_WITH_INSUFFICIENT_EVIDENCE',
        `independent source families=${count}`
      );
    }

    /*
     * Conversely, APPROVED_CANDIDATE should
     * carry the verified status.
     */
    if (
      row.productionDecision ===
        'APPROVED_CANDIDATE' &&
      row.verificationStatus !==
        'VERIFIED_WITH_INDEPENDENT_EVIDENCE'
    ) {
      fail(
        violations,
        row,
        'APPROVED_WITHOUT_VERIFIED_STATUS',
        `verificationStatus=${row.verificationStatus}`
      );
    }

    /*
     * approvedCoordinate must remain null until
     * the separate controlled production-application
     * step is performed.
     */
    if (
      row.productionDecision !==
        'APPLIED_TO_PRODUCTION' &&
      row.approvedCoordinate != null
    ) {
      fail(
        violations,
        row,
        'APPROVED_COORDINATE_SET_PREMATURELY',
        'approvedCoordinate is non-null before production application.'
      );
    }
  }

  /*
   * Safety invariant for the current staging ledger.
   */
  if (
    ledger.productionModified !== false
  ) {
    violations.push({
      stationId: null,
      name: null,
      code:
        'PRODUCTION_MODIFIED_FLAG_NOT_FALSE',
      detail:
        `productionModified=${ledger.productionModified}`,
    });
  }

  console.log();
  console.log(
    '===== SUMMARY ====='
  );

  console.log({
    verificationRecords:
      ledger.verifications?.length ?? 0,

    evidenceGapRecords:
      gapRows.length,

    violations:
      violations.length,

    productionModified:
      ledger.productionModified,
  });

  if (violations.length > 0) {
    console.log();
    console.log(
      '===== VIOLATIONS ====='
    );

    for (const violation of violations) {
      console.dir(
        violation,
        { depth: null }
      );
    }

    console.log();
    console.log(
      'VERIFICATION GATE: FAIL'
    );

    process.exitCode = 2;

    return;
  }

  console.log();
  console.log(
    'VERIFICATION GATE: PASS'
  );

  console.log(
    'production modified:',
    false
  );
}

main().catch(error => {
  console.error(
    'Verification gate failed to execute:'
  );

  console.error(error);

  process.exitCode = 1;
});
