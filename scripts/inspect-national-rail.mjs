#!/usr/bin/env node

/**
 * scripts/inspect-national-rail.mjs
 *
 * GISTDA:
 * EEC / Transportation / MapServer / Layer 3
 *
 * 「เส้นทางรถไฟ（鉄道路線）」を取得し、
 * 全国SRT線路geometry候補として使えるcoverageか検証する。
 *
 * 重要:
 * - このArcGISレイヤーは Supports Pagination: false。
 * - resultOffset方式は使用しない。
 * - returnIdsOnly=true で全OIDを取得し、
 *   objectIds単位でgeometryを取得する。
 *
 * 本スクリプトは検査専用。
 * stations.ts / GoogleMap.tsx 等は変更しない。
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

/*
 * ---------------------------------------------------------
 * Configuration
 * ---------------------------------------------------------
 */

const ROOT =
    process.cwd();

const OUTPUT_DIR =
    join(
        ROOT,
        'public',
        'data',
        'srt',
        'staging'
    );

const GISTDA_LAYER =
    'https://gistdaportal.gistda.or.th/data/rest/services/EEC/Transportation/MapServer/3';

const GISTDA_QUERY =
    `${GISTDA_LAYER}/query`;

const OUTPUT_GEOJSON =
    join(
        OUTPUT_DIR,
        'tracks.gistda-national.raw.geojson'
    );

const OUTPUT_METADATA =
    join(
        OUTPUT_DIR,
        'national-rail-metadata.json'
    );

const FETCH_TIMEOUT_MS =
    30000;

/*
 * objectIdsを一度に送りすぎないための
 * 保守的なchunk size。
 *
 * MaxRecordCount=1000だが、
 * URL長も考慮して500件ずつ取得する。
 */
const ID_CHUNK_SIZE =
    500;

const THAILAND_BOUNDS = {
    minLat: 5.0,
    maxLat: 21.0,
    minLng: 97.0,
    maxLng: 106.0,
};

/*
 * 全国coverageの粗い一次判定。
 *
 * trueになっても
 * 「SRT全国線路として採用確定」
 * という意味ではない。
 */
const COVERAGE_CHECKS = {
    north: {
        label:
            'Northern Thailand',

        test: ({
            lat,
        }) =>
            lat >= 18.0,
    },

    northeast: {
        label:
            'Northeastern Thailand',

        test: ({
            lat,
            lng,
        }) =>
            lat >= 14.0 &&
            lng >= 102.0,
    },

    east: {
        label:
            'Eastern Thailand',

        test: ({
            lat,
            lng,
        }) =>
            lat >= 12.0 &&
            lat <= 14.5 &&
            lng >= 101.0,
    },

    central: {
        label:
            'Central Thailand',

        test: ({
            lat,
            lng,
        }) =>
            lat >= 13.0 &&
            lat <= 15.5 &&
            lng >= 99.0 &&
            lng <= 101.5,
    },

    south: {
        label:
            'Southern Thailand',

        test: ({
            lat,
        }) =>
            lat <= 10.5,
    },
};

/*
 * ---------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------
 */

function nowIso() {
    return new Date()
        .toISOString();
}

async function fetchWithTimeout(
    url,
    options = {}
) {
    const controller =
        new AbortController();

    const timer =
        setTimeout(
            () =>
                controller.abort(),
            FETCH_TIMEOUT_MS
        );

    try {
        const response =
            await fetch(
                url,
                {
                    ...options,

                    signal:
                        controller.signal,

                    headers: {
                        'user-agent':
                            'bkk-navi-national-rail-inspector/2.0',

                        ...(options.headers ??
                            {}),
                    },
                }
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status} ${response.statusText}`
            );
        }

        return response;
    } finally {
        clearTimeout(
            timer
        );
    }
}

async function fetchJson(
    url
) {
    const response =
        await fetchWithTimeout(
            url
        );

    const text =
        await response.text();

    let json;

    try {
        json =
            JSON.parse(
                text
            );
    } catch {
        throw new Error(
            `Response is not JSON: ${text.slice(0, 500)}`
        );
    }

    if (json?.error) {
        throw new Error(
            `ArcGIS error: ${JSON.stringify(json.error)}`
        );
    }

    return json;
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
        ).catch(
            () => {}
        );

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

function chunkArray(
    values,
    size
) {
    const chunks = [];

    for (
        let i = 0;
        i < values.length;
        i += size
    ) {
        chunks.push(
            values.slice(
                i,
                i + size
            )
        );
    }

    return chunks;
}

function getPoints(
    geometry
) {
    if (!geometry) {
        return [];
    }

    if (
        geometry.type ===
        'LineString'
    ) {
        return geometry.coordinates;
    }

    if (
        geometry.type ===
        'MultiLineString'
    ) {
        return geometry.coordinates.flat();
    }

    return [];
}

function normalizeValue(
    value
) {
    if (
        value === null ||
        value === undefined
    ) {
        return '(null)';
    }

    const text =
        String(value)
            .trim();

    return text === ''
        ? '(blank)'
        : text;
}

/*
 * ---------------------------------------------------------
 * Layer metadata
 * ---------------------------------------------------------
 */

async function fetchLayerMetadata() {
    console.log(
        '[GISTDA] fetching layer metadata'
    );

    const metadata =
        await fetchJson(
            `${GISTDA_LAYER}?f=json`
        );

    console.log(
        `[GISTDA] layer=${metadata.name ?? '(unknown)'}`
    );

    console.log(
        `[GISTDA] geometryType=${metadata.geometryType ?? '(unknown)'}`
    );

    console.log(
        `[GISTDA] maxRecordCount=${metadata.maxRecordCount ?? '(unknown)'}`
    );

    console.log(
        `[GISTDA] supportsPagination=${metadata.advancedQueryCapabilities?.supportsPagination ?? '(unknown)'}`
    );

    return metadata;
}

/*
 * ---------------------------------------------------------
 * Object IDs
 * ---------------------------------------------------------
 */

async function fetchAllObjectIds() {
    console.log(
        '[GISTDA] fetching all object IDs'
    );

    const params =
        new URLSearchParams({
            where:
                '1=1',

            returnIdsOnly:
                'true',

            f:
                'json',
        });

    const json =
        await fetchJson(
            `${GISTDA_QUERY}?${params.toString()}`
        );

    if (
        !Array.isArray(
            json.objectIds
        )
    ) {
        throw new Error(
            'ArcGIS did not return objectIds.'
        );
    }

    const objectIds =
        [...json.objectIds]
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(a) -
                    Number(b)
            );

    console.log(
        `[GISTDA] objectIds=${objectIds.length}`
    );

    return {
        objectIdFieldName:
            json.objectIdFieldName ??
            null,

        objectIds,
    };
}

/*
 * ---------------------------------------------------------
 * Geometry download
 * ---------------------------------------------------------
 */

async function fetchFeaturesByIds(
    objectIds
) {
    const chunks =
        chunkArray(
            objectIds,
            ID_CHUNK_SIZE
        );

    const features =
        [];

    for (
        let index = 0;
        index < chunks.length;
        index += 1
    ) {
        const ids =
            chunks[index];

        console.log(
            `[GISTDA] chunk ${index + 1}/${chunks.length}, IDs=${ids.length}`
        );

        const params =
            new URLSearchParams({
                objectIds:
                    ids.join(
                        ','
                    ),

                outFields:
                    '*',

                returnGeometry:
                    'true',

                outSR:
                    '4326',

                f:
                    'geojson',
            });

        const url =
            `${GISTDA_QUERY}?${params.toString()}`;

        const response =
            await fetchWithTimeout(
                url
            );

        const text =
            await response.text();

        let page;

        try {
            page =
                JSON.parse(
                    text
                );
        } catch {
            throw new Error(
                `Chunk ${index + 1} response is not JSON: ${text.slice(0, 500)}`
            );
        }

        if (page?.error) {
            throw new Error(
                `Chunk ${index + 1} ArcGIS error: ${JSON.stringify(page.error)}`
            );
        }

        if (
            page?.type !==
                'FeatureCollection' ||
            !Array.isArray(
                page.features
            )
        ) {
            throw new Error(
                `Chunk ${index + 1} is not a GeoJSON FeatureCollection: ${text.slice(0, 500)}`
            );
        }

        console.log(
            `[GISTDA] received=${page.features.length}`
        );

        features.push(
            ...page.features
        );
    }

    return {
        type:
            'FeatureCollection',

        features,
    };
}

/*
 * ---------------------------------------------------------
 * Geometry analysis
 * ---------------------------------------------------------
 */

function analyzeGeometry(
    geojson
) {
    let totalPoints = 0;

    let invalidGeometryCount =
        0;

    let invalidCoordinateCount =
        0;

    let outsideThailandBounds =
        0;

    let minLat =
        Infinity;

    let maxLat =
        -Infinity;

    let minLng =
        Infinity;

    let maxLng =
        -Infinity;

    const geometryTypes =
        new Map();

    const attributeNames =
        new Set();

    const latitudeBands = {
        'south < 10': 0,
        '10-12': 0,
        '12-14': 0,
        '14-16': 0,
        '16-18': 0,
        '18-20': 0,
        'north >= 20': 0,
    };

    const coverage = {};

    for (
        const [
            key,
            definition,
        ]
        of Object.entries(
            COVERAGE_CHECKS
        )
    ) {
        coverage[key] = {
            label:
                definition.label,

            matchedPoints:
                0,

            present:
                false,
        };
    }

    for (
        const feature
        of geojson.features
    ) {
        const geometry =
            feature.geometry;

        const geometryType =
            geometry?.type ??
            '(null)';

        geometryTypes.set(
            geometryType,

            (geometryTypes.get(
                geometryType
            ) ?? 0) + 1
        );

        if (
            geometryType !==
                'LineString' &&
            geometryType !==
                'MultiLineString'
        ) {
            invalidGeometryCount +=
                1;

            continue;
        }

        for (
            const key
            of Object.keys(
                feature.properties ??
                    {}
            )
        ) {
            attributeNames.add(
                key
            );
        }

        const points =
            getPoints(
                geometry
            );

        const bandsHit =
            new Set();

        for (
            const coordinate
            of points
        ) {
            if (
                !Array.isArray(
                    coordinate
                ) ||
                coordinate.length <
                    2
            ) {
                invalidCoordinateCount +=
                    1;

                continue;
            }

            const [
                lng,
                lat,
            ] =
                coordinate;

            if (
                !Number.isFinite(
                    lat
                ) ||
                !Number.isFinite(
                    lng
                )
            ) {
                invalidCoordinateCount +=
                    1;

                continue;
            }

            totalPoints +=
                1;

            minLat =
                Math.min(
                    minLat,
                    lat
                );

            maxLat =
                Math.max(
                    maxLat,
                    lat
                );

            minLng =
                Math.min(
                    minLng,
                    lng
                );

            maxLng =
                Math.max(
                    maxLng,
                    lng
                );

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
                outsideThailandBounds +=
                    1;
            }

            if (
                lat < 10
            ) {
                bandsHit.add(
                    'south < 10'
                );
            } else if (
                lat < 12
            ) {
                bandsHit.add(
                    '10-12'
                );
            } else if (
                lat < 14
            ) {
                bandsHit.add(
                    '12-14'
                );
            } else if (
                lat < 16
            ) {
                bandsHit.add(
                    '14-16'
                );
            } else if (
                lat < 18
            ) {
                bandsHit.add(
                    '16-18'
                );
            } else if (
                lat < 20
            ) {
                bandsHit.add(
                    '18-20'
                );
            } else {
                bandsHit.add(
                    'north >= 20'
                );
            }

            const point = {
                lat,
                lng,
            };

            for (
                const [
                    key,
                    definition,
                ]
                of Object.entries(
                    COVERAGE_CHECKS
                )
            ) {
                if (
                    definition.test(
                        point
                    )
                ) {
                    coverage[
                        key
                    ].matchedPoints +=
                        1;

                    coverage[
                        key
                    ].present =
                        true;
                }
            }
        }

        for (
            const band
            of bandsHit
        ) {
            latitudeBands[
                band
            ] += 1;
        }
    }

    return {
        featureCount:
            geojson.features
                .length,

        totalPoints,

        invalidGeometryCount,

        invalidCoordinateCount,

        outsideThailandBounds,

        boundingBox: {
            minLat,
            maxLat,
            minLng,
            maxLng,
        },

        latitudeBands,

        coverage,

        geometryTypes:
            Object.fromEntries(
                geometryTypes
            ),

        attributeNames:
            [...attributeNames]
                .sort(),
    };
}

/*
 * ---------------------------------------------------------
 * Attribute analysis
 * ---------------------------------------------------------
 */

function inspectAttributes(
    geojson
) {
    const sample =
        geojson.features
            .slice(
                0,
                10
            )
            .map(
                (
                    feature
                ) =>
                    feature.properties ??
                    {}
            );

    const valuesByField =
        {};

    for (
        const feature
        of geojson.features
    ) {
        const properties =
            feature.properties ??
            {};

        for (
            const [
                key,
                rawValue,
            ]
            of Object.entries(
                properties
            )
        ) {
            if (
                !valuesByField[
                    key
                ]
            ) {
                valuesByField[
                    key
                ] =
                    new Map();
            }

            const value =
                normalizeValue(
                    rawValue
                );

            const map =
                valuesByField[
                    key
                ];

            map.set(
                value,

                (map.get(
                    value
                ) ?? 0) + 1
            );
        }
    }

    const distributions =
        {};

    for (
        const [
            field,
            values,
        ]
        of Object.entries(
            valuesByField
        )
    ) {
        distributions[
            field
        ] =
            [...values.entries()]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b[1] -
                            a[1] ||
                        a[0].localeCompare(
                            b[0]
                        )
                )
                .slice(
                    0,
                    100
                );
    }

    return {
        sample,
        distributions,
    };
}

/*
 * ---------------------------------------------------------
 * Verdict
 * ---------------------------------------------------------
 */

function buildVerdict(
    analysis
) {
    const requiredRegions = [
        'north',
        'northeast',
        'east',
        'central',
        'south',
    ];

    const missingRegions =
        requiredRegions.filter(
            (
                region
            ) =>
                !analysis
                    .coverage[
                    region
                ]?.present
        );

    const geometryHealthy =
        analysis
            .invalidGeometryCount ===
            0 &&
        analysis
            .invalidCoordinateCount ===
            0;

    const nationalCoverageCandidate =
        missingRegions.length ===
        0;

    return {
        geometryHealthy,

        nationalCoverageCandidate,

        missingRegions,

        note:
            nationalCoverageCandidate
                ? 'Geographic coverage is broad enough for the next SRT/DRT cross-check. This is not final approval.'
                : 'One or more required regions are missing. Do not use this dataset as national SRT geometry.',
    };
}

/*
 * ---------------------------------------------------------
 * Main
 * ---------------------------------------------------------
 */

async function main() {
    console.log(
        '=== National railway geometry inspection v2 ==='
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

    const layerMetadata =
        await fetchLayerMetadata();

    const {
        objectIdFieldName,
        objectIds,
    } =
        await fetchAllObjectIds();

    const geojson =
        await fetchFeaturesByIds(
            objectIds
        );

    /*
     * OID件数と取得Feature件数が一致するか確認。
     */
    const idCountMatches =
        geojson.features
            .length ===
        objectIds.length;

    console.log();
    console.log(
        '===== DOWNLOAD CHECK ====='
    );

    console.log(
        'object IDs:',
        objectIds.length
    );

    console.log(
        'features:',
        geojson.features
            .length
    );

    console.log(
        'ID count matches:',
        idCountMatches
    );

    const analysis =
        analyzeGeometry(
            geojson
        );

    const attributes =
        inspectAttributes(
            geojson
        );

    const verdict =
        buildVerdict(
            analysis
        );

    console.log();
    console.log(
        '===== ANALYSIS ====='
    );

    console.log(
        'points:',
        analysis.totalPoints
    );

    console.log(
        'geometry types:',
        analysis.geometryTypes
    );

    console.log(
        'invalid geometry:',
        analysis.invalidGeometryCount
    );

    console.log(
        'invalid coordinates:',
        analysis.invalidCoordinateCount
    );

    console.log(
        'outside Thailand bounds:',
        analysis.outsideThailandBounds
    );

    console.log();

    console.log(
        'bounding box:',
        analysis.boundingBox
    );

    console.log();

    console.log(
        'latitude bands:',
        analysis.latitudeBands
    );

    console.log();

    console.log(
        'coverage:',
        analysis.coverage
    );

    console.log();

    console.log(
        'attributes:',
        analysis.attributeNames
    );

    console.log();

    console.log(
        'sample properties:',
        attributes.sample
    );

    console.log();
    console.log(
        '===== VERDICT ====='
    );

    console.log(
        'geometryHealthy:',
        verdict.geometryHealthy
    );

    console.log(
        'nationalCoverageCandidate:',
        verdict.nationalCoverageCandidate
    );

    console.log(
        'missingRegions:',
        verdict.missingRegions
    );

    console.log(
        verdict.note
    );

    await writeJson(
        OUTPUT_GEOJSON,
        geojson
    );

    await writeJson(
        OUTPUT_METADATA,
        {
            schemaVersion:
                2,

            generatedAt:
                nowIso(),

            source: {
                provider:
                    'GISTDA',

                layer:
                    GISTDA_LAYER,

                layerName:
                    layerMetadata.name ??
                    null,

                geometryType:
                    layerMetadata.geometryType ??
                    null,

                maxRecordCount:
                    layerMetadata.maxRecordCount ??
                    null,

                supportsPagination:
                    layerMetadata
                        .advancedQueryCapabilities
                        ?.supportsPagination ??
                    null,

                objectIdFieldName,

                objectIdCount:
                    objectIds.length,
            },

            downloadValidation: {
                objectIdCount:
                    objectIds.length,

                featureCount:
                    geojson.features
                        .length,

                idCountMatches,
            },

            analysis,

            attributes,

            verdict,
        }
    );

    console.log();
    console.log(
        '===== OUTPUT ====='
    );

    console.log(
        'GeoJSON: public/data/srt/staging/tracks.gistda-national.raw.geojson'
    );

    console.log(
        'Metadata: public/data/srt/staging/national-rail-metadata.json'
    );

    /*
     * データ欠落またはgeometry破損なら失敗扱い。
     * coverage不足は検査結果なのでexit 1にはしない。
     */
    if (
        !idCountMatches ||
        !verdict.geometryHealthy
    ) {
        process.exitCode =
            1;
    }
}

main().catch(
    (
        error
    ) => {
        console.error(
            'Inspection failed:'
        );

        console.error(
            error
        );

        process.exitCode =
            1;
    }
);