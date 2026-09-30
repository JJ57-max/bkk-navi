#!/usr/bin/env node

/**
 * scripts/fetch-official-srt-data.mjs
 *
 * MOT Data Catalog (CKAN) から
 * SRT/DRT公式データセットのmetadataを取得し、
 * 利用可能なresourceを自動検査する。
 *
 * 第1段階では本番データを変更しない。
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

const DATASETS = [
  {
    key: 'srtPassengerStations',
    datasetId: 'after16',
    expectedFormats: [
      'XLSX',
      'XLS',
      'CSV',
    ],
  },
  {
    key: 'drtRailNetwork',
    datasetId: 'drt2568_09',
    expectedFormats: [
      'CSV',
    ],
  },
];

const FETCH_TIMEOUT_MS =
  30000;

function nowIso() {
  return new Date().toISOString();
}

async function fetchJson(url) {
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
              'bkk-navi-official-srt-fetcher/1.0',
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
        `CKAN API failure: ${JSON.stringify(json)}`
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
  path,
  value
) {
  await atomicWrite(
    path,
    `${JSON.stringify(
      value,
      null,
      2
    )}\n`
  );
}

function normalizeFormat(
  value
) {
  return String(
    value ?? ''
  )
    .trim()
    .toUpperCase();
}

function summarizeResource(
  resource
) {
  return {
    id:
      resource.id ?? null,

    name:
      resource.name ?? null,

    description:
      resource.description ??
      null,

    format:
      resource.format ?? null,

    mimetype:
      resource.mimetype ??
      null,

    datastoreActive:
      resource.datastore_active ??
      false,

    created:
      resource.created ?? null,

    lastModified:
      resource.last_modified ??
      null,

    size:
      resource.size ?? null,

    url:
      resource.url ?? null,
  };
}

function selectResources(
  dataset,
  expectedFormats
) {
  const expected =
    new Set(
      expectedFormats.map(
        normalizeFormat
      )
    );

  return (
    dataset.resources ?? []
  )
    .filter(
      (resource) =>
        expected.has(
          normalizeFormat(
            resource.format
          )
        )
    )
    .map(
      summarizeResource
    );
}

async function inspectDataset(
  definition
) {
  const {
    key,
    datasetId,
    expectedFormats,
  } = definition;

  console.log();
  console.log(
    `===== ${key} =====`
  );

  const url =
    `${CKAN_BASE}/package_show?id=${encodeURIComponent(datasetId)}`;

  console.log(
    `[CKAN] dataset=${datasetId}`
  );

  const dataset =
    await fetchJson(url);

  const resources =
    (
      dataset.resources ??
      []
    ).map(
      summarizeResource
    );

  const candidates =
    selectResources(
      dataset,
      expectedFormats
    );

  console.log(
    'title:',
    dataset.title
  );

  console.log(
    'organization:',
    dataset.organization?.title ??
      '(unknown)'
  );

  console.log(
    'metadata modified:',
    dataset.metadata_modified ??
      '(unknown)'
  );

  console.log(
    'resources:',
    resources.length
  );

  for (
    const resource
    of resources
  ) {
    console.log(
      '-',
      {
        id:
          resource.id,

        name:
          resource.name,

        format:
          resource.format,

        datastoreActive:
          resource.datastoreActive,

        lastModified:
          resource.lastModified,
      }
    );
  }

  console.log(
    'matching candidates:',
    candidates.length
  );

  return {
    key,

    datasetId,

    dataset: {
      id:
        dataset.id ?? null,

      name:
        dataset.name ?? null,

      title:
        dataset.title ?? null,

      organization:
        dataset.organization?.title ??
        null,

      metadataCreated:
        dataset.metadata_created ??
        null,

      metadataModified:
        dataset.metadata_modified ??
        null,

      version:
        dataset.version ?? null,

      licenseTitle:
        dataset.license_title ??
        null,
    },

    resources,

    candidates,
  };
}

async function main() {
  console.log(
    '=== Official SRT/DRT resource discovery ==='
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

  const results = [];

  const errors = [];

  for (
    const definition
    of DATASETS
  ) {
    try {
      const result =
        await inspectDataset(
          definition
        );

      results.push(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      console.error(
        `[ERROR] ${definition.key}: ${message}`
      );

      errors.push({
        key:
          definition.key,

        datasetId:
          definition.datasetId,

        message,
      });
    }
  }

  const metadata = {
    schemaVersion: 1,

    generatedAt:
      nowIso(),

    source:
      'MOT Data Catalog / CKAN API',

    results,

    errors,

    status:
      errors.length === 0
        ? 'ok'
        : results.length > 0
          ? 'partial'
          : 'failed',
  };

  await writeJson(
    join(
      OUTPUT_DIR,
      'resource-discovery.json'
    ),
    metadata
  );

  console.log();
  console.log(
    '===== RESULT ====='
  );

  console.log(
    'status:',
    metadata.status
  );

  console.log(
    'output:',
    'public/data/srt/staging/official/resource-discovery.json'
  );

  if (
    results.length === 0
  ) {
    process.exitCode = 1;
  }
}

main().catch(
  (error) => {
    console.error(
      'Discovery failed:'
    );

    console.error(error);

    process.exitCode = 1;
  }
);