'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { getSecureHotelImageUrl } from '@/utils/hotelImageUrl';
import GoogleMapComponent from '@/components/GoogleMap';
import DetailSheet from '@/components/DetailSheet';
import ThaiDriverCardModal from '@/components/ThaiDriverCardModal';
import { useDestinationAddress } from '@/hooks/useDestinationAddress';
import GuideModal from '@/components/GuideModal';
import EmergencyModal from '@/components/EmergencyModal';
import TravelPlanDrawer, {
    ItineraryItem,
} from '@/components/TravelPlanDrawer';
import { bangkokLandmarks } from '@/data/landmarks';
import { bangkokHotels } from '@/data/hotels';
import { ExchangeShop } from '@/data/guides';
import { RecommendedSpot } from '@/data/recommendations';
import { allBangkokStations } from '@/data/stations';
import { getBoatServiceNotice } from '@/utils/boatServiceNotice';
import BoatServiceNotice from '@/components/BoatServiceNotice';

type CoordinateCandidate = {
    id?: string;
    name?: string;
    nameJa?: string;
    nameEn?: string;
    category?: string;
    line?: string;
    route?: string;
    stationCode?: string;
    serviceStatus?: 'active' | 'limited' | 'inactive';
    serviceNote?: string;
    address?: string;
    place_id?: string;
    hotelId?: string | number;
    hotelName?: string;
    imageURL?: string;
    imageUrl?: string;
    dailyRate?: number | string;
    price?: number | string;
    currency?: string;
    star?: number | string;
    starRating?: number | string;
    stars?: number | string;
    reviewScore?: number | string;
    discountPercentage?: number | string;
    landingURL?: string;
    landingUrl?: string;
    coordinate?: {
        latitude?: number | string;
        longitude?: number | string;
        lat?: number | string;
        lng?: number | string;
    };
    latitude?: number | string;
    longitude?: number | string;
    lat?: number | string;
    lng?: number | string;
};

type GooglePlaceItem = CoordinateCandidate & {
    id: string;
    name: string;
    address: string;
    category: string;
    latitude: number;
    longitude: number;
    rating: number;
    userRatingsTotal: number;
};

type HotelDisplayItem = CoordinateCandidate & {
    id?: string;
    name?: string;
};

/**
 * ---------------------------------------------------------
 * デモ用の現在地
 * ---------------------------------------------------------
 *
 * GPS取得前、または対象エリア外・取得失敗時に使用する。
 *
 * 重要:
 * - 現在地(userLocation)と目的地(destinationCoordinate)は別管理。
 * - この座標を目的地として扱わない。
 */
const DEMO_ORIGIN = {
    lat: 13.7367,
    lng: 100.5606,
};

/**
 * ---------------------------------------------------------
 * 直線距離計算
 * ---------------------------------------------------------
 *
 * userLocation → destinationCoordinate の距離を
 * Haversine formula で計算する。
 */
function calculateDistanceKm(
    from: {
        lat: number;
        lng: number;
    },
    to: {
        lat: number;
        lng: number;
    }
): number {
    const R = 6371;

    const dLat =
        (to.lat - from.lat) *
        (Math.PI / 180);

    const dLng =
        (to.lng - from.lng) *
        (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
        Math.cos(
            from.lat *
                (Math.PI / 180)
        ) *
            Math.cos(
                to.lat *
                    (Math.PI / 180)
            ) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return Math.round(
        R * c * 10
    ) / 10;
}

function createItineraryId(): string {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 11)}`;
}

function MainContent() {
    const [selectedMode, setSelectedMode] =
        useState<string>('transit');

    /**
     * -----------------------------------------------------
     * 現在地
     * -----------------------------------------------------
     *
     * GPSで取得する「出発地点」。
     *
     * 目的地とは完全に分離する。
     */
    const [userLocation, setUserLocation] =
        useState<{
            lat: number;
            lng: number;
        }>(DEMO_ORIGIN);

    /**
     * -----------------------------------------------------
     * 目的地
     * -----------------------------------------------------
     */
    const [destinationCoordinate, setDestinationCoordinate] =
        useState({
            lat: 13.7460,
            lng: 100.5347,
        });

    const [destinationTitle, setDestinationTitle] =
        useState<string>(
            'サイアム・パラゴン (デモモード)'
        );

    const { address: destinationAddress, retryAddress } = useDestinationAddress(
        destinationCoordinate.lat, destinationCoordinate.lng,
    );

    const [searchText, setSearchText] =
        useState<string>('');

    const [selectedCategory, setSelectedCategory] =
        useState<string | null>(null);

    const [bkkTime, setBkkTime] =
        useState<string>('');

    const [isDemoMode, setIsDemoMode] =
        useState<boolean>(true);

    const [toastMessage, setToastMessage] =
        useState<string | null>(null);

    const [itineraryItems, setItineraryItems] =
        useState<ItineraryItem[]>([]);

    useEffect(() => {
        const savedPlan =
            localStorage.getItem(
                'bkk_nav_itinerary'
            );

        if (!savedPlan) {
            return;
        }

        try {
            const parsed: unknown =
                JSON.parse(savedPlan);

            if (Array.isArray(parsed)) {
                queueMicrotask(() => {
                    setItineraryItems(
                        parsed as ItineraryItem[]
                    );
                });
            }
        } catch {
            localStorage.removeItem(
                'bkk_nav_itinerary'
            );
        }
    }, []);

    const [showTravelPlanDrawer, setShowTravelPlanDrawer] =
        useState<boolean>(false);

    const [showDetailSheet, setShowDetailSheet] =
        useState<boolean>(false);

    const [showThaiCard, setShowThaiCard] =
        useState<boolean>(false);

    const [activeGuide, setActiveGuide] =
        useState<
            | 'exchange'
            | 'squall'
            | 'prep'
            | 'manner'
            | 'recommend'
            | 'transport'
            | 'safety'
            | 'thai_phrases'
            | 'drive'
            | 'stomach'
            | 'shopping'
            | null
        >(null);

    const [showEmergencyModal, setShowEmergencyModal] =
        useState<boolean>(false);

    const [agodaHotels, setAgodaHotels] =
        useState<HotelDisplayItem[]>([]);

    const [selectedAgodaHotel, setSelectedAgodaHotel] =
        useState<{
            title: string;
            hotelId: string;
        } | null>(null);

    const [agodaLoading, setAgodaLoading] =
        useState<boolean>(true);

    const [googlePlaces, setGooglePlaces] =
        useState<GooglePlaceItem[]>([]);

    const [placesLoading, setPlacesLoading] =
        useState<boolean>(false);

    /*
     * ---------------------------------------------------------
     * Agodaホテル取得
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const fetchAgodaHotelsDirectly =
            async () => {
                try {
                    setAgodaLoading(true);

                    const res =
                        await fetch(
                            '/api/hotels'
                        );

                    if (!res.ok) {
                        throw new Error(
                            'HTTP error! status: ' +
                                res.status
                        );
                    }

                    const data: unknown =
                        await res.json();

                    let hotelList: unknown[] =
                        [];

                    if (
                        Array.isArray(data)
                    ) {
                        hotelList = data;
                    } else if (
                        data &&
                        typeof data ===
                            'object'
                    ) {
                        const responseData =
                            data as {
                                hotels?: unknown;
                                results?: unknown;
                                hotelList?: unknown;
                                data?: unknown;
                            };

                        if (
                            Array.isArray(
                                responseData.hotels
                            )
                        ) {
                            hotelList =
                                responseData.hotels;
                        } else if (
                            Array.isArray(
                                responseData.results
                            )
                        ) {
                            hotelList =
                                responseData.results;
                        } else if (
                            Array.isArray(
                                responseData.hotelList
                            )
                        ) {
                            hotelList =
                                responseData.hotelList;
                        } else if (
                            Array.isArray(
                                responseData.data
                            )
                        ) {
                            hotelList =
                                responseData.data;
                        }
                    }

                    setAgodaHotels(
                        hotelList as HotelDisplayItem[]
                    );
                } catch (err) {
                    console.error(
                        'Direct Agoda Fetch Error:',
                        err
                    );

                    setAgodaHotels([]);
                } finally {
                    setAgodaLoading(false);
                }
            };

        fetchAgodaHotelsDirectly();
    }, []);

    /*
     * ---------------------------------------------------------
     * Toast
     * ---------------------------------------------------------
     */
    const showToast = (
        msg: string
    ) => {
        setToastMessage(msg);

        setTimeout(() => {
            setToastMessage(null);
        }, 2500);
    };

    /*
     * ---------------------------------------------------------
     * Google Places検索
     * ---------------------------------------------------------
     *
     * PlacesService.textSearch() から
     * Places API (New) の Place.searchByText() に移行。
     */
    useEffect(() => {
        if (
            !searchText ||
            searchText.trim().length < 2
        ) {
            return;
        }

        let cancelled = false;

        const timer = setTimeout(
            async () => {
                try {
                    setPlacesLoading(true);

                    if (
                        typeof window ===
                            'undefined' ||
                        !window.google?.maps
                            ?.importLibrary
                    ) {
                        console.log(
                            'Google Maps Places API not ready yet'
                        );

                        setGooglePlaces([]);
                        setPlacesLoading(false);

                        return;
                    }

                    const placesLibrary =
                        (await google.maps.importLibrary(
                            'places'
                        )) as google.maps.PlacesLibrary;

                    const { Place } =
                        placesLibrary;

                    const { places } =
                        await Place.searchByText(
                            {
                                textQuery:
                                    searchText +
                                    ' バンコク',
                                fields: [
                                    'id',
                                    'displayName',
                                    'formattedAddress',
                                    'location',
                                    'rating',
                                    'userRatingCount',
                                ],
                                language: 'ja',
                                maxResultCount: 20,
                            }
                        );

                    if (cancelled) {
                        return;
                    }

                    /**
                     * 座標が存在しないGoogle Placeは
                     * アプリの目的地候補として使用しない。
                     *
                     * 以前のように
                     * 13.7460 / 100.5347 を
                     * フォールバック座標にはしない。
                     */
                    const mapped: GooglePlaceItem[] =
                        places
                            .map((place) => {
                                const latitude =
                                    place.location?.lat();

                                const longitude =
                                    place.location?.lng();

                                if (
                                    !Number.isFinite(
                                        latitude
                                    ) ||
                                    !Number.isFinite(
                                        longitude
                                    )
                                ) {
                                    return null;
                                }

                                return {
                                    id:
                                        place.id ||
                                        createItineraryId(),

                                    name:
                                        place.displayName ||
                                        'スポット',

                                    address:
                                        place.formattedAddress ||
                                        '',

                                    category:
                                        'Googleスポット',

                                    latitude,
                                    longitude,

                                    rating:
                                        place.rating ??
                                        0,

                                    userRatingsTotal:
                                        place.userRatingCount ??
                                        0,
                                };
                            })
                            .filter(
                                (
                                    place
                                ): place is GooglePlaceItem =>
                                    place !== null
                            );

                    setGooglePlaces(mapped);
                } catch (error) {
                    if (!cancelled) {
                        console.error(
                            'Google Places search error:',
                            error
                        );

                        setGooglePlaces([]);

                        showToast(
                            '⚠️ 検索できませんでした。通信状態を確認して、もう一度お試しください'
                        );
                    }
                } finally {
                    if (!cancelled) {
                        setPlacesLoading(
                            false
                        );
                    }
                }
            },
            700
        );

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [searchText]);

    const categories = [
        'すべて',
        '観光・ナイトスポット',
        '寺院',
        'ショッピング',
        'ホテル',
        '空港',
    ];

    /*
     * ---------------------------------------------------------
     * バンコク周辺判定
     * ---------------------------------------------------------
     *
     * 約100km以内を対象エリアとする。
     *
     * したがってUI上も「バンコク周辺」と表現する。
     */
    const checkIsBangkokArea = (
        lat: number,
        lng: number
    ) => {
        const bkkLat = 13.7460;
        const bkkLng = 100.5347;

        const dLat =
            Math.abs(lat - bkkLat) *
            111;

        const dLng =
            Math.abs(lng - bkkLng) *
            111 *
            Math.cos(
                bkkLat *
                    (Math.PI / 180)
            );

        return (
            Math.sqrt(
                dLat * dLat +
                    dLng * dLng
            ) <= 100
        );
    };

    /*
     * ---------------------------------------------------------
     * 現在地取得
     * ---------------------------------------------------------
     *
     * 重要:
     * - GPSは userLocation にだけ反映する。
     * - destinationCoordinate は変更しない。
     * - destinationTitle も変更しない。
     * - URLも変更しない。
     */
    const handleGetMyLocation = () => {
        if (!navigator.geolocation) {
            setUserLocation(DEMO_ORIGIN);
            setIsDemoMode(true);

            showToast(
                '⚠️ このブラウザでは現在地を取得できません。デモ位置（バンコク）を表示しています'
            );

            return;
        }

        showToast('現在地を取得中...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                if (checkIsBangkokArea(userLat, userLng)) {
                    setUserLocation({
                        lat: userLat,
                        lng: userLng,
                    });

                    setIsDemoMode(false);

                    showToast(
                        '📍 現在地（バンコク周辺）を設定しました'
                    );
                } else {
                    setUserLocation(DEMO_ORIGIN);
                    setIsDemoMode(true);

                    showToast(
                        '✈️ 現在地は対象エリア外です。デモ位置（バンコク）を表示しています'
                    );
                }
            },
            (error) => {
                console.warn(
                    'Geolocation error:',
                    error
                );

                setUserLocation(DEMO_ORIGIN);
                setIsDemoMode(true);

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    showToast(
                        '⚠️ 位置情報が許可されていません。デモ位置（バンコク）を表示しています'
                    );
                } else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    showToast(
                        '⚠️ 現在地を取得できませんでした。デモ位置（バンコク）を表示しています'
                    );
                } else if (
                    error.code ===
                    error.TIMEOUT
                ) {
                    showToast(
                        '⚠️ 現在地の取得がタイムアウトしました。デモ位置（バンコク）を表示しています'
                    );
                } else {
                    showToast(
                        '⚠️ 現在地の取得に失敗しました。デモ位置（バンコク）を表示しています'
                    );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    /*
     * ---------------------------------------------------------
     * URLパラメータ・保存済みプラン読み込み
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (
            typeof window !==
            'undefined'
        ) {
            const params =
                new URLSearchParams(
                    window.location.search
                );

            const lat =
                params.get('lat');

            const lng =
                params.get('lng');

            const title =
                params.get('title');

            if (lat && lng) {
                const pLat =
                    Number(lat);

                const pLng =
                    Number(lng);

                if (
                    Number.isFinite(
                        pLat
                    ) &&
                    Number.isFinite(
                        pLng
                    ) &&
                    pLat >= -90 &&
                    pLat <= 90 &&
                    pLng >= -180 &&
                    pLng <= 180
                ) {
                    queueMicrotask(() => {
                        setDestinationCoordinate({
                            lat: pLat,
                            lng: pLng,
                        });
                        setIsDemoMode(false);
                    });
                }
            }

            if (title) {
                queueMicrotask(() => {
                    setDestinationTitle(title);
                });
            }

        }
    }, []);

    /*
     * ---------------------------------------------------------
     * マイプラン保存
     * ---------------------------------------------------------
     */
    const saveItinerary = (
        items: ItineraryItem[]
    ) => {
        setItineraryItems(
            items
        );

        if (
            typeof window !==
            'undefined'
        ) {
            localStorage.setItem(
                'bkk_nav_itinerary',
                JSON.stringify(
                    items
                )
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * マイプラン追加
     * ---------------------------------------------------------
     */
    const handleAddToPlan = (
        title: string,
        category: string,
        lat: number,
        lng: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            showToast(
                '⚠️ この場所の座標を取得できないため、プランに追加できません'
            );

            return;
        }

        const newItem: ItineraryItem =
            {
                id: createItineraryId(),
                title,
                category,
                lat,
                lng,
            };

        saveItinerary([
            ...itineraryItems,
            newItem,
        ]);

        showToast(
            '✨ 「' +
                title +
                '」をマイプランに追加しました！'
        );
    };

    /*
     * ---------------------------------------------------------
     * マイプラン削除
     * ---------------------------------------------------------
     */
    const handleRemoveFromPlan = (
        id: string
    ) => {
        const updated =
            itineraryItems.filter(
                (item) =>
                    item.id !== id
            );

        saveItinerary(
            updated
        );
    };

    /*
     * ---------------------------------------------------------
     * バンコク時刻
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const updateBkkTime =
            () => {
                const now =
                    new Date();

                setBkkTime(
                    new Intl.DateTimeFormat(
                        'ja-JP',
                        {
                            timeZone:
                                'Asia/Bangkok',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                        }
                    ).format(now)
                );
            };

        updateBkkTime();

        const timer =
            setInterval(
                updateBkkTime,
                1000
            );

        return () =>
            clearInterval(
                timer
            );
    }, []);

    /*
     * ---------------------------------------------------------
     * URLパラメータ更新
     * ---------------------------------------------------------
     */
    const updateUrlParams = (
        title: string,
        lat: number,
        lng: number
    ) => {
        if (
            typeof window !==
            'undefined'
        ) {
            const params =
                new URLSearchParams(
                    window.location.search
                );

            params.set(
                'title',
                title
            );

            params.set(
                'lat',
                lat.toString()
            );

            params.set(
                'lng',
                lng.toString()
            );

            const queryString =
                params.toString();

            window.history.replaceState(
                {},
                '',
                window.location.pathname +
                    (
                        queryString
                            ? '?' +
                              queryString
                            : ''
                    )
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * 座標抽出
     * ---------------------------------------------------------
     *
     * 座標が存在しない場合は null。
     *
     * 以前のように、
     * 不明な座標をバンコク中心部へ
     * 勝手にフォールバックしない。
     */
    const extractCoordinates = (
        item: CoordinateCandidate
    ): {
        lat: number;
        lng: number;
    } | null => {
        const rawLat =
            item.coordinate?.latitude ??
            item.coordinate?.lat ??
            item.latitude ??
            item.lat;

        const rawLng =
            item.coordinate?.longitude ??
            item.coordinate?.lng ??
            item.longitude ??
            item.lng;

        if (
            rawLat == null ||
            rawLng == null
        ) {
            return null;
        }

        const lat =
            Number(rawLat);

        const lng =
            Number(rawLng);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {
            return null;
        }

        return {
            lat,
            lng,
        };
    };

    /*
     * ---------------------------------------------------------
     * ランドマーク選択
     * ---------------------------------------------------------
     */
    const handleSelectLandmark = (
        landmark: CoordinateCandidate
    ) => {
        const coordinates =
            extractCoordinates(
                landmark
            );

        if (!coordinates) {
            showToast(
                '⚠️ このスポットの位置情報を取得できません'
            );

            return;
        }

        const {
            lat,
            lng,
        } = coordinates;

        const name =
            landmark.name ||
            'スポット';

        setDestinationCoordinate(
            {
                lat,
                lng,
            }
        );

        setDestinationTitle(
            name
        );

        setSelectedCategory(
            null
        );

        setSearchText('');

        setShowDetailSheet(
            false
        );

        setIsDemoMode(
            false
        );

        updateUrlParams(
            name,
            lat,
            lng
        );

        showToast(
            '📍 「' +
                name +
                '」を目的地に設定しました'
        );
    };

    /*
     * ---------------------------------------------------------
     * 駅選択
     * ---------------------------------------------------------
     */
    const handleSelectStation = (
        station: CoordinateCandidate
    ) => {
        const coordinates =
            extractCoordinates(
                station
            );

        if (!coordinates) {
            showToast(
                '⚠️ この駅の位置情報を取得できません'
            );

            return;
        }

        const {
            lat,
            lng,
        } = coordinates;

        const stationDisplayName =
            station.nameJa ??
            station.nameEn ??
            station.name ??
            '駅';

        const title =
            stationDisplayName +
            ' (' +
            (station.line ||
                'BTS/MRT') +
            ')';

        setDestinationCoordinate(
            {
                lat,
                lng,
            }
        );

        setDestinationTitle(
            title
        );

        setSelectedCategory(
            null
        );

        setSearchText('');

        setShowDetailSheet(
            false
        );

        setIsDemoMode(
            false
        );

        updateUrlParams(
            title,
            lat,
            lng
        );

        if (
            station.line === 'Boat' &&
            station.serviceStatus === 'inactive'
        ) {
            showToast(
                '⚠️ 「' +
                    title +
                    '」は現在通常運航では利用できません'
            );
        } else if (
            station.line === 'Boat' &&
            station.serviceStatus === 'limited'
        ) {
            showToast(
                '⚠️ 「' +
                    title +
                    '」は利用条件・運航状況をご確認ください'
            );
        } else {
            showToast(
                '📍 「' +
                    title +
                    '」を目的地に設定しました'
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * 両替店選択
     * ---------------------------------------------------------
     */
    const handleSelectExchangeShop = (
        shop: ExchangeShop
    ) => {
        const coordinates =
            extractCoordinates(
                shop
            );

        if (!coordinates) {
            showToast(
                '⚠️ この両替店の位置情報を取得できません'
            );

            return;
        }

        const {
            lat,
            lng,
        } = coordinates;

        setDestinationCoordinate(
            {
                lat,
                lng,
            }
        );

        setDestinationTitle(
            shop.name
        );

        setSearchText('');

        setShowDetailSheet(
            false
        );

        setIsDemoMode(
            false
        );

        updateUrlParams(
            shop.name,
            lat,
            lng
        );

        showToast(
            '📍 「' +
                shop.name +
                '」を目的地に設定しました'
        );
    };

    /*
     * ---------------------------------------------------------
     * おすすめスポット選択
     * ---------------------------------------------------------
     */
    const handleSelectRecommendedSpot = (
        spot: RecommendedSpot
    ) => {
        const coordinates =
            extractCoordinates(
                spot
            );

        if (!coordinates) {
            showToast(
                '⚠️ このスポットの位置情報を取得できません'
            );

            return;
        }

        const {
            lat,
            lng,
        } = coordinates;

        setDestinationCoordinate(
            {
                lat,
                lng,
            }
        );

        setDestinationTitle(
            spot.name
        );

        setSearchText('');

        setShowDetailSheet(
            false
        );

        setIsDemoMode(
            false
        );

        updateUrlParams(
            spot.name,
            lat,
            lng
        );

        showToast(
            '📍 「' +
                spot.name +
                '」を目的地に設定しました'
        );
    };

    /*
     * ---------------------------------------------------------
     * ホテル選択
     * ---------------------------------------------------------
     */
    const handleSelectHotel = (
        hotel: HotelDisplayItem
    ) => {
        const coordinates =
            extractCoordinates(
                hotel
            );

        if (!coordinates) {
            showToast(
                '⚠️ このホテルの位置情報を取得できません'
            );

            return;
        }

        const {
            lat,
            lng,
        } = coordinates;

        const name =
            hotel.hotelName ||
            hotel.name ||
            'バンコクのホテル';

        const agodaHotelId = hotel.hotelId != null ? String(hotel.hotelId) : '';
        setSelectedAgodaHotel(agodaHotelId ? { title: name, hotelId: agodaHotelId } : null);

        setDestinationCoordinate(
            {
                lat,
                lng,
            }
        );

        setDestinationTitle(
            name
        );

        setSelectedCategory(
            null
        );

        setSearchText('');

        setShowDetailSheet(
            false
        );

        setIsDemoMode(
            false
        );

        updateUrlParams(
            name,
            lat,
            lng
        );

        showToast(
            '📍 「' +
                name +
                '」を目的地に設定しました'
        );
    };

    /*
     * ---------------------------------------------------------
     * 検索文字列
     * ---------------------------------------------------------
     */
    const query = searchText
        ? searchText
              .toLowerCase()
              .trim()
        : '';

    /*
     * ---------------------------------------------------------
     * ランドマーク表示条件
     * ---------------------------------------------------------
     */
    const isLandmarkAllowed =
        query.length > 0 ||
        !selectedCategory ||
        (
            selectedCategory !==
                'ホテル' &&
            (
                selectedCategory ===
                    'すべて' ||
                selectedCategory
            )
        );

    /*
     * ---------------------------------------------------------
     * ランドマーク検索
     * ---------------------------------------------------------
     */
    const filteredLandmarks =
        isLandmarkAllowed
            ? (
                  bangkokLandmarks ||
                  []
              ).filter(
                  (l) => {
                      const name =
                          (
                              l.name ||
                              ''
                          ).toLowerCase();

                      const category =
                          (
                              l.category ||
                              ''
                          ).toLowerCase();

                      if (query) {
                          return (
                              name.includes(
                                  query
                              ) ||
                              category.includes(
                                  query
                              )
                          );
                      }

                      if (
                          selectedCategory &&
                          selectedCategory !==
                              'すべて' &&
                          selectedCategory !==
                              'ホテル'
                      ) {
                          return category.includes(
                              selectedCategory
                          );
                      }

                      return true;
                  }
              )
            : [];

    /*
     * ---------------------------------------------------------
     * 駅検索
     * ---------------------------------------------------------
     */
    const filteredStations =
        query
            ? (
                  allBangkokStations ||
                  []
              ).filter((s) => {
                  const searchableStation =
                      [
                          s.name,
                          s.nameJa,
                          s.nameEn,
                          s.line,
                          s.route,
                          s.stationCode,
                      ]
                          .filter(Boolean)
                          .join(' ')
                          .toLowerCase();

                  return searchableStation.includes(
                      query
                  );
              })
            : [];

    /*
     * ---------------------------------------------------------
     * ホテル表示条件
     * ---------------------------------------------------------
     */
    const isHotelAllowed =
        query.length > 0 ||
        !selectedCategory ||
        selectedCategory ===
            'すべて' ||
        selectedCategory ===
            'ホテル';

    /*
     * ---------------------------------------------------------
     * 固定ホテル + Agodaホテル
     * ---------------------------------------------------------
     */
    const filteredHotels =
        isHotelAllowed
            ? [
                  ...bangkokHotels,
                  ...(agodaHotels ||
                      []),
              ].filter(
                  (
                      h: HotelDisplayItem
                  ) => {
                      const name =
                          (
                              h.hotelName ||
                              h.name ||
                              ''
                          ).toLowerCase();

                      if (query) {
                          return (
                              name.includes(
                                  query
                              ) ||
                              'ホテル'.includes(
                                  query
                              ) ||
                              'hotel'.includes(
                                  query
                              )
                          );
                      }

                      return true;
                  }
              )
            : [];

    const showDropdown =
        selectedCategory !== null ||
        searchText.trim().length > 0;

    const shouldShowGooglePlaces =
        searchText.trim().length >= 2;

    const visibleGooglePlaces = shouldShowGooglePlaces
        ? googlePlaces
        : [];

    const visiblePlacesLoading =
        shouldShowGooglePlaces && placesLoading;

    return (
        <main className="relative w-screen h-[100dvh] block bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
                <GoogleMapComponent
                    userLocation={
                        userLocation
                    }
                    destinationCoordinate={
                        destinationCoordinate
                    }
                    destinationTitle={
                        destinationTitle
                    }
                    travelMode={
                        selectedMode
                    }
                    isDetailSheetOpen={
                        showDetailSheet
                    }
                    onSelectStation={
                        handleSelectStation
                    }
                    onSelectArbitraryPoint={(title, lat, lng) => {
                        const pointTitle = title || `指定地点 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
                        setDestinationCoordinate({ lat, lng });
                        setDestinationTitle(pointTitle);
                        setIsDemoMode(false);
                        updateUrlParams(pointTitle, lat, lng);
                        showToast('📍 選択した地点を目的地に設定しました');
                    }}
                />
            </div>

            {toastMessage && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md animate-bounce pointer-events-none border border-white/10 flex items-center gap-2">
                    <span className="text-emerald-400">
                        ✨
                    </span>

                    <span>
                        {toastMessage}
                    </span>
                </div>
            )}

            <div className="absolute top-0 left-0 right-0 z-10 flex flex-col p-3 gap-2 pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg flex flex-col gap-2 max-w-md mx-auto w-full box-border">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span>
                                🛡️
                            </span>

                            <span className="truncate">
                                バンコクおまもりコンパス
                            </span>

                            {isDemoMode && (
                                <span className="bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0">
                                    DEMO
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg text-[11px] text-gray-700 shrink-0">
                            <span>
                                🇹🇭{' '}
                                {bkkTime}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl flex-1 min-w-0">
                            <span className="text-blue-600 font-bold shrink-0">
                                🔍
                            </span>

                            <input
                                id="destination-search"
                                name="destinationSearch"
                                aria-label="スポット・駅・ホテルを検索"
                                type="text"
                                placeholder="スポット・駅・ホテルを自由検索..."
                                value={
                                    searchText
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSearchText(
                                        e.target
                                            .value
                                    )
                                }
                                className="bg-transparent w-full outline-none text-sm text-gray-800 min-w-0"
                            />

                            {searchText && (
                                <button
                                    onClick={() =>
                                        setSearchText(
                                            ''
                                        )
                                    }
                                    className="text-gray-400 hover:text-gray-600 shrink-0"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <button
                            onClick={
                                handleGetMyLocation
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shrink-0"
                        >
                            📍 現在地
                        </button>
                    </div>
                </div>

                <div className="pointer-events-auto horizontal-scroll-safe flex gap-2 overflow-x-auto px-2 max-w-md mx-auto w-full items-center">
                    <button
                        onClick={() =>
                            setShowTravelPlanDrawer(
                                true
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
                    >
                        <span>
                            📋
                        </span>{' '}
                        マイプラン (
                        {
                            itineraryItems.length
                        }
                        )
                    </button>

                    <div className="h-4 w-[1px] bg-gray-300 mx-0.5 shrink-0"></div>

                    <button
                        onClick={() =>
                            setShowEmergencyModal(
                                true
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🚨 緊急
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'recommend'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        ✨ おすすめ
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'exchange'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        💴 両替
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'squall'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🌧️ 避難
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'prep'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        ✈️ 準備
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'transport'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🚆 移動
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'safety'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🛡️ 安全
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'thai_phrases'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🗣️ タイ語
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'drive'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🚗 運転
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'stomach'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🧊 衛生
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'shopping'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        🛍️ お買い物
                    </button>

                    <button
                        onClick={() =>
                            setActiveGuide(
                                'manner'
                            )
                        }
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold shadow-sm shrink-0"
                    >
                        📖 マナー
                    </button>
                </div>

                <div className="pointer-events-auto horizontal-scroll-safe flex gap-2 overflow-x-auto px-2 max-w-md mx-auto w-full">
                    {categories.map(
                        (
                            category
                        ) => (
                            <button
                                key={
                                    category
                                }
                                onClick={() =>
                                    setSelectedCategory(
                                        selectedCategory ===
                                            category
                                            ? null
                                            : category
                                    )
                                }
                                className={
                                    'whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all shrink-0 ' +
                                    (
                                        selectedCategory ===
                                        category
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/95 backdrop-blur-md text-gray-700 hover:bg-white'
                                    )
                                }
                            >
                                {
                                    category
                                }
                            </button>
                        )
                    )}
                </div>

                {showDropdown && (
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl max-w-md mx-auto w-full max-h-72 overflow-y-auto p-2 flex flex-col gap-1 box-border">
                        {filteredLandmarks.map(
                            (
                                landmark
                            ) => {
                                const coordinates =
                                    extractCoordinates(
                                        landmark
                                    );

                                if (
                                    !coordinates
                                ) {
                                    return null;
                                }

                                const {
                                    lat,
                                    lng,
                                } =
                                    coordinates;

                                return (
                                    <div
                                        key={
                                            'landmark-' +
                                            (
                                                landmark.id ||
                                                landmark.name
                                            )
                                        }
                                        onClick={() =>
                                            handleSelectLandmark(
                                                landmark
                                            )
                                        }
                                        className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-xl flex justify-between items-center transition-colors border-b border-gray-100 last:border-none cursor-pointer group"
                                    >
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="text-sm font-bold text-gray-800 truncate">
                                                {
                                                    landmark.name
                                                }
                                            </p>

                                            <p className="text-[10px] text-gray-500">
                                                {
                                                    landmark.category
                                                }
                                            </p>
                                        </div>

                                        <button
                                            onClick={(
                                                e
                                            ) =>
                                                handleAddToPlan(
                                                    landmark.name ||
                                                        'スポット',
                                                    landmark.category ||
                                                        'スポット',
                                                    lat,
                                                    lng,
                                                    e
                                                )
                                            }
                                            className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0"
                                        >
                                            + プラン
                                        </button>
                                    </div>
                                );
                            }
                        )}

                        {filteredStations.map(
                            (
                                station
                            ) => {
                                const coordinates =
                                    extractCoordinates(
                                        station
                                    );

                                if (
                                    !coordinates
                                ) {
                                    return null;
                                }

                                const {
                                    lat,
                                    lng,
                                } =
                                    coordinates;

                                const stationStatus =
                                    station as CoordinateCandidate;

                                const isBoat =
                                    station.line ===
                                    'Boat';

                                const serviceStatus =
                                    stationStatus.serviceStatus;

                                const serviceNote =
                                    stationStatus.serviceNote;

                                return (
                                    <div
                                        key={
                                            'station-' +
                                            station.line +
                                            '-' +
                                            (
                                                station.stationCode || station.name
                                            )
                                        }
                                        onClick={() =>
                                            handleSelectStation(
                                                station
                                            )
                                        }
                                        className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-xl flex justify-between items-center transition-colors border-b border-gray-100 last:border-none cursor-pointer group"
                                    >
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="text-sm font-bold text-gray-800 truncate">
                                                {
                                                    station.nameJa ??
                                                    station.nameEn ??
                                                    station.name
                                                }
                                            </p>

                                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                                <p className="text-[10px] text-gray-500">
                                                    {
                                                        station.line
                                                    }
                                                </p>

                                                {isBoat &&
                                                    serviceStatus ===
                                                        'limited' && (
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                                            ⚠️ 利用制限あり
                                                        </span>
                                                    )}

                                                {isBoat &&
                                                    serviceStatus ===
                                                        'inactive' && (
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300">
                                                            通常便では利用不可
                                                        </span>
                                                    )}
                                            </div>

                                            {isBoat &&
                                                serviceStatus !==
                                                    'active' &&
                                                serviceNote && (
                                                    <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                                                        {
                                                            serviceNote
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        <button
                                            onClick={(
                                                e
                                            ) =>
                                                handleAddToPlan(
                                                    (
                                                        station.name ||
                                                        '駅'
                                                    ) +
                                                        ' (' +
                                                        (
                                                            station.line ||
                                                            ''
                                                        ) +
                                                        ')',
                                                    station.line ||
                                                        '駅',
                                                    lat,
                                                    lng,
                                                    e
                                                )
                                            }
                                            className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0"
                                        >
                                            + プラン
                                        </button>
                                    </div>
                                );
                            }
                        )}

                        {visiblePlacesLoading && (
                            <div className="p-2 text-center text-xs text-blue-600 font-bold">
                                Googleマップからスポットを検索中...
                            </div>
                        )}

                        {!visiblePlacesLoading &&
                            visibleGooglePlaces.map(
                                (
                                    place
                                ) => {
                                    const coordinates =
                                        extractCoordinates(
                                            place
                                        );

                                    if (
                                        !coordinates
                                    ) {
                                        return null;
                                    }

                                    const {
                                        lat,
                                        lng,
                                    } =
                                        coordinates;

                                    return (
                                        <div
                                            key={
                                                'place-' +
                                                place.id
                                            }
                                            onClick={() =>
                                                handleSelectLandmark(
                                                    place
                                                )
                                            }
                                            className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 rounded-xl flex justify-between items-center transition-colors border-b border-gray-100 last:border-none cursor-pointer group bg-emerald-50/40"
                                        >
                                            <div className="min-w-0 flex-1 pr-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                                        Google
                                                    </span>

                                                    <p className="text-sm font-bold text-gray-800 truncate">
                                                        {
                                                            place.name
                                                        }
                                                    </p>
                                                </div>

                                                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                                    {
                                                        place.address
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                onClick={(
                                                    e
                                                ) =>
                                                    handleAddToPlan(
                                                        place.name,
                                                        'Googleスポット',
                                                        lat,
                                                        lng,
                                                        e
                                                    )
                                                }
                                                className="bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0"
                                            >
                                                + プラン
                                            </button>
                                        </div>
                                    );
                                }
                            )}

                        {agodaLoading &&
                            isHotelAllowed && (
                                <div className="p-3 text-center text-xs text-gray-500">
                                    ホテル情報を取得中...
                                </div>
                            )}

                        {!agodaLoading &&
                            filteredHotels.map(
                                (
                                    hotel: HotelDisplayItem,
                                    index: number
                                ) => {
                                    const coordinates =
                                        extractCoordinates(
                                            hotel
                                        );

                                    if (
                                        !coordinates
                                    ) {
                                        return null;
                                    }

                                    const {
                                        lat,
                                        lng,
                                    } =
                                        coordinates;

                                    const id =
                                        hotel.hotelId ||
                                        hotel.id ||
                                        index;

                                    const name =
                                        hotel.hotelName ||
                                        hotel.name ||
                                        'バンコクのホテル';

                                    const rawImage = getSecureHotelImageUrl(
                                        hotel.imageURL || hotel.imageUrl || '',
                                    );

                                    const hasHotelImage =
                                        Boolean(
                                            rawImage
                                        ) &&
                                        !rawImage.includes(
                                            'via.placeholder.com'
                                        );

                                    const hasPrice =
                                        hotel.dailyRate !=
                                            null ||
                                        hotel.price !=
                                            null;

                                    const price =
                                        hotel.dailyRate ??
                                        hotel.price ??
                                        null;

                                    const currency =
                                        hotel.currency ||
                                        'JPY';

                                    const star =
                                        hotel.star ??
                                        hotel.starRating ??
                                        hotel.stars ??
                                        null;

                                    const score =
                                        hotel.reviewScore ??
                                        null;

                                    const discount =
                                        hotel.discountPercentage ??
                                        0;

                                    return (
                                        <div
                                            key={
                                                'agoda-' +
                                                id
                                            }
                                            onClick={() =>
                                                handleSelectHotel(
                                                    hotel
                                                )
                                            }
                                            className="w-full text-left p-3 hover:bg-blue-50 rounded-xl flex items-center justify-between transition-colors border-b border-gray-100 last:border-none group bg-white shadow-sm cursor-pointer gap-3 box-border"
                                        >
                                            <div className="flex gap-3 items-center min-w-0 flex-1">
                                                <div className="shrink-0 relative">
                                                    {hasHotelImage ? (
                                                        <Image
                                                            src={rawImage}
                                                            alt={name}
                                                            width={56}
                                                            height={56}
                                                            unoptimized
                                                            className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-14 h-14 rounded-lg bg-slate-100 border border-gray-200 shadow-sm flex items-center justify-center"
                                                            aria-label="ホテル画像なし"
                                                        >
                                                            <span
                                                                className="text-2xl"
                                                                aria-hidden="true"
                                                            >
                                                                🏨
                                                            </span>
                                                        </div>
                                                    )}

                                                    {Number(
                                                        discount
                                                    ) >
                                                        0 && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                            {
                                                                discount
                                                            }
                                                            % OFF
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">
                                                        {
                                                            name
                                                        }
                                                    </p>

                                                    <div className="flex items-center gap-1 my-0.5">
                                                        {star !=
                                                            null && (
                                                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold shrink-0">
                                                                {'★'.repeat(
                                                                    Math.max(
                                                                        0,
                                                                        Math.floor(
                                                                            Number(
                                                                                star
                                                                            )
                                                                        )
                                                                    )
                                                                )}
                                                            </span>
                                                        )}

                                                        {score !=
                                                            null && (
                                                            <span className="text-[10px] text-gray-500">
                                                                (
                                                                {
                                                                    score
                                                                }
                                                                /10)
                                                            </span>
                                                        )}
                                                    </div>

                                                    {hasPrice ? (
                                                        <p className="text-[11px] font-bold text-red-600">
                                                            {
                                                                currency
                                                            }{' '}
                                                            {Number(
                                                                price
                                                            ).toLocaleString()}
                                                            〜
                                                        </p>
                                                    ) : (
                                                        <p className="text-[11px] text-gray-400">
                                                            料金情報なし
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5 shrink-0">
                                                <button
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        handleAddToPlan(
                                                            name,
                                                            'ホテル',
                                                            lat,
                                                            lng,
                                                            e
                                                        )
                                                    }
                                                    className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                                                >
                                                    + プラン
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                        {filteredLandmarks.length ===
                            0 &&
                            filteredStations.length ===
                                0 &&
                            filteredHotels.length ===
                                0 &&
                            visibleGooglePlaces.length ===
                                0 &&
                            !agodaLoading &&
                            !visiblePlacesLoading && (
                                <div className="p-4 text-center text-xs text-gray-500">
                                    該当するスポットやホテルが見つかりませんでした
                                </div>
                            )}
                    </div>
                )}
            </div>

            {!showDetailSheet && (
                <div className="absolute bottom-20 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                    <div className="max-w-md w-full flex flex-col gap-2 pointer-events-auto">
                        <BoatServiceNotice
                            latitude={destinationCoordinate.lat}
                            longitude={destinationCoordinate.lng}
                        />
                    <button
                        onClick={() =>
                            setShowDetailSheet(
                                true
                            )
                        }
                        className="pointer-events-auto bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold text-gray-800 hover:bg-white transition-all max-w-md w-full justify-center"
                    >
                        <span>
                            📍
                        </span>

                        <span className="truncate">
                            {
                                destinationTitle
                            }{' '}
                            の詳細 ＆ アクセス相場
                        </span>

                        <span className="text-blue-600 shrink-0">
                            ▲
                        </span>
                    </button>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl flex gap-1.5 max-w-md w-full box-border">
                    {[
                        {
                            mode: 'transit',
                            label: '公共機関',
                            icon: '🚆',
                        },
                        {
                            mode: 'walking',
                            label: '徒歩',
                            icon: '🚶',
                        },
                        {
                            mode: 'driving',
                            label: '車',
                            icon: '🚗',
                        },
                        {
                            mode: 'taxi',
                            label: 'タクシー',
                            icon: '🚕',
                        },
                    ].map(
                        (m) => (
                            <button
                                key={
                                    m.mode
                                }
                                onClick={() =>
                                    setSelectedMode(
                                        m.mode
                                    )
                                }
                                className={
                                    'flex-1 flex flex-col items-center py-1.5 rounded-xl text-[11px] font-semibold transition-all ' +
                                    (
                                        selectedMode ===
                                        m.mode
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    )
                                }
                            >
                                <span className="text-sm">
                                    {
                                        m.icon
                                    }
                                </span>

                                <span className="truncate">
                                    {
                                        m.label
                                    }
                                </span>
                            </button>
                        )
                    )}
                </div>
            </div>

            <TravelPlanDrawer
                isOpen={
                    showTravelPlanDrawer
                }
                onClose={() =>
                    setShowTravelPlanDrawer(
                        false
                    )
                }
                items={
                    itineraryItems
                }
                onRemoveItem={
                    handleRemoveFromPlan
                }
                onSelectDestination={(
                    title,
                    lat,
                    lng
                ) => {
                    setDestinationCoordinate(
                        {
                            lat,
                            lng,
                        }
                    );

                    setDestinationTitle(
                        title
                    );

                    setIsDemoMode(
                        false
                    );

                    updateUrlParams(
                        title,
                        lat,
                        lng
                    );
                    const notice = getBoatServiceNotice(lat, lng);
                    if (notice) showToast(`⚠️ ${notice.label}`);
                }}
            />

            <EmergencyModal
                isOpen={
                    showEmergencyModal
                }
                onClose={() =>
                    setShowEmergencyModal(
                        false
                    )
                }
                onSelectLocation={(
                    title,
                    lat,
                    lng
                ) => {
                    setDestinationCoordinate(
                        {
                            lat,
                            lng,
                        }
                    );

                    setDestinationTitle(
                        title
                    );

                    setIsDemoMode(
                        false
                    );

                    updateUrlParams(
                        title,
                        lat,
                        lng
                    );

                    showToast(
                        '📍 「' +
                            title +
                            '」を目的地に設定しました'
                    );
                }}
            />

            {showDetailSheet && (
                <DetailSheet
                    destinationAddress={destinationAddress}
                    onRetryAddress={retryAddress}
                    title={
                        destinationTitle
                    }
                    distanceKm={calculateDistanceKm(
                        userLocation,
                        destinationCoordinate
                    )}
                    agodaHotelId={
                        selectedAgodaHotel?.title === destinationTitle
                            ? selectedAgodaHotel.hotelId
                            : undefined
                    }
                    onClose={() =>
                        setShowDetailSheet(
                            false
                        )
                    }
                    onOpenThaiCard={() =>
                        setShowThaiCard(
                            true
                        )
                    }
                />
            )}

            {showThaiCard && (
                <ThaiDriverCardModal
                    key={`${destinationCoordinate.lat},${destinationCoordinate.lng}`}
                    destinationAddress={destinationAddress}
                    onRetryAddress={retryAddress}
                    destinationTitle={
                        destinationTitle
                    }
                    onClose={() =>
                        setShowThaiCard(
                            false
                        )
                    }
                />
            )}

            <GuideModal
                type={
                    activeGuide
                }
                onClose={() =>
                    setActiveGuide(
                        null
                    )
                }
                onSelectExchangeShop={
                    handleSelectExchangeShop
                }
                onSelectRecommendedSpot={
                    handleSelectRecommendedSpot
                }
                currentLocation={
                    userLocation
                }
            />
        </main>
    );
}

export default function Home() {
    return (
        <Suspense
            fallback={
                <div className="w-screen h-[100dvh] flex items-center justify-center bg-gray-100 text-gray-600">
                    読み込み中...
                </div>
            }
        >
            <MainContent />
        </Suspense>
    );
}