// components/TravelPlanDrawer.tsx
'use client';

import React, { useState } from 'react';

export interface ItineraryItem {
    id: string;
    title: string;
    category: string;
    lat: number;
    lng: number;
}

interface TravelPlanDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: ItineraryItem[];
    onRemoveItem: (id: string) => void;
    onSelectDestination: (title: string, lat: number, lng: number) => void;
}

export default function TravelPlanDrawer({
    isOpen,
    onClose,
    items,
    onRemoveItem,
    onSelectDestination,
}: TravelPlanDrawerProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    // プランをテキストにしてクリップボードにコピー（LINE共有用）
    const handleCopyPlan = () => {
        let text = "🇹🇭 【マイ・バンコク旅行プラン】 🇹🇭\n\n";
        items.forEach((item, idx) => {
            text += `${idx + 1}. ${item.title} (${item.category})\n`;
        });
        text += "\n📍 Bkk Navi で作成";

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end pointer-events-auto">
            <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 animate-slide-left">
                {/* ヘッダー */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📋</span>
                        <h2 className="font-bold text-gray-800 text-base">マイ旅行プラン（行程表）</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2 py-1"
                    >
                        ✕
                    </button>
                </div>

                {/* アクションボタン（テキスト共有） */}
                {items.length > 0 && (
                    <button
                        onClick={handleCopyPlan}
                        className="mb-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <span>📤</span>
                        <span>{copied ? '✅ クリップボードにコピーしました！' : 'プランをテキストでコピー（LINE共有）'}</span>
                    </button>
                )}

                {/* リストエリア */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            <p className="text-3xl mb-2">🗺️</p>
                            <p>行きたいスポットや駅を</p>
                            <p>プランに追加してみましょう！</p>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div 
                                key={item.id}
                                className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-[10px] text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 text-xs"
                                        title="削除"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        onSelectDestination(item.title, item.lat, item.lng);
                                        onClose();
                                    }}
                                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                                >
                                    <span>📍</span> この場所をマップで表示
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* スポンサー・トラベルPR枠 */}
                <div className="border-t pt-3 mt-2 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">💡 ホテル・現地オプショナルツアー (PR)</p>
                    <a
                        href="https://www.agoda.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                        <span>🏨</span> Agodaで周辺ホテルを検索・予約
                    </a>
                </div>
            </div>
        </div>
    );
}