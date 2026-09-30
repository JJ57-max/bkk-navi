#!/usr/bin/env node

/**
 * build-srt-staging.mjs
 *
 * SRT / DRT official CKAN DataStore -> validated staging data.
 *
 * IMPORTANT:
 * - Production data is NOT modified.
 * - Original values are preserved.
 * - Only mechanically safe coordinate cleanup is allowed.
 * - Missing / implausible coordinates are NEVER guessed.
 */

import {
  mkdir,
  writeFile,
  rename,
  rm,
} from 'node:fs/promises';

import {
  dirname,
  join,
} from 'node:path';

import process from 'node:process';

const ROOT = process.cwd();

const OUTPUT_DIR = join(
  ROOT,
  'public',
  'data',
  'srt',
  'staging',
  'official'
);

const CKAN_BASE =
  'https://datagov.mot.go.th/en/api/3/action';

const SRT_RESOURCE_ID =
  'cfb766a9-7051-41af-b966-f2465843f641';

const DRT_RESOURCE_ID =
  '53d7a233-4fe5-4f2c-a05f-78fdcfac2566';

const FETCH_TIMEOUT_MS = 30000;

const SRT_FIELDS = {
  name: 'ชื่อสถานีรถไฟ',
  province: 'จังหวัด',
  postcode: 'รหัสไปรษณีย์',
  lat: 'ค่าพิกัด_Lat',
  lng: 'ค่าพิกัด_Long',
  subdistrict: 'ตำบล',
  district: 'อำเภอ',
  detail: 'รายละเอียดเพิ่มเติม',
};

const DRT_FIELDS = {
  line: 'สายทาง',
  route: 'เส้นทาง',
};

/*
 * Broad sanity bounds only.
 * These are NOT intended to define Thailand's exact border.
 */
const THAILAND_SANITY_BOUNDS = {
  minLat: 5,
  maxLat: 21,
  minLng: 97,
  maxLng: 106,
};

function nowIso() {
  return new Date().toISOString();
}

function textOrNull(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const text =
    String(value).trim();

  return text === ''
    ? null
    : text;
}

async function fetchCkan(
  action,
  params
) {
  const query =
    new URLSearchParams(params);

  const url =
    `${CKAN_BASE}/${action}?${query.toString()}`;

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
        url,
        {
          signal:
            controller.signal,

          headers: {
            'user-agent':
              'bkk-navi-srt-staging-builder/1.0',
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`
      );
    }

    const json =
      await response.json();

    if (
      json?.success !== true
    ) {
      throw new Error(
        `CKAN failure: ${JSON.stringify(json)}`
      );
    }

    return json.result;
  } finally {
    clearTimeout(timer);
  }
}

async function atomicWrite(
  path,
  data
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

async function writeJson(
  filename,
  value
) {
  await atomicWrite(
    join(
      OUTPUT_DIR,
      filename
    ),

    `${JSON.stringify(
      value,
      null,
      2
    )}\n`
  );
}

/*
 * Fetch every DataStore record.
 *
 * We intentionally compare CKAN total with the actual
 * number of downloaded records before accepting the result.
 */
async function fetchAllRecords(
  resourceId
) {
  const first =
    await fetchCkan(
      'datastore_search',
      {
        resource_id:
          resourceId,

        limit:
          '1000',

        offset:
          '0',
      }
    );

  const total =
    Number(first.total);

  if (
    !Number.isInteger(total) ||
    total < 0
  ) {
    throw new Error(
      `Invalid CKAN total for ${resourceId}: ${first.total}`
    );
  }

  let records =
    [...(first.records ?? [])];

  let offset =
    records.length;

  while (
    records.length < total
  ) {
    const page =
      await fetchCkan(
        'datastore_search',
        {
          resource_id:
            resourceId,

          limit:
            '1000',

          offset:
            String(offset),
        }
      );

    const pageRecords =
      page.records ?? [];

    if (
      pageRecords.length === 0
    ) {
      throw new Error(
        `Unexpected empty CKAN page for ${resourceId} at offset ${offset}`
      );
    }

    records.push(
      ...pageRecords
    );

    offset =
      records.length;
  }

  if (
    records.length !== total
  ) {
    throw new Error(
      `Record count mismatch for ${resourceId}: total=${total}, downloaded=${records.length}`
    );
  }

  return {
    total,
    fields:
      first.fields ?? [],
    records,
  };
}

/*
 * Coordinate normalization
 *
 * SAFE operations only:
 * - trim whitespace
 * - remove surrounding ASCII/Thai-style comma punctuation
 *
 * We do NOT:
 * - swap lat/lng
 * - insert missing digits
 * - move decimal points
 * - infer a coordinate from station/province
 */
function normalizeCoordinate(
  raw
) {
  if (
    raw === null ||
    raw === undefined
  ) {
    return {
      raw,
      cleaned: null,
      value: null,
      changed: false,
      parseable: false,
      reason: 'missing',
    };
  }

  const original =
    String(raw);

  let cleaned =
    original.trim();

  /*
   * Remove comma punctuation only when it appears
   * at the beginning/end of the value.
   *
   * Internal commas are deliberately untouched.
   */
  cleaned =
    cleaned
      .replace(/^[,\uFF0C]+/, '')
      .replace(/[,\uFF0C]+$/, '')
      .trim();

  if (cleaned === '') {
    return {
      raw,
      cleaned: null,
      value: null,
      changed:
        cleaned !== original,
      parseable: false,
      reason: 'missing',
    };
  }

  /*
   * Strict decimal number.
   * Prevent Number("12abc")-style accidental acceptance.
   */
  if (
    !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(
      cleaned
    )
  ) {
    return {
      raw,
      cleaned,
      value: null,
      changed:
        cleaned !== original,
      parseable: false,
      reason: 'non-numeric',
    };
  }

  const value =
    Number(cleaned);

  if (
    !Number.isFinite(value)
  ) {
    return {
      raw,
      cleaned,
      value: null,
      changed:
        cleaned !== original,
      parseable: false,
      reason: 'non-finite',
    };
  }

  return {
    raw,
    cleaned,
    value,
    changed:
      cleaned !== original,
    parseable: true,
    reason: null,
  };
}

function coordinateInBounds(
  lat,
  lng
) {
  return (
    lat >=
      THAILAND_SANITY_BOUNDS.minLat &&
    lat <=
      THAILAND_SANITY_BOUNDS.maxLat &&
    lng >=
      THAILAND_SANITY_BOUNDS.minLng &&
    lng <=
      THAILAND_SANITY_BOUNDS.maxLng
  );
}

function normalizeStation(
  record
) {
  const lat =
    normalizeCoordinate(
      record[SRT_FIELDS.lat]
    );

  const lng =
    normalizeCoordinate(
      record[SRT_FIELDS.lng]
    );

  let coordinateStatus;
  let coordinateSource;
  let normalizedLat = null;
  let normalizedLng = null;

  if (
    !lat.parseable ||
    !lng.parseable
  ) {
    coordinateStatus =
      lat.reason === 'missing' ||
      lng.reason === 'missing'
        ? 'missing'
        : 'invalid-format';

    coordinateSource =
      'unresolved';
  } else if (
    !coordinateInBounds(
      lat.value,
      lng.value
    )
  ) {
    coordinateStatus =
      'invalid-bounds';

    coordinateSource =
      'unresolved';
  } else {
    normalizedLat =
      lat.value;

    normalizedLng =
      lng.value;

    if (
      lat.changed ||
      lng.changed
    ) {
      coordinateStatus =
        'official-normalized';

      coordinateSource =
        'srt-official-normalized';
    } else {
      coordinateStatus =
        'official-valid';

      coordinateSource =
        'srt-official';
    }
  }

  return {
    id:
      record._id,

    name:
      textOrNull(
        record[SRT_FIELDS.name]
      ),

    province:
      textOrNull(
        record[SRT_FIELDS.province]
      ),

    district:
      textOrNull(
        record[SRT_FIELDS.district]
      ),

    subdistrict:
      textOrNull(
        record[SRT_FIELDS.subdistrict]
      ),

    postcode:
      textOrNull(
        record[SRT_FIELDS.postcode]
      ),

    detail:
      textOrNull(
        record[SRT_FIELDS.detail]
      ),

    coordinate: {
      lat:
        normalizedLat,

      lng:
        normalizedLng,

      status:
        coordinateStatus,

      source:
        coordinateSource,

      raw: {
        lat:
          record[SRT_FIELDS.lat] ??
          null,

        lng:
          record[SRT_FIELDS.lng] ??
          null,
      },

      normalization: {
        latChanged:
          lat.changed,

        lngChanged:
          lng.changed,

        latCleaned:
          lat.cleaned,

        lngCleaned:
          lng.cleaned,

        latReason:
          lat.reason,

        lngReason:
          lng.reason,
      },
    },

    /*
     * Preserve complete source record for traceability.
     */
    sourceRecord:
      record,
  };
}

function normalizeDrtRoute(
  record
) {
  return {
    id:
      record._id,

    line:
      textOrNull(
        record[DRT_FIELDS.line]
      ),

    route:
      textOrNull(
        record[DRT_FIELDS.route]
      ),

    sourceRecord:
      record,
  };
}

function buildStationAudit(
  stations
) {
  const counts = {
    total:
      stations.length,

    officialValid:
      0,

    officialNormalized:
      0,

    missing:
      0,

    invalidFormat:
      0,

    invalidBounds:
      0,
  };

  const unresolved = [];

  const normalized = [];

  const names =
    new Map();

  for (
    const station
    of stations
  ) {
    switch (
      station.coordinate.status
    ) {
      case 'official-valid':
        counts.officialValid += 1;
        break;

      case 'official-normalized':
        counts.officialNormalized += 1;
        normalized.push(station.id);
        break;

      case 'missing':
        counts.missing += 1;
        unresolved.push(station.id);
        break;

      case 'invalid-format':
        counts.invalidFormat += 1;
        unresolved.push(station.id);
        break;

      case 'invalid-bounds':
        counts.invalidBounds += 1;
        unresolved.push(station.id);
        break;

      default:
        throw new Error(
          `Unknown coordinate status: ${station.coordinate.status}`
        );
    }

    if (station.name) {
      if (
        !names.has(
          station.name
        )
      ) {
        names.set(
          station.name,
          []
        );
      }

      names
        .get(station.name)
        .push(station.id);
    }
  }

  const duplicateNames =
    [...names.entries()]
      .filter(
        ([, ids]) =>
          ids.length > 1
      )
      .map(
        ([name, ids]) => ({
          name,
          ids,
        })
      );

  return {
    counts,

    normalizedStationIds:
      normalized,

    unresolvedStationIds:
      unresolved,

    duplicateNames,
  };
}

function assertSrtSchema(
  fields
) {
  const fieldNames =
    new Set(
      fields.map(
        (field) =>
          field.id
      )
    );

  const required = [
    '_id',
    ...Object.values(
      SRT_FIELDS
    ),
  ];

  const missing =
    required.filter(
      (field) =>
        !fieldNames.has(field)
    );

  if (
    missing.length > 0
  ) {
    throw new Error(
      `SRT schema changed. Missing fields: ${missing.join(', ')}`
    );
  }
}

function assertDrtSchema(
  fields
) {
  const fieldNames =
    new Set(
      fields.map(
        (field) =>
          field.id
      )
    );

  const required = [
    '_id',
    ...Object.values(
      DRT_FIELDS
    ),
  ];

  const missing =
    required.filter(
      (field) =>
        !fieldNames.has(field)
    );

  if (
    missing.length > 0
  ) {
    throw new Error(
      `DRT schema changed. Missing fields: ${missing.join(', ')}`
    );
  }
}

async function main() {
  console.log(
    '=== SRT official staging builder ==='
  );

  console.log(
    `started: ${nowIso()}`
  );

  await mkdir(
    OUTPUT_DIR,
    {
      recursive: true,
    }
  );

  console.log();
  console.log(
    '[SRT] downloading passenger stations'
  );

  const srt =
    await fetchAllRecords(
      SRT_RESOURCE_ID
    );

  assertSrtSchema(
    srt.fields
  );

  console.log(
    `[SRT] total=${srt.total}`
  );

  const stations =
    srt.records.map(
      normalizeStation
    );

  const stationAudit =
    buildStationAudit(
      stations
    );

  console.log();
  console.log(
    '===== SRT COORDINATE AUDIT ====='
  );

  console.log(
    stationAudit.counts
  );

  console.log(
    'duplicate names:',
    stationAudit
      .duplicateNames.length
  );

  console.log();
  console.log(
    '[DRT] downloading rail routes'
  );

  const drt =
    await fetchAllRecords(
      DRT_RESOURCE_ID
    );

  assertDrtSchema(
    drt.fields
  );

  console.log(
    `[DRT] total=${drt.total}`
  );

  const drtAll =
    drt.records.map(
      normalizeDrtRoute
    );

  /*
   * Empty rows in the current official dataset are retained
   * in raw output but excluded from normalized route master.
   */
  const drtRoutes =
    drtAll.filter(
      (row) =>
        row.line !== null &&
        row.route !== null
    );

  const drtIncomplete =
    drtAll.filter(
      (row) =>
        row.line === null ||
        row.route === null
    );

  console.log(
    '[DRT] valid routes:',
    drtRoutes.length
  );

  console.log(
    '[DRT] incomplete rows:',
    drtIncomplete.length
  );

  /*
   * Fail closed on obviously unexpected upstream changes.
   *
   * These are deliberately broad guards, not assertions
   * that today's counts can never change.
   */
  if (
    srt.total < 500
  ) {
    throw new Error(
      `SRT record count unexpectedly low: ${srt.total}`
    );
  }

  if (
    drtRoutes.length < 5
  ) {
    throw new Error(
      `DRT valid route count unexpectedly low: ${drtRoutes.length}`
    );
  }

  /*
   * Write only after all fetching, schema validation,
   * normalization and sanity checks succeeded.
   */

  await writeJson(
    'srt-stations.raw.json',
    {
      schemaVersion: 1,
      generatedAt: nowIso(),
      resourceId:
        SRT_RESOURCE_ID,
      total:
        srt.total,
      fields:
        srt.fields,
      records:
        srt.records,
    }
  );

  await writeJson(
    'srt-stations.normalized.json',
    {
      schemaVersion: 1,
      generatedAt: nowIso(),
      resourceId:
        SRT_RESOURCE_ID,
      total:
        stations.length,
      stations,
    }
  );

  await writeJson(
    'drt-routes.raw.json',
    {
      schemaVersion: 1,
      generatedAt: nowIso(),
      resourceId:
        DRT_RESOURCE_ID,
      total:
        drt.total,
      fields:
        drt.fields,
      records:
        drt.records,
    }
  );

  await writeJson(
    'drt-routes.normalized.json',
    {
      schemaVersion: 1,
      generatedAt: nowIso(),
      resourceId:
        DRT_RESOURCE_ID,
      total:
        drtRoutes.length,
      routes:
        drtRoutes,
    }
  );

  const metadata = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    source:
      'MOT Data Catalog / CKAN DataStore',

    srt: {
      resourceId:
        SRT_RESOURCE_ID,

      apiTotal:
        srt.total,

      downloaded:
        srt.records.length,

      audit:
        stationAudit,
    },

    drt: {
      resourceId:
        DRT_RESOURCE_ID,

      apiTotal:
        drt.total,

      downloaded:
        drt.records.length,

      validRoutes:
        drtRoutes.length,

      incompleteRows:
        drtIncomplete.map(
          (row) =>
            row.id
        ),
    },

    productionModified:
      false,

    status:
      'ok',
  };

  await writeJson(
    'staging-metadata.json',
    metadata
  );

  console.log();
  console.log(
    '===== RESULT ====='
  );

  console.log(
    'status: ok'
  );

  console.log(
    'production modified: false'
  );

  console.log(
    'output:',
    'public/data/srt/staging/official/'
  );
}

main().catch(
  (error) => {
    console.error();
    console.error(
      'Staging build failed:'
    );
    console.error(error);

    process.exitCode = 1;
  }
);