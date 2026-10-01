// components/GoogleMap.tsx
'use client';

import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    APIProvider,
    Map as GoogleMap,
    AdvancedMarker,
    useMap,
    MapMouseEvent,
} from '@vis.gl/react-google-maps';
import {
    allBangkokStations,
    Station,
} from '@/data/stations';

interface GoogleMapProps {
    /**
     * 現在地 / ルートの出発地点
     *
     * page.tsx が管理する。
     *
     * DEMO時:
     *   { lat: 13.7367, lng: 100.5606 }
     *
     * GPS取得成功時:
     *   実際のユーザー位置
     */
    userLocation: {
        lat: number;
        lng: number;
    };

    /**
     * ルートの目的地
     */
    destinationCoordinate: {
        lat: number;
        lng: number;
    };

    /**
     * 目的地表示名
     */
    destinationTitle: string;

    /**
     * ルート移動手段
     */
    travelMode?: string;

    /**
     * 地図上の任意地点クリック
     */
    onSelectArbitraryPoint?: (
        title: string,
        lat: number,
        lng: number
    ) => void;

    onSelectStation?: (
        station: Station
    ) => void;

    /**
     * DetailSheet の開閉状態。
     * Desktop では OPEN 時のみ目的地を右側へ退避する。
     */
    isDetailSheetOpen?: boolean;
}

/**
 * ---------------------------------------------------------
 * 路線表示
 * ---------------------------------------------------------
 *
 * stations.ts の駅データを基準に路線を描画する。
 *
 * 重要:
 * - 駅コードの単純ソートではなく、路線ごとに明示的な順序を定義する。
 * - BTS Sukhumvit Line は N系 / CEN / E系を分離する。
 * - Pink Line は PK01〜PK30 の本線と、
 *   PK10 → MT01 → MT02 の Muang Thong Thani 支線を接続する。
 * - SRT / Boat は駅・船着場マーカーのみ表示し、
 *   座標間を単純な直線で結ばない。
 */
function TransitLinesComponent() {
    const map = useMap();

    const stationMap = useMemo(() => {
        const map = new Map<string, Station>();

        allBangkokStations.forEach(
            (station) => {
                if (station.stationCode) {
                    const key = `${station.line}:${station.stationCode}`;

                    map.set(
                        key,
                        station
                    );
                }
            }
        );

        return map;
    }, []);

    useEffect(() => {
        if (!map) {
            return;
        }

        const polylines: google.maps.Polyline[] =
            [];

        /**
         * -----------------------------------------------------
         * 路線定義
         * -----------------------------------------------------
         *
         * stationCode の配列そのものが描画順序。
         */
        const lineDefinitions: Array<{
            key: string;
            color: string;
            stationRefs: string[];
        }> = [
            {
                key: 'BTS-Sukhumvit-North',
                color: '#22c55e',
                stationRefs: [
                    'BTS:CEN',
                    'BTS:N1',
                    'BTS:N2',
                    'BTS:N3',
                    'BTS:N4',
                    'BTS:N5',
                    'BTS:N6',
                    'BTS:N7',
                    'BTS:N8',
                    'BTS:N9',
                    'BTS:N10',
                    'BTS:N11',
                    'BTS:N12',
                    'BTS:N13',
                    'BTS:N14',
                    'BTS:N15',
                    'BTS:N16',
                    'BTS:N17',
                    'BTS:N18',
                    'BTS:N19',
                    'BTS:N20',
                    'BTS:N21',
                    'BTS:N22',
                    'BTS:N23',
                    'BTS:N24',
                ],
            },
            {
                key: 'BTS-Sukhumvit-East',
                color: '#22c55e',
                stationRefs: [
                    'BTS:CEN',
                    'BTS:E1',
                    'BTS:E2',
                    'BTS:E3',
                    'BTS:E4',
                    'BTS:E5',
                    'BTS:E6',
                    'BTS:E7',
                    'BTS:E8',
                    'BTS:E9',
                    'BTS:E10',
                    'BTS:E11',
                    'BTS:E12',
                    'BTS:E13',
                    'BTS:E14',
                    'BTS:E15',
                    'BTS:E16',
                    'BTS:E17',
                    'BTS:E18',
                    'BTS:E19',
                    'BTS:E20',
                    'BTS:E21',
                    'BTS:E22',
                    'BTS:E23',
                ],
            },
            {
                key: 'BTS-Silom',
                color: '#10b981',
                stationRefs: [
                    'BTS:W1',
                    'BTS:CEN',
                    'BTS:S1',
                    'BTS:S2',
                    'BTS:S3',
                    'BTS:S4',
                    'BTS:S5',
                    'BTS:S6',
                    'BTS:S7',
                    'BTS:S8',
                    'BTS:S9',
                    'BTS:S10',
                    'BTS:S11',
                    'BTS:S12',
                ],
            },
            {
                key: 'Gold',
                color: '#d4a017',
                stationRefs: [
                    'Gold:G1',
                    'Gold:G2',
                    'Gold:G3',
                ],
            },
            {
                key: 'MRT-Blue',
                color: '#3b82f6',
                stationRefs: [
                    'MRT:BL01',
                    'MRT:BL02',
                    'MRT:BL03',
                    'MRT:BL04',
                    'MRT:BL05',
                    'MRT:BL06',
                    'MRT:BL07',
                    'MRT:BL08',
                    'MRT:BL09',
                    'MRT:BL10',
                    'MRT:BL11',
                    'MRT:BL12',
                    'MRT:BL13',
                    'MRT:BL14',
                    'MRT:BL15',
                    'MRT:BL16',
                    'MRT:BL17',
                    'MRT:BL18',
                    'MRT:BL19',
                    'MRT:BL20',
                    'MRT:BL21',
                    'MRT:BL22',
                    'MRT:BL23',
                    'MRT:BL24',
                    'MRT:BL25',
                    'MRT:BL26',
                    'MRT:BL27',
                    'MRT:BL28',
                    'MRT:BL29',
                    'MRT:BL30',
                    'MRT:BL31',
                    'MRT:BL32',
                    'MRT:BL33',
                    'MRT:BL34',
                    'MRT:BL35',
                    'MRT:BL36',
                    'MRT:BL37',
                    'MRT:BL38',
                ],
            },
            {
                key: 'Purple',
                color: '#7c3aed',
                stationRefs: [
                    'Purple:PP01',
                    'Purple:PP02',
                    'Purple:PP03',
                    'Purple:PP04',
                    'Purple:PP05',
                    'Purple:PP06',
                    'Purple:PP07',
                    'Purple:PP08',
                    'Purple:PP09',
                    'Purple:PP10',
                    'Purple:PP11',
                    'Purple:PP12',
                    'Purple:PP13',
                    'Purple:PP14',
                    'Purple:PP15',
                    'Purple:PP16',
                ],
            },
            {
                key: 'Pink',
                color: '#ec4899',
                stationRefs: [
                    'Pink:PK01',
                    'Pink:PK02',
                    'Pink:PK03',
                    'Pink:PK04',
                    'Pink:PK05',
                    'Pink:PK06',
                    'Pink:PK07',
                    'Pink:PK08',
                    'Pink:PK09',
                    'Pink:PK10',
                    'Pink:PK11',
                    'Pink:PK12',
                    'Pink:PK13',
                    'Pink:PK14',
                    'Pink:PK15',
                    'Pink:PK16',
                    'Pink:PK17',
                    'Pink:PK18',
                    'Pink:PK19',
                    'Pink:PK20',
                    'Pink:PK21',
                    'Pink:PK22',
                    'Pink:PK23',
                    'Pink:PK24',
                    'Pink:PK25',
                    'Pink:PK26',
                    'Pink:PK27',
                    'Pink:PK28',
                    'Pink:PK29',
                    'Pink:PK30',
                ],
            },
            {
                key: 'Pink-Extension',
                color: '#ec4899',
                stationRefs: [
                    'Pink:PK10',
                    'Pink:MT01',
                    'Pink:MT02',
                ],
            },
            {
                key: 'Yellow',
                color: '#eab308',
                stationRefs: [
                    'Yellow:YL01',
                    'Yellow:YL02',
                    'Yellow:YL03',
                    'Yellow:YL04',
                    'Yellow:YL05',
                    'Yellow:YL06',
                    'Yellow:YL07',
                    'Yellow:YL08',
                    'Yellow:YL09',
                    'Yellow:YL10',
                    'Yellow:YL11',
                    'Yellow:YL12',
                    'Yellow:YL13',
                    'Yellow:YL14',
                    'Yellow:YL15',
                    'Yellow:YL16',
                    'Yellow:YL17',
                    'Yellow:YL18',
                    'Yellow:YL19',
                    'Yellow:YL20',
                    'Yellow:YL21',
                    'Yellow:YL22',
                    'Yellow:YL23',
                ],
            },
            {
                key: 'Red-Dark',
                color: '#dc2626',
                stationRefs: [
                    'Red:RN01',
                    'Red:RN02',
                    'Red:RN03',
                    'Red:RN04',
                    'Red:RN05',
                    'Red:RN06',
                    'Red:RN07',
                    'Red:RN08',
                    'Red:RN09',
                    'Red:RN10',
                ],
            },
            {
                key: 'Red-Light',
                color: '#dc2626',
                stationRefs: [
                    'Red:RW01',
                    'Red:RW02',
                    'Red:RW05',
                    'Red:RW06',
                ],
            },
            {
                key: 'ARL',
                color: '#a855f7',
                stationRefs: [
                    'ARL:A1',
                    'ARL:A2',
                    'ARL:A3',
                    'ARL:A4',
                    'ARL:A5',
                    'ARL:A6',
                    'ARL:A7',
                    'ARL:A8',
                ],
            },
        ];

        lineDefinitions.forEach(
            (line) => {
                const stations =
                    line.stationRefs
                        .map((ref) =>
                            stationMap.get(
                                ref
                            )
                        )
                        .filter(
                            (
                                station
                            ): station is Station =>
                                station !==
                                undefined
                        );

                if (
                    stations.length <
                    2
                ) {
                    return;
                }

                const path: google.maps.LatLngLiteral[] =
                    stations.map(
                        (station) => ({
                            lat: station
                                .coordinate
                                .latitude,
                            lng: station
                                .coordinate
                                .longitude,
                        })
                    );

                const polyline =
                    new google.maps.Polyline(
                        {
                            path,
                            geodesic: true,
                            strokeColor:
                                line.color,
                            strokeOpacity: 0.75,
                            strokeWeight: 4,
                            map,
                            zIndex: 1,
                        }
                    );

                polylines.push(
                    polyline
                );
            }
        );

        return () => {
            polylines.forEach(
                (polyline) => {
                    polyline.setMap(
                        null
                    );
                }
            );
        };
    }, [map, stationMap]);

    return null;
}


/**
 * ---------------------------------------------------------
 * SRT national railway track layer
 * ---------------------------------------------------------
 *
 * Draws verified railway geometry from the production GeoJSON.
 *
 * Important:
 * - This does NOT connect station markers with straight lines.
 * - Geometry comes from the verified GISTDA railway dataset.
 * - Generic short "RAILWAY" fragments are intentionally excluded
 *   from the production GeoJSON.
 * - Existing BTS / MRT / ARL / monorail rendering is untouched.
 */
function SrtTrackLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) {
            return;
        }

        let cancelled = false;

        const polylines: google.maps.Polyline[] = [];

        type SrtTrackFeature = {
            type: 'Feature';
            properties?: {
                NAME?: string;
            };
            geometry?: {
                type?: string;
                coordinates?: unknown;
            };
        };

        type SrtTrackCollection = {
            type: 'FeatureCollection';
            features: SrtTrackFeature[];
        };

        const isCoordinatePair = (
            value: unknown
        ): value is [number, number] => {
            return (
                Array.isArray(value) &&
                value.length >= 2 &&
                typeof value[0] === 'number' &&
                Number.isFinite(value[0]) &&
                typeof value[1] === 'number' &&
                Number.isFinite(value[1])
            );
        };

        const loadTracks = async () => {
            try {
                const response = await fetch(
                    '/data/srt/tracks.production.geojson'
                );

                if (!response.ok) {
                    throw new Error(
                        `SRT track GeoJSON request failed: ${response.status}`
                    );
                }

                const data =
                    (await response.json()) as SrtTrackCollection;

                if (
                    cancelled ||
                    data.type !== 'FeatureCollection' ||
                    !Array.isArray(data.features)
                ) {
                    return;
                }

                data.features.forEach((feature) => {
                    if (
                        feature.geometry?.type !==
                        'LineString'
                    ) {
                        return;
                    }

                    const rawCoordinates =
                        feature.geometry.coordinates;

                    if (
                        !Array.isArray(rawCoordinates)
                    ) {
                        return;
                    }

                    const path =
                        rawCoordinates
                            .filter(isCoordinatePair)
                            .map(([lng, lat]) => ({
                                lat,
                                lng,
                            }));

                    if (path.length < 2) {
                        return;
                    }

                    const polyline =
                        new google.maps.Polyline({
                            path,
                            geodesic: true,
                            strokeColor: '#64748b',
                            strokeOpacity: 0.78,
                            strokeWeight: 3,
                            map,
                            zIndex: 0,
                            clickable: false,
                        });

                    polylines.push(polyline);
                });
            } catch (error) {
                console.error(
                    'Failed to load SRT track geometry:',
                    error
                );
            }
        };

        void loadTracks();

        return () => {
            cancelled = true;

            polylines.forEach((polyline) => {
                polyline.setMap(null);
            });
        };
    }, [map]);

    return null;
}

/**
 * ---------------------------------------------------------
 * 目的地変更時の地図移動
 * ---------------------------------------------------------
 *
 * Google Maps の defaultCenter は初回マウント時しか
 * 基本的に反映されないため、目的地が変更されたときは
 * panTo() を明示的に実行する。
 */
function MapDestinationController({
    destination,
    isDetailSheetOpen,
}: {
    destination: {
        lat: number;
        lng: number;
    };
    isDetailSheetOpen: boolean;
}) {
    const map = useMap();
    const destinationLat = destination.lat;
    const destinationLng = destination.lng;

    useEffect(() => {
        if (!map) {
            return;
        }

        map.panTo({
            lat: destinationLat,
            lng: destinationLng,
        });

        /*
         * Desktop + DetailSheet OPEN:
         * 選択地点がシートの背後に隠れないよう、
         * 目的地点を画面右側へ移動する。
         *
         * DetailSheet CLOSED:
         * panTo() の中央表示をそのまま維持する。
         *
         * Mobile:
         * 横幅が限られるため中央表示を維持する。
         */
        if (
            isDetailSheetOpen &&
            window.matchMedia('(min-width: 768px)').matches
        ) {
            const desiredOffset = 340;
            const edgeMargin = 80;
            const maxOffset =
                window.innerWidth / 2 - edgeMargin;

            const offsetX = Math.max(
                0,
                Math.min(
                    desiredOffset,
                    maxOffset
                )
            );

            map.panBy(-offsetX, 0);
        }
    }, [
        map,
        destinationLat,
        destinationLng,
        isDetailSheetOpen,
    ]);

    return null;
}


/**
 * ---------------------------------------------------------
 * Google Routes API によるルート描画
 * ---------------------------------------------------------
 *
 * 重要:
 * - GPS取得はここでは行わない。
 * - origin は page.tsx から受け取る。
 * - destination は選択された目的地。
 */
function CustomPolylineRouteComponent({
    origin,
    destination,
    travelMode,
}: {
    origin: {
        lat: number;
        lng: number;
    };
    destination: {
        lat: number;
        lng: number;
    };
    travelMode: string;
}) {
    const map = useMap();
    const originLat = origin.lat;
    const originLng = origin.lng;
    const destinationLat = destination.lat;
    const destinationLng = destination.lng;

    const [
        pathCoordinates,
        setPathCoordinates,
    ] = useState<
        google.maps.LatLngLiteral[]
    >([]);

    /*
     * ---------------------------------------------------------
     * Routes API
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (!map) {
            return;
        }

        let cancelled = false;

        const calculateRoute =
            async () => {
                try {
                    const { Route } =
                        (await google.maps.importLibrary(
                            'routes'
                        )) as google.maps.RoutesLibrary;

                    let googleTravelMode:
                        | 'WALKING'
                        | 'DRIVING'
                        | 'TRANSIT' =
                        'TRANSIT';

                    if (
                        travelMode ===
                        'walking'
                    ) {
                        googleTravelMode =
                            'WALKING';
                    } else if (
                        travelMode ===
                            'driving' ||
                        travelMode ===
                            'taxi'
                    ) {
                        googleTravelMode =
                            'DRIVING';
                    } else {
                        googleTravelMode =
                            'TRANSIT';
                    }

                    const {
                        routes,
                    } =
                        await Route.computeRoutes(
                            {
                                origin: { lat: originLat, lng: originLng },
                                destination: { lat: destinationLat, lng: destinationLng },
                                travelMode:
                                    googleTravelMode,
                                fields: [
                                    'path',
                                ],
                            }
                        );

                    if (cancelled) {
                        return;
                    }

                    if (
                        routes &&
                        routes.length >
                            0 &&
                        routes[0].path
                    ) {
                        const points =
                            routes[0].path.map(
                                (
                                    point
                                ) => ({
                                    lat: point.lat,
                                    lng: point.lng,
                                })
                            );

                        setPathCoordinates(
                            points
                        );
                    } else {
                        setPathCoordinates(
                            []
                        );
                    }
                } catch (error) {
                    if (!cancelled) {
                        console.error(
                            'Routes API Error:',
                            error
                        );

                        setPathCoordinates(
                            []
                        );
                    }
                }
            };

        calculateRoute();

        return () => {
            cancelled = true;
        };
    }, [
        map,
        originLat,
        originLng,
        destinationLat,
        destinationLng,
        travelMode,
    ]);

    /*
     * ---------------------------------------------------------
     * ルートPolyline
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (
            !map ||
            pathCoordinates.length ===
                0
        ) {
            return;
        }

        const strokeColor =
            travelMode === 'walking'
                ? '#059669'
                : travelMode === 'taxi'
                    ? '#d97706'
                    : travelMode ===
                          'driving'
                        ? '#dc2626'
                        : '#2563eb';

        /*
         * 白い外枠
         */
        const borderPolyline =
            new google.maps.Polyline(
                {
                    path: pathCoordinates,
                    geodesic: true,
                    strokeColor:
                        '#ffffff',
                    strokeOpacity: 0.9,
                    strokeWeight: 8,
                    zIndex: 998,
                    map,
                }
            );

        /*
         * メインルート
         */
        const mainPolyline =
            new google.maps.Polyline(
                {
                    path: pathCoordinates,
                    geodesic: true,
                    strokeColor,
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                    zIndex: 999,
                    map,
                }
            );

        return () => {
            borderPolyline.setMap(
                null
            );

            mainPolyline.setMap(
                null
            );
        };
    }, [
        map,
        pathCoordinates,
        travelMode,
    ]);

    return null;
}

/**
 * ---------------------------------------------------------
 * GoogleMap 本体
 * ---------------------------------------------------------
 */
export default function GoogleMapComponent({
    userLocation,
    destinationCoordinate,
    destinationTitle,
    travelMode = 'transit',
    onSelectArbitraryPoint,
    onSelectStation,
    isDetailSheetOpen = false,
}: GoogleMapProps) {
    const apiKey =
        process.env
            .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const [
        activeStation,
        setActiveStation,
    ] = useState<Station | null>(
        null
    );

    const [
        isDestinationOpen,
        setIsDestinationOpen,
    ] = useState<boolean>(false);

    /*
     * 駅マーカーを実座標から少しずらす。
     *
     * 現在は既存仕様を維持。
     * 公開版の最終精度確認時に再評価する。
     */
    const OFFSET = 0.00015;

    /*
     * ---------------------------------------------------------
     * 路線ごとのマーカー表示
     * ---------------------------------------------------------
     */
    const getStationStyle = (
        line: string
    ) => {
        switch (line) {
            case 'BTS':
                return {
                    color: '#22c55e',
                    icon: '🚆',
                };

            case 'MRT':
                return {
                    color: '#3b82f6',
                    icon: '🚇',
                };

            case 'ARL':
                return {
                    color: '#a855f7',
                    icon: '✈️',
                };

            case 'Boat':
                return {
                    color: '#06b6d4',
                    icon: '🚢',
                };

            case 'Bus':
                return {
                    color: '#f59e0b',
                    icon: '🚌',
                };

            case 'Gold':
                return {
                    color: '#d4a017',
                    icon: '🚆',
                };

            case 'Pink':
                return {
                    color: '#ec4899',
                    icon: '🚆',
                };

            case 'Yellow':
                return {
                    color: '#eab308',
                    icon: '🚆',
                };

            case 'Purple':
                return {
                    color: '#7c3aed',
                    icon: '🚆',
                };

            case 'Red':
                return {
                    color: '#dc2626',
                    icon: '🚆',
                };

            case 'SRT':
                return {
                    color: '#64748b',
                    icon: '🚆',
                };

            default:
                return {
                    color: '#f97316',
                    icon: '📍',
                };
        }
    };

    /*
     * ---------------------------------------------------------
     * 運行・営業状態
     * ---------------------------------------------------------
     *
     * stations.ts 側の serviceStatus / serviceNote を
     * マーカー表示へ汎用的に反映する。
     */
    const getStationServiceInfo = (
        station: Station
    ) => {
        const serviceStation =
            station as Station & {
                serviceStatus?:
                    | 'active'
                    | 'limited'
                    | 'inactive';
                serviceNote?: string;
            };

        const status =
            serviceStation.serviceStatus ??
            'active';

        if (status === 'inactive') {
            return {
                status,
                label: station.line === 'Boat' ? '通常便では利用不可' : '休止中',
                note:
                    serviceStation.serviceNote ??
                    '現在利用できません。',
                markerOpacity: 0.55,
                markerFilter:
                    'grayscale(0.65)',
            };
        }

        if (status === 'limited') {
            return {
                status,
                label: '運航・停車状況に注意',
                note:
                    serviceStation.serviceNote ??
                    '運航・停車状況を事前に確認してください。',
                markerOpacity: 0.85,
                markerFilter: 'none',
            };
        }

        return {
            status,
            label: null,
            note:
                serviceStation.serviceNote ??
                null,
            markerOpacity: 1,
            markerFilter: 'none',
        };
    };

    /*
     * ---------------------------------------------------------
     * 地図クリック
     * ---------------------------------------------------------
     */
    const handleMapClick = (
        e: MapMouseEvent
    ) => {
        setActiveStation(null);
        setIsDestinationOpen(false);

        if (
            e.detail &&
            e.detail.latLng &&
            onSelectArbitraryPoint
        ) {
            const lat =
                e.detail.latLng.lat;

            const lng =
                e.detail.latLng.lng;

            const customTitle =
                `指定地点 (${lat.toFixed(
                    4
                )}, ${lng.toFixed(4)})`;

            onSelectArbitraryPoint(
                customTitle,
                lat,
                lng
            );
        }
    };

    return (
        <APIProvider
            apiKey={apiKey || ''}
            libraries={[
                'places',
                'routes',
            ]}
        >
            <div className="w-full h-full relative">
                <GoogleMap
                    defaultCenter={{
                        lat: destinationCoordinate.lat,
                        lng: destinationCoordinate.lng,
                    }}
                    defaultZoom={13.5}
                    mapId="bkk_navi_map_id"
                    gestureHandling="greedy"
                    zoomControl={true}
                    fullscreenControl={false}
                    streetViewControl={false}
                    scaleControl={true}
                    onClick={
                        handleMapClick
                    }
                >
                    {/*
                     * 目的地変更時に地図を移動
                     */}
                    <MapDestinationController
                        destination={
                            destinationCoordinate
                        }
                        isDetailSheetOpen={
                            isDetailSheetOpen
                        }
                    />

                    {/*
                     * 路線表示
                     */}
                    <TransitLinesComponent />

                    {/*
                     * SRT national railway geometry
                     */}
                    <SrtTrackLayer />

                    {/*
                     * Google Routes API
                     *
                     * userLocation →
                     * destinationCoordinate
                     */}
                    <CustomPolylineRouteComponent
                        origin={
                            userLocation
                        }
                        destination={
                            destinationCoordinate
                        }
                        travelMode={
                            travelMode
                        }
                    />

                    {/*
                     * -------------------------------------------------
                     * 現在地マーカー
                     * -------------------------------------------------
                     *
                     * destination marker と明確に区別する。
                     *
                     * 青:
                     *   現在地 / ルート出発地点
                     *
                     * 赤:
                     *   目的地
                     */}
                    <AdvancedMarker
                        position={
                            userLocation
                        }
                    >
                        <div
                            className="flex items-center justify-center relative"
                            aria-label="現在地"
                        >
                            <div className="absolute w-9 h-9 rounded-full bg-blue-500/20 animate-ping"></div>

                            <div className="relative w-5 h-5 rounded-full bg-blue-600 border-[3px] border-white shadow-lg"></div>
                        </div>
                    </AdvancedMarker>

                    {/*
                     * -------------------------------------------------
                     * 目的地マーカー
                     * -------------------------------------------------
                     */}
                    <AdvancedMarker
                        position={{
                            lat: destinationCoordinate.lat,
                            lng: destinationCoordinate.lng,
                        }}
                        onClick={() =>
                            setIsDestinationOpen(
                                !isDestinationOpen
                            )
                        }
                    >
                        <div className="flex flex-col items-center relative p-2 cursor-pointer">
                            <div className="bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-base animate-bounce">
                                📍
                            </div>

                            {isDestinationOpen && (
                                <div className="absolute top-full mt-1 px-2.5 py-1 rounded bg-white border border-red-200 shadow-xl whitespace-nowrap z-50">
                                    <span className="text-xs font-bold text-gray-900">
                                        {
                                            destinationTitle
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </AdvancedMarker>

                    {/*
                     * -------------------------------------------------
                     * 全駅・交通拠点マーカー
                     * -------------------------------------------------
                     */}
                    {allBangkokStations.map(
                        (
                            station,
                            index
                        ) => {
                            const style =
                                getStationStyle(
                                    station.line
                                );

                            const serviceInfo =
                                getStationServiceInfo(
                                    station
                                );

                            const isSelected =
                                activeStation?.name ===
                                    station.name &&
                                activeStation?.line ===
                                    station.line;

                            const adjustedLat =
                                station
                                    .coordinate
                                    .latitude +
                                OFFSET;

                            const adjustedLng =
                                station
                                    .coordinate
                                    .longitude +
                                OFFSET;

                            return (
                                <AdvancedMarker
                                    key={`${station.line}-${station.stationCode ?? station.name}-${index}`}
                                    position={{
                                        lat: adjustedLat,
                                        lng: adjustedLng,
                                    }}
                                    onClick={() => {
                                        setActiveStation(
                                            station
                                        );

                                        setIsDestinationOpen(
                                            false
                                        );

                                        onSelectStation?.(
                                            station
                                        );
                                    }}
                                >
                                    <div
                                        className="flex flex-col items-center relative p-2 cursor-pointer"
                                        style={{
                                            zIndex:
                                                isSelected
                                                    ? 100
                                                    : 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor:
                                                    style.color,
                                                opacity:
                                                    serviceInfo.markerOpacity,
                                                filter:
                                                    serviceInfo.markerFilter,
                                            }}
                                            className={`text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all duration-200 ${
                                                isSelected
                                                    ? 'w-9 h-9 text-sm scale-110 shadow-lg'
                                                    : 'w-7 h-7 text-xs'
                                            }`}
                                        >
                                            {
                                                style.icon
                                            }
                                        </div>

                                        {isSelected && (
                                            <div className="absolute top-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-gray-300 shadow-2xl whitespace-nowrap z-50">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-extrabold text-gray-900">
                                                        {
                                                            station.nameJa ??
                                            station.nameEn ??
                                            station.name
                                                        }{' '}
                                                        (
                                                        {
                                                            station.line
                                                        }
                                                        )
                                                    </span>

                                                    {station.stationCode && (
                                                        <span className="text-[10px] font-normal text-gray-500">
                                                            {
                                                                station.stationCode
                                                            }
                                                        </span>
                                                    )}

                                                    {serviceInfo.label && (
                                                        <span
                                                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                                serviceInfo.status ===
                                                                'inactive'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-amber-100 text-amber-700'
                                                            }`}
                                                        >
                                                            {
                                                                serviceInfo.label
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                {serviceInfo.note && (
                                                    <div
                                                        className={`mt-1 text-[10px] font-medium ${
                                                            serviceInfo.status ===
                                                            'inactive'
                                                                ? 'text-red-700'
                                                                : serviceInfo.status ===
                                                                    'limited'
                                                                  ? 'text-amber-700'
                                                                  : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {
                                                            serviceInfo.note
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </AdvancedMarker>
                            );
                        }
                    )}
                </GoogleMap>
            </div>
        </APIProvider>
    );
}