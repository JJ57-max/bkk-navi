// app/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import GoogleMapComponent from '@/components/GoogleMap';
import DetailSheet from '@/components/DetailSheet';
import ThaiDriverCardModal from '@/components/ThaiDriverCardModal';
import GuideModal from '@/components/GuideModal';
import EmergencyModal from '@/components/EmergencyModal';
import TravelPlanDrawer, { ItineraryItem } from '@/components/TravelPlanDrawer';
import { bangkokLandmarks } from '@/data/landmarks';
import { ExchangeShop } from '@/data/guides';
import { RecommendedSpot } from '@/data/recommendations';
import { allBangkokStations, Station } from '@/data/stations';

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
    
    // 【修正】activeGuide の型に 'shopping' を追加
    const [activeGuide, setActiveGuide] = useState<'exchange' | 'squall' | 'prep' | 'manner' | 'recommend' | 'transport' | 'safety' | 'thai_phrases' | 'drive' | 'stomach' | 'shopping' | null>(null);
    
    const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

    const [agodaHotels, setAgodaHotels] = useState<any[]>([]);
    const [agodaLoading, setAgodaLoading] = useState<boolean>(true);

    const [googlePlaces, setGooglePlaces] = useState<any[]>([]);
    const [placesLoading, setPlacesLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAgodaHotelsDirectly = async () => {
            try {
                setAgodaLoading(true);
                const res = await fetch('/api/hotels');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                const hotelList = Array.isArray(data) ? data : (data.results || data.hotelList || data.data || []);
                setAgodaHotels(hotelList);
            } catch (err) {
                console.error('Direct Agoda Fetch Error:', err);
                setAgodaHotels([]);
            } finally {
                setAgodaLoading(false);
            }
        };
        fetchAgodaHotelsDirectly();
    }, []);

    useEffect(() => {
        if (!searchText || searchText.trim().length < 2) {
            setGooglePlaces([]);
            setPlacesLoading(false);
            return;
        }

        const timer = setTimeout(() => {
            if (typeof window === 'undefined' || !window.google?.maps?.places) {
                console.log('Google Maps Places API not ready yet');
                return;
            }

            setPlacesLoading(true);
            const dummyMapDiv = document.createElement('div');
            const service = new google.maps.places.PlacesService(dummyMapDiv);

            const request = {
                query: `${searchText} バンコク`,
            };

            service.textSearch(request, (results, status) => {
                setPlacesLoading(false);
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const mapped = results.map((place) => ({
                        id: place.place_id || Math.random().toString(),
                        name: place.name || 'スポット',
                        address: place.formatted_address || '',
                        category: 'Googleスポット',
                        latitude: place.geometry?.location?.lat() ?? 13.7460,
                        longitude: place.geometry?.location?.lng() ?? 100.5347,
                        rating: place.rating || 4.0,
                        userRatingsTotal: place.user_ratings_total || 0,
                    }));
                    setGooglePlaces(mapped);
                } else {
                    setGooglePlaces([]);
                }
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText]);

    const categories = ["すべて", "観光・ナイトスポット", "寺院", "ショッピング", "ホテル", "空港"];

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2500);
    };

    const checkIsBangkokArea = (lat: number, lng: number) => {
        const bkkLat = 13.7460;
        const bkkLng = 100.5347;
        const dLat = Math.abs(lat - bkkLat) * 111;
        const dLng = Math.abs(lng - bkkLng) * 111 * Math.cos(bkkLat * (Math.PI / 180));
        return Math.sqrt(dLat * dLat + dLng * dLng) <= 100;
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
                    showToast('✈️ 現在地がタイ国外のためデモモードを維持します');
                }
            },
            () => showToast('⚠️ 位置情報の取得に失敗しました'),
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
                const pLat = parseFloat(lat);
                const pLng = parseFloat(lng);
                if (!isNaN(pLat) && !isNaN(pLng)) {
                    setDestinationCoordinate({ lat: pLat, lng: pLng });
                    setIsDemoMode(false);
                }
            }
            if (title) setDestinationTitle(title);

            const savedPlan = localStorage.getItem('bkk_nav_itinerary');
            if (savedPlan) {
                try {
                    const parsed = JSON.parse(savedPlan);
                    if (Array.isArray(parsed)) setItineraryItems(parsed);
                } catch (e) {
                    localStorage.removeItem('bkk_nav_itinerary');
                }
            }
        }
    }, []);

    const saveItinerary = (items: ItineraryItem[]) => {
        setItineraryItems(items);
        if (typeof window !== 'undefined') {
            localStorage.setItem('bkk_nav_itinerary', JSON.stringify(items));
        }
    };

    const handleAddToPlan = (title: string, category: string, lat: number, lng: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newItem: ItineraryItem = { id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, title, category, lat, lng };
        saveItinerary([...itineraryItems, newItem]);
        showToast(`✨ 「${title}」をマイプランに追加しました！`);
    };

    const handleRemoveFromPlan = (id: string) => {
        const updated = itineraryItems.filter(item => item.id !== id);
        saveItinerary(updated);
    };

    useEffect(() => {
        const updateBkkTime = () => {
            const now = new Date();
            setBkkTime(new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now));
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
            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        }
    };

    const extractCoordinates = (item: any) => {
        const lat = item.coordinate?.latitude ?? item.coordinate?.lat ?? item.latitude ?? item.lat ?? 13.7460;
        const lng = item.coordinate?.longitude ?? item.coordinate?.lng ?? item.longitude ?? item.lng ?? 100.5347;
        return { lat: Number(lat), lng: Number(lng) };
    };

    const handleSelectLandmark = (landmark: any) => {
        const { lat, lng } = extractCoordinates(landmark);
        const name = landmark.name || 'スポット';
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(name);
        setSelectedCategory(null);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(name, lat, lng);
        showToast(`📍 「${name}」を目的地に設定しました`);
    };

    const handleSelectStation = (station: any) => {
        const { lat, lng } = extractCoordinates(station);
        const title = `${station.name || '駅'} (${station.line || 'BTS/MRT'})`;
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(title);
        setSelectedCategory(null);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(title, lat, lng);
        showToast(`📍 「${title}」を目的地に設定しました`);
    };

    const handleSelectExchangeShop = (shop: ExchangeShop) => {
        const { lat, lng } = extractCoordinates(shop);
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(shop.name);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(shop.name, lat, lng);
        showToast(`📍 「${shop.name}」を目的地に設定しました`);
    };

    const handleSelectRecommendedSpot = (spot: RecommendedSpot) => {
        const { lat, lng } = extractCoordinates(spot);
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(spot.name);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(spot.name, lat, lng);
        showToast(`📍 「${spot.name}」を目的地に設定しました`);
    };

    const handleSelectHotel = (hotel: any) => {
        const { lat, lng } = extractCoordinates(hotel);
        const name = hotel.hotelName || hotel.name || 'バンコクのホテル';
        setDestinationCoordinate({ lat, lng });
        setDestinationTitle(name);
        setSelectedCategory(null);
        setSearchText('');
        setShowDetailSheet(false);
        setIsDemoMode(false);
        updateUrlParams(name, lat, lng);
        showToast(`📍 「${name}」を目的地に設定しました`);
    };

    const query = searchText ? searchText.toLowerCase().trim() : '';

    const isLandmarkAllowed = query.length > 0 || !selectedCategory || (selectedCategory !== 'ホテル' && (selectedCategory === 'すべて' || selectedCategory));
    
    const filteredLandmarks = isLandmarkAllowed ? (bangkokLandmarks || []).filter(l => {
        const name = (l.name || '').toLowerCase();
        const category = (l.category || '').toLowerCase();
        if (query) {
            return name.includes(query) || category.includes(query);
        }
        if (selectedCategory && selectedCategory !== 'すべて' && selectedCategory !== 'ホテル') {
            return category.includes(selectedCategory);
        }
        return true;
    }) : [];

    const filteredStations = query ? (allBangkokStations || []).filter(s => 
        (s.name || '').toLowerCase().includes(query) || (s.line || '').toLowerCase().includes(query)
    ) : [];

    const isHotelAllowed = query.length > 0 || !selectedCategory || selectedCategory === 'すべて' || selectedCategory === 'ホテル';
    const filteredHotels = isHotelAllowed ? (agodaHotels || []).filter(h => {
        const name = (h.hotelName || h.name || '').toLowerCase();
        if (query) {
            return name.includes(query) || 'ホテル'.includes(query) || 'hotel'.includes(query);
        }
        return true;
    }) : [];

    const showDropdown = selectedCategory !== null || searchText.trim().length > 0;

    return (
        <main className="relative w-screen h-[100dvh] block bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
                <GoogleMapComponent 
                    destinationCoordinate={destinationCoordinate}
                    destinationTitle={destinationTitle}
                    travelMode={selectedMode}
                    onSelectArbitraryPoint={async (title, lat, lng) => {
                        const tempTitle = `指定エリア (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
                        setDestinationCoordinate({ lat, lng });
                        setDestinationTitle(tempTitle);
                        setIsDemoMode(false);

                        try {
                            const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
                            if (res.ok) {
                                const data = await res.json();
                                let resolvedAddress = data.address || tempTitle;
                                
                                resolvedAddress = resolvedAddress
                                    .replace(/タイ王国|タイ$|タイ、|Thailand|, Thailand/g, '')
                                    .replace(/,\s*$/, '')
                                    .trim();

                                setDestinationTitle(resolvedAddress);
                                updateUrlParams(resolvedAddress, lat, lng);
                                showToast(`📍 取得した地点を設定しました`);
                            } else {
                                updateUrlParams(tempTitle, lat, lng);
                            }
                        } catch (err) {
                            console.error('Geocode fetch error:', err);
                            updateUrlParams(tempTitle, lat, lng);
                        }
                    }}
                />
            </div>

            {toastMessage && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md animate-bounce pointer-events-none border border-white/10 flex items-center gap-2">
                    <span className="text-emerald-400">✨</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="absolute top-0 left-0 right-0 z-10 flex flex-col p-3 gap-2 pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg flex flex-col gap-2 max-w-md mx-auto w-full box-border">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span>🛡️</span>
                            <span className="truncate">バンコクおまもりコンパス</span>
                            {isDemoMode && (
                                <span className="bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0">
                                    DEMO
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg text-[11px] text-gray-700 shrink-0">
                            <span>🇹🇭 {bkkTime}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl flex-1 min-w-0">
                            <span className="text-blue-600 font-bold shrink-0">🔍</span>
                            <input 
                                type="text" 
                                placeholder="スポット・駅・ホテルを自由検索..." 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="bg-transparent w-full outline-none text-sm text-gray-800 min-w-0"
                            />
                            {searchText && (
                                <button onClick={() => setSearchText('')} className="text-gray-400 hover:text-gray-600 shrink-0">✕</button>
                            )}
                        </div>
                        <button 
                            onClick={handleGetMyLocation}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shrink-0"
                        >
                            📍 現在地
                        </button>
                    </div>
                </div>

                <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 px-2 no-scrollbar max-w-md mx-auto w-full items-center">
                    <button
                        onClick={() => setShowTravelPlanDrawer(true)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
                    >
                        <span>📋</span> マイプラン ({itineraryItems.length})
                    </button>
                    <div className="h-4 w-[1px] bg-gray-300 mx-0.5 shrink-0"></div>
                    <button onClick={() => setShowEmergencyModal(true)} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-sm shrink-0">🚨 緊急</button>
                    <button onClick={() => setActiveGuide('recommend')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-sm shrink-0">✨ おすすめ</button>
                    <button onClick={() => setActiveGuide('exchange')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-sm shrink-0">💴 両替</button>
                    <button onClick={() => setActiveGuide('squall')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold shadow-sm shrink-0">🌧️ 避難</button>
                    <button onClick={() => setActiveGuide('prep')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-sm shrink-0">✈️ 準備</button>
                    <button onClick={() => setActiveGuide('transport')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-sm shrink-0">🚆 移動</button>
                    <button onClick={() => setActiveGuide('safety')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold shadow-sm shrink-0">🛡️ 安全</button>
                    <button onClick={() => setActiveGuide('thai_phrases')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold shadow-sm shrink-0">🗣️ タイ語</button>
                    <button onClick={() => setActiveGuide('drive')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold shadow-sm shrink-0">🚗 運転</button>
                    <button onClick={() => setActiveGuide('stomach')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold shadow-sm shrink-0">🧊 衛生</button>
                    {/* 【追加】お買い物・免税ガイドを開くボタン */}
                    <button onClick={() => setActiveGuide('shopping')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold shadow-sm shrink-0">🛍️ お買い物</button>
                    <button onClick={() => setActiveGuide('manner')} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold shadow-sm shrink-0">📖 マナー</button>
                </div>

                <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 px-2 no-scrollbar max-w-md mx-auto w-full">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all shrink-0 ${
                                selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white/95 backdrop-blur-md text-gray-700 hover:bg-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {showDropdown && (
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl max-w-md mx-auto w-full max-h-72 overflow-y-auto p-2 flex flex-col gap-1 box-border">
                        {filteredLandmarks.map((landmark) => {
                            const { lat, lng } = extractCoordinates(landmark);
                            return (
                                <div
                                    key={`landmark-${landmark.id || landmark.name}`}
                                    onClick={() => handleSelectLandmark(landmark)}
                                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-xl flex justify-between items-center transition-colors border-b border-gray-100 last:border-none cursor-pointer group"
                                >
                                    <div className="min-w-0 flex-1 pr-2">
                                        <p className="text-sm font-bold text-gray-800 truncate">{landmark.name}</p>
                                        <p className="text-[10px] text-gray-500">{landmark.category}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToPlan(landmark.name, landmark.category || 'スポット', lat, lng, e)}
                                        className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0"
                                    >
                                        + プラン
                                    </button>
                                </div>
                            );
                        })}
                            
                        {filteredStations.map((station, idx) => {
                            const { lat, lng } = extractCoordinates(station);
                            return (
                                <div
                                    key={`station-${idx}`}
                                    onClick={() => handleSelectStation(station)}
                                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-xl flex justify-between items-center transition-colors border-b border-gray-100 last:border-none cursor-pointer group"
                                >
                                    <div className="min-w-0 flex-1 pr-2">
                                        <p className="text-sm font-bold text-gray-800 truncate">{station.name}</p>
                                        <p className="text-[10px] text-gray-500">{station.line}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToPlan(`${station.name} (${station.line})`, station.line, lat, lng, e)}
                                        className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0"
                                    >
                                        + プラン
                                    </button>
                                </div>
                            );
                        })}

                        {placesLoading && (
                            <div className="p-2 text-center text-xs text-blue-600 font-bold">Googleマップからスポットを検索中...</div>
                        )}
                        {!placesLoading && googlePlaces.map((place) => {
                            const { lat, lng } = extractCoordinates(place);
                            return (
                                <div
                                    key={`place-${place.id}`}
                                    onClick={() => handleSelectLandmark(place)}
                                    className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 rounded-xl flex justify-between items-center transition-colors border-b border-gray-100 last:border-none cursor-pointer group bg-emerald-50/40"
                                >
                                    <div className="min-w-0 flex-1 pr-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Google</span>
                                            <p className="text-sm font-bold text-gray-800 truncate">{place.name}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{place.address}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToPlan(place.name, 'Googleスポット', lat, lng, e)}
                                        className="bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0"
                                    >
                                        + プラン
                                    </button>
                                </div>
                            );
                        })}

                        {agodaLoading && isHotelAllowed && (
                            <div className="p-3 text-center text-xs text-gray-500">ホテル情報を取得中...</div>
                        )}

                        {!agodaLoading && filteredHotels.map((hotel: any, index: number) => {
                            const id = hotel.hotelId || hotel.id || index;
                            const name = hotel.hotelName || hotel.name || 'バンコクのホテル';
                            const img = hotel.imageURL || hotel.imageUrl || 'https://via.placeholder.com/150';
                            const price = hotel.dailyRate || hotel.price || 0;
                            const currency = hotel.currency || 'JPY';
                            const star = hotel.starRating || hotel.stars || 4;
                            const score = hotel.reviewScore || 8.0;
                            const discount = hotel.discountPercentage || 0;
                            const { lat, lng } = extractCoordinates(hotel);

                            return (
                                <div
                                    key={`agoda-${id}`}
                                    onClick={() => handleSelectHotel(hotel)}
                                    className="w-full text-left p-3 hover:bg-blue-50 rounded-xl flex items-center justify-between transition-colors border-b border-gray-100 last:border-none group bg-white shadow-sm cursor-pointer gap-3 box-border"
                                >
                                    <div className="flex gap-3 items-center min-w-0 flex-1">
                                        <div className="shrink-0 relative">
                                            <img src={img} alt={name} className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200" />
                                            {discount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                    {discount}% OFF
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800 truncate">{name}</p>
                                            <div className="flex items-center gap-1 my-0.5">
                                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold shrink-0">
                                                    {'★'.repeat(Math.floor(star))}
                                                </span>
                                                <span className="text-[10px] text-gray-500">({score}/10)</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-red-600">
                                                {currency} {Number(price).toLocaleString()}〜
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5 shrink-0">
                                        <button
                                            onClick={(e) => handleAddToPlan(name, 'ホテル', lat, lng, e)}
                                            className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                                        >
                                            + プラン
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredLandmarks.length === 0 && filteredStations.length === 0 && filteredHotels.length === 0 && googlePlaces.length === 0 && !agodaLoading && !placesLoading && (
                            <div className="p-4 text-center text-xs text-gray-500">
                                該当するスポットやホテルが見つかりませんでした
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!showDetailSheet && (
                <div className="absolute bottom-20 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                    <button
                        onClick={() => setShowDetailSheet(true)}
                        className="pointer-events-auto bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold text-gray-800 hover:bg-white transition-all max-w-md w-full justify-center"
                    >
                        <span>📍</span>
                        <span className="truncate">{destinationTitle} の詳細 ＆ アクセス相場</span>
                        <span className="text-blue-600 shrink-0">▲</span>
                    </button>
                </div>
            )}

            <div className="absolute bottom-4 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl flex gap-1.5 max-w-md w-full box-border">
                    {[
                        { mode: 'transit', label: '公共機関', icon: '🚆' },
                        { mode: 'walking', label: '徒歩', icon: '🚶' },
                        { mode: 'driving', label: '車', icon: '🚗' },
                        { mode: 'taxi', label: 'タクシー', icon: '🚕' },
                    ].map((m) => (
                        <button
                            key={m.mode}
                            onClick={() => setSelectedMode(m.mode)}
                            className={`flex-1 flex flex-col items-center py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                                selectedMode === m.mode ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-sm">{m.icon}</span>
                            <span className="truncate">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <TravelPlanDrawer 
                isOpen={showTravelPlanDrawer}
                onClose={() => setShowTravelPlanDrawer(false)}
                items={itineraryItems}
                onRemoveItem={handleRemoveFromPlan}
                onSelectDestination={(title, lat, lng) => {
                    setDestinationCoordinate({ lat, lng });
                    setDestinationTitle(title);
                    setIsDemoMode(false);
                    updateUrlParams(title, lat, lng);
                }}
            />

            <EmergencyModal 
                isOpen={showEmergencyModal}
                onClose={() => setShowEmergencyModal(false)}
                onSelectLocation={(title, lat, lng) => {
                    setDestinationCoordinate({ lat, lng });
                    setDestinationTitle(title);
                    setIsDemoMode(false);
                    updateUrlParams(title, lat, lng);
                    showToast(`📍 「${title}」を目的地に設定しました`);
                }}
            />

            {showDetailSheet && (
                <DetailSheet 
                    title={destinationTitle} 
                    distanceKm={(() => {
                        const startLat = 13.7460;
                        const startLng = 100.5347;
                        const destLat = destinationCoordinate.lat;
                        const destLng = destinationCoordinate.lng;

                        const R = 6371;
                        const dLat = (destLat - startLat) * (Math.PI / 180);
                        const dLng = (destLng - startLng) * (Math.PI / 180);
                        const a = 
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(startLat * (Math.PI / 180)) * Math.cos(destLat * (Math.PI / 180)) *
                            Math.sin(dLng / 2) * Math.sin(dLng / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const distance = R * c;

                        return Math.round(distance * 10) / 10;
                    })()} 
                    onClose={() => setShowDetailSheet(false)} 
                    onOpenThaiCard={() => setShowThaiCard(true)} 
                />
            )}

            {showThaiCard && (
                <ThaiDriverCardModal destinationTitle={destinationTitle} onClose={() => setShowThaiCard(false)} />
            )}

            <GuideModal 
                type={activeGuide} 
                onClose={() => setActiveGuide(null)} 
                onSelectExchangeShop={handleSelectExchangeShop}
                onSelectRecommendedSpot={handleSelectRecommendedSpot}
                currentLocation={destinationCoordinate}
            />
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