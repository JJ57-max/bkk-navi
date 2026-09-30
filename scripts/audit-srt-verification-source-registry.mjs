#!/usr/bin/env node

import {
  readFile,
} from 'node:fs/promises';

const REGISTRY =
  'public/data/srt/staging/official/srt-verification-source-registry.json';

const LEDGER =
  'public/data/srt/staging/official/srt-coordinate-verification.json';

async function readJson(path) {
  return JSON.parse(
    await readFile(path, 'utf8')
  );
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function findSource(
  registry,
  evidence
) {
  const name =
    normalize(evidence.sourceName);

  return registry.sources.find(source => {
    const display =
      normalize(source.displayName);

    if (display === name) {
      return true;
    }

    if (
      source.sourceId ===
        'wikimedia-gps-exif' &&
      name === 'wikimedia commons' &&
      evidence.evidenceType ===
        'GPS_EXIF_PHOTO'
    ) {
      return true;
    }

    return false;
  });
}

function auditEvidence(
  registry,
  evidence
) {
  const source =
    findSource(
      registry,
      evidence
    );

  const issues = [];

  if (!source) {
    issues.push(
      'SOURCE_NOT_REGISTERED'
    );

    return {
      sourceId: null,
      sourceFamily: null,
      validIndependentEvidence: false,
      issues,
    };
  }

  if (
    evidence.independence ===
      'INDEPENDENT' &&
    !source.mayCountAsIndependentVerification
  ) {
    issues.push(
      'SOURCE_NOT_ALLOWED_AS_INDEPENDENT'
    );
  }

  if (
    source.requiredEvidenceType &&
    evidence.evidenceType !==
      source.requiredEvidenceType
  ) {
    issues.push(
      'EVIDENCE_TYPE_MISMATCH'
    );
  }

  if (
    source.requiredCoordinateSemantics &&
    evidence.coordinateSemantics !==
      source.requiredCoordinateSemantics
  ) {
    issues.push(
      'COORDINATE_SEMANTICS_MISMATCH'
    );
  }

  const role =
    evidence.sourceRole ??
    evidence.role ??
    null;

  if (
    role &&
    !source.allowedRoles.includes(role)
  ) {
    issues.push(
      'ROLE_NOT_ALLOWED'
    );
  }

  return {
    sourceId:
      source.sourceId,

    sourceFamily:
      source.sourceFamily,

    validIndependentEvidence:
      evidence.independence ===
        'INDEPENDENT' &&
      source.mayCountAsIndependentVerification &&
      issues.length === 0,

    issues,
  };
}

async function main() {
  console.log(
    '=== SRT verification source-registry audit ==='
  );

  const registry =
    await readJson(REGISTRY);

  const ledger =
    await readJson(LEDGER);

  const results = [];

  for (
    const row
    of ledger.verifications ?? []
  ) {
    const evidence =
      row.independentVerificationEvidence ??
      [];

    const audited =
      evidence.map(item => ({
        sourceName:
          item.sourceName ?? null,

        ...auditEvidence(
          registry,
          item
        ),
      }));

    const valid =
      audited.filter(
        item =>
          item.validIndependentEvidence
      );

    const families =
      new Set(
        valid
          .map(item => item.sourceFamily)
          .filter(Boolean)
      );

    const issues = [];

    if (
      valid.length >= 2 &&
      families.size < 2
    ) {
      issues.push(
        'INSUFFICIENT_SOURCE_FAMILY_DIVERSITY'
      );
    }

    results.push({
      stationId:
        row.stationId,

      name:
        row.name,

      declaredIndependent:
        evidence.filter(
          item =>
            item.independence ===
            'INDEPENDENT'
        ).length,

      registryValidIndependent:
        valid.length,

      independentSourceFamilies:
        [...families],

      evidence:
        audited,

      issues,
    });
  }

  console.log();
  console.log(
    '===== AUDIT ====='
  );

  for (const row of results) {
    console.dir(
      row,
      { depth: null }
    );
  }

  const problems =
    results.filter(
      row =>
        row.issues.length > 0 ||
        row.evidence.some(
          item =>
            item.issues.length > 0
        )
    );

  console.log();
  console.log(
    '===== SUMMARY ====='
  );

  console.log({
    stations:
      results.length,

    stationsWithProblems:
      problems.length,

    productionModified:
      false,
  });

  if (problems.length > 0) {
    console.log();
    console.log(
      'Audit found registry/provenance issues.'
    );

    process.exitCode = 2;
  }
}

main().catch(error => {
  console.error(
    'Source-registry audit failed:'
  );

  console.error(error);

  process.exitCode = 1;
});
