// app/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import GoogleMapComponent from '@/components/GoogleMap';
import DetailSheet from '@/components/DetailSheet';
import ThaiDriverCardModal from '@/components/ThaiDriverCardModal';
import GuideModal from '@/components/GuideModal';
import TravelPlanDrawer, { ItineraryItem } from '@/components/TravelPlanDrawer';
import { bangkokLandmarks } from '@/data/landmarks';
import { ExchangeShop } from '@/data/guides';
import { allBangkokStations, Station } from '@/data/stations';
import { bangkokHotels, HotelItem } from '@/data/hotels'; 
import { useAgodaHotels } from '@/hooks/useAgodaHotels'; 

function MainContent() {
    const [selectedMode, setSelectedMode] = useState<string>('transit');
    const [destinationCoordinate, setDestinationCoordinate] = useState({ lat: 13.7460, lng: 100.5347 });
    const [destinationTitle, setDestinationTitle] = useState<string>('サイアム・パラゴン (デモモード)');
    const [searchText, setSearchText] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [bkkTime, setBkkTime] = useState<string>('');
    const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
    const [showTravelPlanDrawer, setShowTravelPlanDrawer] = useState<boolean>(false);
    const [showDetailSheet, setShowDetailSheet] = useState<boolean>(false);
    const [showThaiCard, setShowThaiCard] = useState<boolean>(false);
    const [activeGuide, setActiveGuide] = useState<'exchange' | 'squall' | 'manner' | null>(null);

    const { hotels: agodaHotels, loading: agodaLoading } = useAgodaHotels();
    const categories = ["すべて", "観光・ナイトスポット", "寺院", "ショッピング", "空港"];

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2500);
    };

    const checkIsBangkokArea = (lat: number, lng: number) => {
        const bkkLat = 13.7460;
        const bkkLng = 100.5347;
        const dLat = Math.abs(lat - bkkLat) * 111;
        const dLng = Math.abs(lng - bkkLng) * 111 * Math.cos(bkkLat * (Math.PI / 180));
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);
        return distance <= 100;
    };

    const handleGetMyLocation = () => {
        if (!navigator.geolocation) {
            alert('お使いのブラウザは位置情報取得に対応していません');
            return;
        }
        showToast('現在地を取得中...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                if (checkIsBangkokArea(userLat, userLng)) {
                    setIsDemoMode(false);
                    setDestinationCoordinate({ lat: userLat, lng: userLng });
                    setDestinationTitle('あなたの現在地（GPS）');
                    updateUrlParams('あなたの現在地（GPS）', userLat, userLng);
                    showToast('📍 現在地（バンコク市内）を設定しました');
                } else {
                    setIsDemoMode(true);
                    showToast('✈️ 現在地がタイ国外（100km圏外）のためデモモードを維持します');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                showToast('⚠️ 位置情報の取得に失敗しました');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const lat = params.get('lat');
            const lng = params.get('lng');
            const title = params.get('title');

            if (lat && lng) {
                const parsedLat = parseFloat(lat);
                const parsedLng = parseFloat(lng);
                if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                    setDestinationCoordinate({ lat: parsedLat, lng: parsedLng });
                    setIsDemoMode(false);
                }
            }
            if (title) setDestinationTitle(title);

            const savedPlan = localStorage.getItem('bkk_nav_itinerary');
            if (savedPlan) {
                try {
                    const parsed = JSON.parse(savedPlan);
                    if (Array.isArray(parsed)) {
                        const validItems = parsed.filter(
                            (item): item is ItineraryItem =>
                                item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.lat === 'number' && typeof item.lng === 'number'
                        );
                        setItineraryItems(validItems);
                    } else {
                        localStorage.removeItem('bkk_nav_itinerary');
                    }
                } catch (e) {
                    localStorage.removeItem('bkk_nav_itinerary');
                }
            }
        }
    }, []);

    const saveItinerary = (items: ItineraryItem[]) => {
        setItineraryItems(items);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('bkk_nav_itinerary', JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save itinerary', e);
            }
        }
    };

    const handleAddToPlan = (title: string, category: string, lat: number, lng: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newItem: ItineraryItem = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title, category, lat, lng
        };
        saveItinerary([...itineraryItems, newItem]);
        showToast(`✨ 「${title}」をマイプランに追加しました！`);
    };

    const handleRemoveFromPlan = (id: string) => {
        saveItinerary(itineraryItems.filter(item => item.id !== id));
    };

    useEffect(() => {
        const updateBkkTime = () => {
            const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            setBkkTime(new Intl.DateTimeFormat('ja-JP', options).format(new Date()));
        };
        updateBkkTime();
        const timer = setInterval(updateBkkTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const updateUrlParams = (title: string, lat: number, lng: number) => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            params.set('title', title);
            params.set('lat', lat.toString());
            params.set('lng', lng.toString());
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    };

    const handleSelectLandmark = (landmark: typeof bangkokLandmarks[0]) => {
        const lat = landmark.coordinate.latitude;
        const lng = landmark.coordinate.longitude;
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(landmark.name);
        setSelectedCategory(null);
        setSearchText(''); 
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(landmark.name, lat, lng);
    };

    const handleSelectStation = (station: Station) => {
        const lat = station.coordinate.latitude;
        const lng = station.coordinate.longitude;
        const title = `${station.name} (${station.line})`;
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(title);
        setSelectedCategory(null);
        setSearchText(''); 
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(title, lat, lng);
    };

    const handleSelectHotel = (hotel: HotelItem) => {
        const lat = hotel.coordinate.latitude;
        const lng = hotel.coordinate.longitude;
        const title = `${hotel.name} (${hotel.area})`;
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(title);
        setSelectedCategory(null);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(title, lat, lng);
    };

    const handleSelectExchangeShop = (shop: ExchangeShop) => {
        const lat = shop.coordinate.lat;
        const lng = shop.coordinate.lng;
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(shop.name);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(shop.name, lat, lng);
    };

    const filteredLandmarks = bangkokLandmarks.filter(l => {
        const matchCategory = selectedCategory && selectedCategory !== 'すべて' ? l.category === selectedCategory : true;
        const matchSearch = searchText ? l.name.toLowerCase().includes(searchText.toLowerCase()) : true;
        return matchCategory && matchSearch;
    });

    const filteredStations = searchText ? allBangkokStations.filter(s => 
        s.name.toLowerCase().includes(searchText.toLowerCase()) || 
        s.line.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    const filteredHotels = searchText ? bangkokHotels.filter(h =>
        h.name.toLowerCase().includes(searchText.toLowerCase()) ||
        h.area.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    const showDropdown = selectedCategory !== null || searchText.trim().length > 0;

    return (
        <main className="relative w-screen h-[100dvh] block bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
                <GoogleMapComponent 
                    destinationCoordinate={destinationCoordinate}
                    destinationTitle={destinationTitle}
                    travelMode={selectedMode}
                    onSelectArbitraryPoint={(title, lat, lng) => {
                        setDestinationCoordinate({ lat, lng });
                        setDestinationTitle(title);
                        setIsDemoMode(false);
                        updateUrlParams(title, lat, lng);
                    }}
                />
            </div>

            {toastMessage && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce pointer-events-none border border-white/10 flex items-center gap-2">
                    <span className="text-emerald-400">✨</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="absolute top-0 left-0 right-0 z-10 flex flex-col p-4 gap-3 pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col gap-2 max-w-md mx-auto w-full">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                        <div className="flex items-center gap-1.5">
                            <span>🛡️</span>
                            <span>バンコクおまもりコンパス</span>
                            {isDemoMode && (
                                <span className="bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold animate-pulse flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    DEMO
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 px-2.5 py-1 rounded-lg text-[11px] text-gray-700">
                            <span>🇹🇭 BKK {bkkTime}</span>
                            <span className="text-blue-500" title="スコールに注意">🌧️ 32°C</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl flex-1">
                            <span className="text-blue-600 font-bold">🔍</span>
                            <input 
                                type="text" 
                                placeholder="駅名・スポット・ホテルを検索..." 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="bg-transparent w-full outline-none text-sm text-gray-800"
                            />
                            {searchText && (
                                <button onClick={() => setSearchText('')} className="text-gray-400 hover:text-gray-600">✕</button>
                            )}
                        </div>
                        <button 
                            onClick={handleGetMyLocation}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1 whitespace-nowrap"
                        >
                            <span>📍</span> 現在地
                        </button>
                    </div>
                </div>

                <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 px-2 no-scrollbar max-w-md mx-auto w-full items-center">
                    <button onClick={() => setShowTravelPlanDrawer(true)} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                        <span>📋</span> マイプラン ({itineraryItems.length})
                    </button>
                    <div className="h-4 w-[1px] bg-gray-300 mx-0.5"></div>
                    <button onClick={() => setActiveGuide('exchange')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-sm flex items-center gap-1">
                        <span>💴</span> 両替
                    </button>
                    <button onClick={() => setActiveGuide('squall')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold shadow-sm flex items-center gap-1">
                        <span>🌧️</span> 避難
                    </button>
                    <button onClick={() => setActiveGuide('manner')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold shadow-sm flex items-center gap-1">
                        <span>📖</span> マナー
                    </button>
                </div>

                <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 px-2 no-scrollbar max-w-md mx-auto w-full">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${
                                selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white/95 backdrop-blur-md text-gray-700 hover:bg-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {showDropdown && (
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl max-w-md mx-auto w-full max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
                        
                        {/* 既存のランドマーク・駅・ダミーホテルリスト */}
                        {[...filteredLandmarks, ...filteredStations, ...filteredHotels].map((item, idx) => (
                            <div key={`local-${idx}`} onClick={() => {
                                // @ts-ignore (統合処理用の簡易分岐)
                                const lat = item.coordinate.latitude; const lng = item.coordinate.longitude;
                                // @ts-ignore
                                const title = item.name;
                                setDestinationCoordinate({ lat, lng }); setDestinationTitle(title);
                                setSelectedCategory(null); setSearchText(''); setShowDetailSheet(false); setIsDemoMode(false);
                            }} className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-xl flex justify-between items-center border-b border-gray-100 cursor-pointer">
                                <div>
                                    {/* @ts-ignore */}
                                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                    {/* @ts-ignore */}
                                    <p className="text-[10px] text-gray-500">{item.category || item.line || item.area}</p>
                                </div>
                            </div>
                        ))}

                        {/* ★ Agoda API連携の動的ホテルカード */}
                        {agodaLoading && (
                            <div className="p-3 text-center text-xs text-gray-500">Agodaの最新ホテル情報を取得中...</div>
                        )}

                        {/* データ取得成功時に見出しを表示（デバッグ兼任） */}
                        {!agodaLoading && agodaHotels && agodaHotels.length > 0 && (
                            <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-blue-600 border-t border-gray-200 mt-2">
                                👇 Agodaリアルタイム価格 ({agodaHotels.length}件ヒット)
                            </div>
                        )}

                        {agodaHotels && agodaHotels
                            // ★修正ポイント: 日本語検索で除外されないよう、一旦フィルターを外してそのまま5件表示させます！
                            .slice(0, 5)
                            .map((hotel, idx) => (
                            <div
                                key={`agoda-${hotel.hotelId || idx}`}
                                className="w-full text-left p-3 hover:bg-blue-50 rounded-xl flex flex-col gap-2 transition-colors border-b border-gray-100 last:border-none group bg-blue-50/30"
                            >
                                <div className="flex gap-3 items-start">
                                    {/* 画像プロパティの揺れに対応 */}
                                    <a href={hotel.landingURL || '#'} target="_blank" rel="noopener noreferrer" className="shrink-0 relative">
                                        <img 
                                            src={hotel.imageURL || hotel.imageUrl || hotel.pictureUrl || 'https://via.placeholder.com/100?text=No+Image'} 
                                            alt={hotel.hotelName || 'ホテル'} 
                                            className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200" 
                                        />
                                        {hotel.discountPercentage > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                {hotel.discountPercentage}% OFF
                                            </span>
                                        )}
                                    </a>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">
                                                {hotel.hotelName || 'ホテル名未取得'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold whitespace-nowrap">
                                                {'★'.repeat(Math.floor(hotel.starRating || hotel.star || 0))}
                                            </span>
                                            {(hotel.reviewScore || hotel.rating) && (
                                                <span className="text-[10px] text-gray-500">
                                                    ({hotel.reviewScore || hotel.rating}/10)
                                                </span>
                                            )}
                                        </div>
                                        {/* 価格プロパティの揺れに対応 */}
                                        <p className="text-[12px] font-bold text-red-600">
                                            {hotel.currency || 'JPY'} {hotel.dailyRate ? hotel.dailyRate.toLocaleString() : (hotel.rate ? hotel.rate.toLocaleString() : '価格確認')}〜
                                            {hotel.discountPercentage > 0 && hotel.crossedOutRate && (
                                                <span className="text-[10px] text-gray-400 line-through ml-1.5 font-normal">
                                                    {hotel.crossedOutRate.toLocaleString()}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                
                                <a
                                    href={hotel.landingURL || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-1"
                                >
                                    <span>🏨</span> Agodaで詳細を見る・予約する (公式価格・PR)
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!showDetailSheet && (
                <div className="absolute bottom-20 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                    <button
                        onClick={() => setShowDetailSheet(true)}
                        className="pointer-events-auto bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold text-gray-800 hover:bg-white transition-all"
                    >
                        <span>📍</span>
                        <span>{destinationTitle} の詳細 ＆ アクセス相場を見る</span>
                        <span className="text-blue-600">▲</span>
                    </button>
                </div>
            )}

            <div className="absolute bottom-4 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl flex gap-2 max-w-md w-full">
                    {[
                        { mode: 'transit', label: '公共機関', icon: '🚆' },
                        { mode: 'walking', label: '徒歩', icon: '🚶' },
                        { mode: 'driving', label: '車', icon: '🚗' },
                        { mode: 'taxi', label: 'タクシー', icon: '🚕' },
                    ].map((m) => (
                        <button
                            key={m.mode}
                            onClick={() => setSelectedMode(m.mode)}
                            className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all ${
                                selectedMode === m.mode ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-sm">{m.icon}</span>
                            <span>{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <TravelPlanDrawer isOpen={showTravelPlanDrawer} onClose={() => setShowTravelPlanDrawer(false)} items={itineraryItems} onRemoveItem={handleRemoveFromPlan} onSelectDestination={(title, lat, lng) => { setDestinationCoordinate({ lat, lng }); setDestinationTitle(title); setIsDemoMode(false); updateUrlParams(title, lat, lng); }} />
            {showDetailSheet && <DetailSheet title={destinationTitle} distanceKm={3.5} onClose={() => setShowDetailSheet(false)} onOpenThaiCard={() => setShowThaiCard(true)} />}
            {showThaiCard && <ThaiDriverCardModal destinationTitle={destinationTitle} onClose={() => setShowThaiCard(false)} />}
            <GuideModal type={activeGuide} onClose={() => setActiveGuide(null)} onSelectExchangeShop={handleSelectExchangeShop} />
        </main>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="w-screen h-[100dvh] flex items-center justify-center bg-gray-100 text-gray-600">読み込み中...</div>}>
            <MainContent />
        </Suspense>
    );
}