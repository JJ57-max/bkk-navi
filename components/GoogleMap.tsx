// components/GoogleMap.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { allBangkokStations, Station } from '@/data/stations';

interface GoogleMapProps {
    destinationCoordinate: { lat: number; lng: number };
    destinationTitle: string;
    travelMode?: string; // 追加：移動手段
    onSelectArbitraryPoint?: (title: string, lat: number, lng: number) => void;
}

// 各路線の駅間を路線カラーの線で繋ぐ「路線網（路線図）描画コンポーネント」
function TransitLinesComponent() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const linesData = [
            {
                name: 'BTS Sukhumvit Line',
                color: '#22c55e',
                stations: [
                    "クーコット", "モーチット", "サイアム", "アソーク", 
                    "プロンポン", "トンロー", "エカマイ", "オンヌット", 
                    "バンナー", "ベーリング", "ケーケー"
                ]
            },
            {
                name: 'BTS Silom Line',
                color: '#10b981',
                stations: [
                    "ナショナルスタジアム", "サイアム", "ラチャダムリ", 
                    "サラデーン", "チョンノンシー", "サパーンタクシン", 
                    "クルントンブリー", "ウォンワヤン", "タートル", "バンワー"
                ]
            },
            {
                name: 'MRT Blue Line',
                color: '#3b82f6',
                stations: [
                    "チャトゥチャック公園", "ラマ9世", "スクンビット", 
                    "シーロム", "フワランポーン (地下鉄)", "サンパウ", 
                    "サナムチャイ", "チャラン13"
                ]
            },
            {
                name: 'ARL (Airport Rail Link)',
                color: '#a855f7',
                stations: [
                    "パヤタイ (ARL)", "マッカサン", "ラムカムヘン", 
                    "フアマーク", "スワンナプーム空港"
                ]
            },
            {
                name: 'SRT Northern Line (チェンマイ方面)',
                color: '#ef4444',
                stations: [
                    "クルンテピワット中央駅 (バンスー)", "アユタヤ駅", 
                    "ロッブリー駅", "ピッサヌローク駅", "ランパーン駅", "チェンマイ駅"
                ]
            },
            {
                name: 'SRT Northeastern Line (東北方面)',
                color: '#f59e0b',
                stations: [
                    "クルンテピワット中央駅 (バンスー)", "チャチュンサオ駅", 
                    "パクチョン駅 (カオヤイ近郊)", "ナコンラチャシマ駅 (コラート)", 
                    "コンケン駅", "ウドンタニ駅", "ノンカイ駅 (ラオス国境)", "ウボンラチャタニ駅"
                ]
            },
            {
                name: 'SRT Eastern Line (パタヤ方面)',
                color: '#06b6d4',
                stations: [
                    "フワランポーン駅 (国鉄旧中央駅)", "チャチュンサオ駅", 
                    "チョンブリー駅", "シラチャ駅", "パタヤ駅", "パタヤใต้ (南パタヤ/プール・ター・ルアン)"
                ]
            },
            {
                name: 'SRT Kanchanaburi Line (泰緬鉄道ルート)',
                color: '#84cc16',
                stations: [
                    "トンブリー駅 (西方路線起点)", "ナコンパトム駅", 
                    "カンチャナブリー駅", "クウェー川橋駅", "ナムトック駅 (終点/滝)"
                ]
            },
            {
                name: 'SRT Southern Line (ホアヒン・南部方面)',
                color: '#8b5cf6',
                stations: [
                    "フワランポーン駅 (国鉄旧中央駅)", "ナコンパトム駅", 
                    "ホアヒン駅", "チュムポーン駅", 
                    "スラートターニー駅 (サムイ島玄関口)", "ハジャイ駅"
                ]
            }
        ];

        const polylines: google.maps.Polyline[] = [];

        linesData.forEach((line) => {
            const path: google.maps.LatLngLiteral[] = [];
            line.stations.forEach((stationName) => {
                const found = allBangkokStations.find(s => s.name === stationName);
                if (found) {
                    path.push({
                        lat: found.coordinate.latitude,
                        lng: found.coordinate.longitude
                    });
                }
            });

            if (path.length >= 2) {
                const polyline = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: line.color,
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    map: map,
                });
                polylines.push(polyline);
            }
        });

        return () => {
            polylines.forEach(p => p.setMap(null));
        };
    }, [map]);

    return null;
}

// 選択された移動手段に応じて動的にルートを描画（白抜き縁取りの2重線で視認性を劇的に向上）
function CustomPolylineRouteComponent({ destination, travelMode }: { destination: { lat: number; lng: number }, travelMode: string }) {
    const map = useMap();
    const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
    const [pathCoordinates, setPathCoordinates] = useState<google.maps.LatLngLiteral[]>([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    if (lat > 20) {
                        setOrigin({ lat: 13.7367, lng: 100.5606 }); // アソーク周辺
                    } else {
                        setOrigin({ lat, lng });
                    }
                },
                () => setOrigin({ lat: 13.7367, lng: 100.5606 }),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setOrigin({ lat: 13.7367, lng: 100.5606 });
        }
    }, []);

    useEffect(() => {
        if (!map || !origin) return;
        const directionsService = new google.maps.DirectionsService();

        let googleTravelMode = google.maps.TravelMode.TRANSIT;
        if (travelMode === 'walking') {
            googleTravelMode = google.maps.TravelMode.WALKING;
        } else if (travelMode === 'driving' || travelMode === 'taxi') {
            googleTravelMode = google.maps.TravelMode.DRIVING;
        } else if (travelMode === 'transit') {
            googleTravelMode = google.maps.TravelMode.TRANSIT;
        }

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: googleTravelMode,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result && result.routes[0]) {
                    const points = result.routes[0].overview_path.map((p) => ({
                        lat: p.lat(),
                        lng: p.lng(),
                    }));
                    setPathCoordinates(points);
                } else {
                    setPathCoordinates([origin, destination]);
                }
            }
        );
    }, [map, origin, destination, travelMode]);

    useEffect(() => {
        if (!map || pathCoordinates.length === 0) return;

        // モードごとのメインカラー設定
        const strokeColor = travelMode === 'walking' 
            ? '#059669' // 徒歩：濃いエメラルド緑
            : travelMode === 'taxi' 
            ? '#d97706' // タクシー：濃いオレンジ
            : travelMode === 'driving'
            ? '#dc2626' // 車：赤
            : '#2563eb'; // 公共交通機関：鮮やかな青

        // 1. 下敷きとなる太めの白いボーダー（縁取り）ライン
        const borderPolyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: '#ffffff',
            strokeOpacity: 0.9,
            strokeWeight: 8, // メインより太くする
            zIndex: 998,
            map: map,
        });

        // 2. その上を走るメインカラーのライン
        const mainPolyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: strokeColor,
            strokeOpacity: 1.0,
            strokeWeight: 5,
            zIndex: 999,
            map: map,
        });

        return () => {
            borderPolyline.setMap(null);
            mainPolyline.setMap(null);
        };
    }, [map, pathCoordinates, travelMode]);

    return null;
}

export default function GoogleMapComponent({ destinationCoordinate, destinationTitle, travelMode = 'transit', onSelectArbitraryPoint }: GoogleMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCywzT_-wuzKVhv0PcgvxK06XFK5On3yh0";
    const [activeStation, setActiveStation] = useState<Station | null>(null);
    const [isDestinationOpen, setIsDestinationOpen] = useState<boolean>(false);

    const OFFSET = 0.00015;

    const handleMapClick = (e: MapMouseEvent) => {
        setActiveStation(null);
        setIsDestinationOpen(false);

        if (e.detail && e.detail.latLng && onSelectArbitraryPoint) {
            const lat = e.detail.latLng.lat;
            const lng = e.detail.latLng.lng;
            const customTitle = `指定地点 (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            onSelectArbitraryPoint(customTitle, lat, lng);
        }
    };

    return (
        <APIProvider apiKey={apiKey}>
            <div className="w-full h-full relative">
                <Map
                    defaultCenter={{ lat: destinationCoordinate.lat, lng: destinationCoordinate.lng }}
                    defaultZoom={13.5}
                    mapId="bkk_navi_map_id"
                    gestureHandling={'greedy'} 
                    zoomControl={true}
                    fullscreenControl={false}
                    streetViewControl={false}
                    scaleControl={true}
                    onClick={handleMapClick}
                >
                    {/* 各路線の駅間を繋ぐ路線網ライン */}
                    <TransitLinesComponent />

                    {/* 目的地へのルート（白抜き縁取り付き・移動モード連動） */}
                    <CustomPolylineRouteComponent destination={destinationCoordinate} travelMode={travelMode} />

                    {/* 目的地ピン */}
                    <AdvancedMarker 
                        position={{ lat: destinationCoordinate.lat, lng: destinationCoordinate.lng }}
                        onClick={() => setIsDestinationOpen(!isDestinationOpen)}
                    >
                        <div className="flex flex-col items-center relative p-2 cursor-pointer">
                            <div className="bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-base animate-bounce">
                                📍
                            </div>
                            {isDestinationOpen && (
                                <div className="absolute top-full mt-1 px-2.5 py-1 rounded bg-white border border-red-200 shadow-xl whitespace-nowrap z-50">
                                    <span className="text-xs font-bold text-gray-900">{destinationTitle}</span>
                                </div>
                            )}
                        </div>
                    </AdvancedMarker>

                    {/* 全駅・船・バスピン */}
                    {allBangkokStations.map((station, index) => {
                        const getStationStyle = (line: string) => {
                            switch (line) {
                                case 'BTS': return { color: '#22c55e', icon: '🚆' }; 
                                case 'MRT': return { color: '#3b82f6', icon: '🚆' }; 
                                case 'ARL': return { color: '#a855f7', icon: '🚆' }; 
                                case 'SRT': return { color: '#78716c', icon: '🚆' }; 
                                case 'Boat': return { color: '#06b6d4', icon: '🚢' }; 
                                case 'Bus': return { color: '#f59e0b', icon: '🚌' }; 
                                default: return { color: '#f97316', icon: '📍' };    
                            }
                        };

                        const style = getStationStyle(station.line);
                        const isSelected = activeStation?.name === station.name && activeStation?.line === station.line;
                        const adjustedLat = station.coordinate.latitude + OFFSET;
                        const adjustedLng = station.coordinate.longitude + OFFSET;

                        return (
                            <AdvancedMarker 
                                key={index} 
                                position={{ lat: adjustedLat, lng: adjustedLng }}
                                onClick={() => {
                                    setActiveStation(station);
                                    setIsDestinationOpen(false);
                                }}
                            >
                                <div 
                                    className="flex flex-col items-center relative p-2 cursor-pointer"
                                    style={{ zIndex: isSelected ? 100 : 10 }}
                                >
                                    <div 
                                        style={{ backgroundColor: style.color }}
                                        className={`text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all duration-200 ${
                                            isSelected ? 'w-9 h-9 text-sm scale-110 shadow-lg' : 'w-7 h-7 text-xs'
                                        }`}
                                    >
                                        {style.icon}
                                    </div>
                                    
                                    {isSelected && (
                                        <div className="absolute top-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-gray-300 shadow-2xl whitespace-nowrap z-50">
                                            <span className="text-xs font-extrabold text-gray-900">
                                                {station.name} ({station.line})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </AdvancedMarker>
                        );
                    })}
                </Map>
            </div>
        </APIProvider>
    );
}