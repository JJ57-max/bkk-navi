#!/usr/bin/env node

/**
 * scripts/update-srt-data.mjs
 *
 * SRT全国表示用データの「staging取得・検証」スクリプト。
 *
 * 安全方針:
 * - 既存の data/stations.ts や本番データは変更しない。
 * - 取得失敗時に既存ファイルを削除・上書きしない。
 * - GISTDA railway geometry は staging に保存し、SRT公式路線との照合前に
 *   「SRT公式線路」とはみなさない。
 * - SRT旅客駅XLSXは、Node標準機能だけでは解析しない。
 *   取得できた場合は raw ファイルとして保存し、metadata に記録する。
 */

import {
    mkdir,
    writeFile,
    rename,
    rm,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();

const OUTPUT_DIR = join(
    ROOT,
    'public',
    'data',
    'srt',
    'staging'
);

const GISTDA_LAYER =
    'https://gistdaportal.gistda.or.th/arcgis/rest/services/Hosted/Thai_Railway/FeatureServer/0';

const GISTDA_QUERY =
    `${GISTDA_LAYER}/query`;

/*
 * SRT / MOT の公式データセットページ。
 *
 * XLSX本体URLは、配布元変更や一時的なタイムアウトに
 * 対応できるよう環境変数で渡す。
 */
const SRT_DATASET_PAGE =
    'https://datagov.mot.go.th/en/dataset/after16';

const SRT_XLSX_URL =
    process.env.SRT_STATIONS_XLSX_URL ?? '';

const FETCH_TIMEOUT_MS = 30_000;

const PAGE_SIZE = 1_000;

/*
 * タイ国内を十分包含する保守的な範囲。
 *
 * これは国境線を表すものではなく、
 * 明らかな異常座標を検出するための安全チェック。
 */
const THAILAND_BOUNDS = {
    minLat: 5.0,
    maxLat: 21.0,
    minLng: 97.0,
    maxLng: 106.0,
};

/*
 * ---------------------------------------------------------
 * 共通
 * ---------------------------------------------------------
 */

function nowIso() {
    return new Date().toISOString();
}

async function fetchWithTimeout(
    url,
    options = {}
) {
    const controller =
        new AbortController();

    const timer = setTimeout(
        () => controller.abort(),
        FETCH_TIMEOUT_MS
    );

    try {
        const response = await fetch(
            url,
            {
                ...options,
                signal:
                    controller.signal,
                headers: {
                    'user-agent':
                        'bkk-navi-srt-data-validator/1.0',
                    ...(options.headers ??
                        {}),
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status} ${response.statusText}: ${url}`
            );
        }

        return response;
    } finally {
        clearTimeout(timer);
    }
}

/*
 * ファイルを直接上書きせず、
 *
 * temporary file
 *      ↓
 * rename
 *
 * の順にする。
 *
 * 途中で処理が失敗した場合に、
 * 正常な既存ファイルを壊すことを避ける。
 */
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

function isFiniteCoordinate(
    value
) {
    return (
        typeof value ===
            'number' &&
        Number.isFinite(value)
    );
}

/*
 * ---------------------------------------------------------
 * GeoJSON validation
 * ---------------------------------------------------------
 */

function validateGeoJsonFeature(
    feature
) {
    const problems = [];

    if (
        feature?.type !==
        'Feature'
    ) {
        problems.push(
            'not_feature'
        );

        return problems;
    }

    const geometry =
        feature.geometry;

    if (!geometry) {
        problems.push(
            'missing_geometry'
        );

        return problems;
    }

    if (
        geometry.type !==
            'LineString' &&
        geometry.type !==
            'MultiLineString'
    ) {
        problems.push(
            `unexpected_geometry:${geometry.type}`
        );

        return problems;
    }

    const lines =
        geometry.type ===
        'LineString'
            ? [
                  geometry.coordinates,
              ]
            : geometry.coordinates;

    let pointCount = 0;

    for (const line of lines) {
        if (
            !Array.isArray(line) ||
            line.length < 2
        ) {
            problems.push(
                'short_line'
            );

            continue;
        }

        for (
            const coordinate
            of line
        ) {
            if (
                !Array.isArray(
                    coordinate
                ) ||
                coordinate.length <
                    2
            ) {
                problems.push(
                    'invalid_coordinate'
                );

                continue;
            }

            const [
                lng,
                lat,
            ] = coordinate;

            if (
                !isFiniteCoordinate(
                    lat
                ) ||
                !isFiniteCoordinate(
                    lng
                )
            ) {
                problems.push(
                    'non_numeric_coordinate'
                );

                continue;
            }

            pointCount += 1;

            if (
                lat <
                    THAILAND_BOUNDS.minLat ||
                lat >
                    THAILAND_BOUNDS.maxLat ||
                lng <
                    THAILAND_BOUNDS.minLng ||
                lng >
                    THAILAND_BOUNDS.maxLng
            ) {
                problems.push(
                    'coordinate_outside_bounds'
                );
            }
        }
    }

    if (pointCount === 0) {
        problems.push(
            'no_points'
        );
    }

    return [
        ...new Set(problems),
    ];
}

/*
 * ---------------------------------------------------------
 * GISTDA railway geometry
 * ---------------------------------------------------------
 */

async function fetchGistdaRailway() {
    const features = [];

    let offset = 0;

    for (;;) {
        const params =
            new URLSearchParams(
                {
                    where: '1=1',

                    outFields:
                        'fid,objectid,osm_id,code,fclass,name,layer,bridge,tunnel,shape_leng',

                    returnGeometry:
                        'true',

                    outSR: '4326',

                    f: 'geojson',

                    resultOffset:
                        String(offset),

                    resultRecordCount:
                        String(
                            PAGE_SIZE
                        ),
                }
            );

        const url =
            `${GISTDA_QUERY}?${params.toString()}`;

        console.log(
            `[GISTDA] fetching offset=${offset}`
        );

        const response =
            await fetchWithTimeout(
                url
            );

        const page =
            await response.json();

        if (
            page?.type !==
                'FeatureCollection' ||
            !Array.isArray(
                page.features
            )
        ) {
            throw new Error(
                'GISTDA response is not a valid GeoJSON FeatureCollection.'
            );
        }

        features.push(
            ...page.features
        );

        /*
         * 取得件数がPAGE_SIZE未満なら
         * 最終ページ。
         */
        if (
            page.features.length <
            PAGE_SIZE
        ) {
            break;
        }

        offset +=
            page.features.length;

        /*
         * 異常レスポンスや
         * pagination loopへの安全弁。
         */
        if (
            offset > 100_000
        ) {
            throw new Error(
                'GISTDA pagination exceeded safety limit.'
            );
        }
    }

    const issueCounts = {};

    let featuresWithIssues =
        0;

    let totalPoints = 0;

    for (
        const feature
        of features
    ) {
        const issues =
            validateGeoJsonFeature(
                feature
            );

        if (
            issues.length > 0
        ) {
            featuresWithIssues +=
                1;

            for (
                const issue
                of issues
            ) {
                issueCounts[
                    issue
                ] =
                    (issueCounts[
                        issue
                    ] ?? 0) + 1;
            }
        }

        const geometry =
            feature.geometry;

        if (
            geometry?.type ===
            'LineString'
        ) {
            totalPoints +=
                geometry
                    .coordinates
                    .length;
        } else if (
            geometry?.type ===
            'MultiLineString'
        ) {
            totalPoints +=
                geometry.coordinates.reduce(
                    (
                        sum,
                        line
                    ) =>
                        sum +
                        line.length,
                    0
                );
        }
    }

    return {
        geojson: {
            type:
                'FeatureCollection',

            features,
        },

        validation: {
            featureCount:
                features.length,

            totalPoints,

            featuresWithIssues,

            issueCounts,
        },
    };
}

/*
 * ---------------------------------------------------------
 * SRT official passenger station XLSX
 * ---------------------------------------------------------
 *
 * この第1段階ではXLSX解析ライブラリを
 * package.jsonへ追加しない。
 *
 * SRT_STATIONS_XLSX_URL が指定されている場合のみ、
 * raw XLSXを取得してstagingへ保存する。
 *
 * 本番駅データへの変換は次段階で行う。
 */

async function tryDownloadSrtXlsx() {
    if (!SRT_XLSX_URL) {
        return {
            attempted: false,

            downloaded: false,

            reason:
                'SRT_STATIONS_XLSX_URL is not set. Raw XLSX download skipped safely.',
        };
    }

    console.log(
        '[SRT] downloading official station XLSX'
    );

    const response =
        await fetchWithTimeout(
            SRT_XLSX_URL
        );

    const contentType =
        response.headers.get(
            'content-type'
        ) ?? '';

    const bytes =
        Buffer.from(
            await response.arrayBuffer()
        );

    /*
     * XLSXはZIPコンテナなので
     * 通常 "PK" から始まる。
     *
     * HTMLエラーページ等を.xlsxとして
     * 保存してしまう事故を防ぐ。
     */
    const hasZipSignature =
        bytes.length >= 2 &&
        bytes[0] === 0x50 &&
        bytes[1] === 0x4b;

    if (!hasZipSignature) {
        throw new Error(
            `Downloaded SRT file does not look like XLSX/ZIP. content-type=${contentType}`
        );
    }

    const outputPath =
        join(
            OUTPUT_DIR,
            'srt-passenger-stations.raw.xlsx'
        );

    await atomicWrite(
        outputPath,
        bytes
    );

    return {
        attempted: true,

        downloaded: true,

        byteLength:
            bytes.length,

        contentType,

        output:
            'public/data/srt/staging/srt-passenger-stations.raw.xlsx',
    };
}

/*
 * ---------------------------------------------------------
 * main
 * ---------------------------------------------------------
 */

async function main() {
    console.log(
        '=== SRT staging data update ==='
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

    const metadata = {
        schemaVersion: 1,

        generatedAt: null,

        status: 'running',

        sources: {
            srtPassengerStations:
                {
                    datasetPage:
                        SRT_DATASET_PAGE,

                    resourceFormat:
                        'XLSX',

                    sourceOrganization:
                        'State Railway of Thailand (SRT)',

                    note:
                        'Official station master. Raw XLSX is not parsed by this dependency-free script.',
                },

            railwayGeometry:
                {
                    url:
                        GISTDA_LAYER,

                    provider:
                        'GISTDA',

                    role:
                        'Staging geometry candidate only; not treated as SRT-surveyed official track geometry.',
                },
        },

        srtXlsx: null,

        gistda: null,

        errors: [],
    };

    /*
     * SRT XLSX取得。
     *
     * 失敗してもGISTDAのstaging取得は
     * 続行する。
     */
    try {
        metadata.srtXlsx =
            await tryDownloadSrtXlsx();
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : String(
                      error
                  );

        metadata.srtXlsx = {
            attempted: true,

            downloaded:
                false,

            error:
                message,
        };

        metadata.errors.push(
            {
                source:
                    'srtPassengerStations',

                message,
            }
        );

        console.warn(
            `[SRT] ${message}`
        );
    }

    /*
     * GISTDA railway geometry取得。
     */
    try {
        const result =
            await fetchGistdaRailway();

        /*
         * validation異常があっても
         * raw stagingデータとしては保存する。
         *
         * 本番採用可否はmetadataを見て
         * 次工程で判断する。
         */
        await writeJson(
            join(
                OUTPUT_DIR,
                'tracks.gistda.raw.geojson'
            ),
            result.geojson
        );

        metadata.gistda = {
            downloaded: true,

            output:
                'public/data/srt/staging/tracks.gistda.raw.geojson',

            validation:
                result.validation,
        };

        console.log(
            `[GISTDA] features=${result.validation.featureCount}, points=${result.validation.totalPoints}, issues=${result.validation.featuresWithIssues}`
        );
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : String(
                      error
                  );

        metadata.gistda = {
            downloaded:
                false,

            error:
                message,
        };

        metadata.errors.push(
            {
                source:
                    'gistdaRailwayGeometry',

                message,
            }
        );

        console.error(
            `[GISTDA] ${message}`
        );
    }

    metadata.generatedAt =
        nowIso();

    const gistdaOk =
        metadata.gistda
            ?.downloaded ===
        true;

    if (gistdaOk) {
        metadata.status =
            metadata.errors
                .length === 0
                ? 'ok'
                : 'partial';
    } else {
        metadata.status =
            'failed';
    }

    await writeJson(
        join(
            OUTPUT_DIR,
            'metadata.json'
        ),
        metadata
    );

    console.log(
        'metadata: public/data/srt/staging/metadata.json'
    );

    console.log(
        `status: ${metadata.status}`
    );

    /*
     * GISTDA取得そのものが失敗した場合のみ
     * shellへ失敗終了を返す。
     *
     * SRT XLSXが未指定・取得不能なだけなら、
     * staging geometry検証は有効なので
     * processを失敗扱いにしない。
     */
    if (!gistdaOk) {
        process.exitCode = 1;
    }
}

main().catch(
    (error) => {
        console.error(
            error
        );

        process.exitCode = 1;
    }
);