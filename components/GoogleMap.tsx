// components/GoogleMap.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { allBangkokStations, Station } from '@/data/stations';

interface GoogleMapProps {
    destinationCoordinate: { lat: number; lng: number };
    destinationTitle: string;
    travelMode?: string;
    onSelectArbitraryPoint?: (title: string, lat: number, lng: number) => void;
    onPlacesServiceReady?: (service: google.maps.places.PlacesService) => void;
}

// バンコク都市圏内の路線網（路線図）描画コンポーネント
function TransitLinesComponent() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const linesData = [
            {
                name: 'BTS Sukhumvit Line',
                color: '#22c55e',
                stations: [
                    "クーコット", "タイ王国空軍博物館", "インチャルーン市場", 
                    "ワット・プラ・シー・マハータート", "モーチット", "サイアム", 
                    "アソーク", "プロンポン", "トンロー", "エカマイ", 
                    "オンヌット", "バンナー", "ベーリング", "ケーケー"
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
                    "フアマーク", "バーン・タップチャーン", "ラートクラバン", 
                    "スワンナプーム空港"
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

// 選択された移動手段に応じて動的にルートを描画
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
                        setOrigin({ lat: 13.7367, lng: 100.5606 });
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
                    setPathCoordinates([]);
                }
            }
        );
    }, [map, origin, destination, travelMode]);

    useEffect(() => {
        if (!map || pathCoordinates.length === 0) return;

        const strokeColor = travelMode === 'walking' 
            ? '#059669' 
            : travelMode === 'taxi' 
            ? '#d97706' 
            : travelMode === 'driving'
            ? '#dc2626' 
            : '#2563eb'; 

        const borderPolyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: '#ffffff',
            strokeOpacity: 0.9,
            strokeWeight: 8,
            zIndex: 998,
            map: map,
        });

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

// マップインスタンスに紐づくPlacesService初期化コンポーネント
function PlacesServiceInitializer({ onReady }: { onReady: (service: google.maps.places.PlacesService) => void }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        // 公式 PlacesService のインスタンスを生成して親に渡す
        const dummyDiv = document.createElement('div');
        const service = new google.maps.places.PlacesService(map);
        onReady(service);
    }, [map, onReady]);

    return null;
}

export default function GoogleMapComponent({ destinationCoordinate, destinationTitle, travelMode = 'transit', onSelectArbitraryPoint, onPlacesServiceReady }: GoogleMapProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
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
        <APIProvider apiKey={apiKey || ''} libraries={['places']}>
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
                    {onPlacesServiceReady && <PlacesServiceInitializer onReady={onPlacesServiceReady} />}

                    <TransitLinesComponent />
                    <CustomPolylineRouteComponent destination={destinationCoordinate} travelMode={travelMode} />

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

                    {allBangkokStations
                        .filter(station => {
                            if (station.line === 'SRT') return false;
                            const name = station.name;
                            const remoteKeywords = [
                                'チェンマイ', 'コンケン', 'パタヤ', 'ホアヒン', 'カンチャナブリー', 
                                'ウボンラチャタニ', 'ノンカイ', 'ウドンタニ', 'チュムポーン', 
                                'スラートターニー', 'ハジャイ', 'ナムトック', 'クウェー川', 
                                'ピッサヌローク', 'ランパーン', 'ロッブリー', 'アユタヤ', 
                                'ナコンラチャシマ', 'チャチュンサオ', 'ナコンパトム'
                            ];
                            if (remoteKeywords.some(keyword => name.includes(keyword))) {
                                return false;
                            }
                            return true;
                        })
                        .map((station, index) => {
                            const getStationStyle = (line: string) => {
                                switch (line) {
                                    case 'BTS': return { color: '#22c55e', icon: '🚆' }; 
                                    case 'MRT': return { color: '#3b82f6', icon: '🚆' }; 
                                    case 'ARL': return { color: '#a855f7', icon: '🚆' }; 
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