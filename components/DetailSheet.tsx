// components/DetailSheet.tsx
'use client';

import React from 'react';

interface DetailSheetProps {
    title: string;
    distanceKm: number;
    onClose: () => void;
    onOpenThaiCard: () => void;
}

export default function DetailSheet({
    title,
    distanceKm,
    onClose,
    onOpenThaiCard,
}: DetailSheetProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 flex justify-center pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-5 flex flex-col gap-4 border border-gray-100 animate-slide-up">
                {/* ヘッダー */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mb-1">
                            <span>📍</span>
                            <span>目的地ガイド ＆ 予約サポート</span>
                        </div>
                        <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* 相場・基本情報 */}
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                    <div>
                        <span className="text-gray-400 block text-[10px]">推定直線距離</span>
                        <span className="font-bold text-gray-800 text-sm">約 {distanceKm} km</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-[10px]">移動の目安</span>
                        <span className="font-bold text-emerald-600 text-sm">快適アクセス</span>
                    </div>
                </div>

                {/* タクシーカード表示ボタン（タイ語で会話するお助け機能） */}
                <button
                    onClick={onOpenThaiCard}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs transition-transform active:scale-98"
                >
                    <span className="text-base">🚕</span>
                    <span>タイ語ドライバーカードを表示（ぼったくり防止）</span>
                </button>

                {/* 収益化エリア（アフィリエイト・予約パートナー導線） */}
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">💡 現地で役立つおすすめサービス (PR)</p>
                    <div className="grid grid-cols-3 gap-2">
                        <a
                            href="https://www.agoda.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-colors"
                        >
                            <span className="text-sm">🏨</span>
                            <span className="text-[10px] font-bold">ホテル予約</span>
                            <span className="text-[8px] text-blue-500">Agoda / Booking</span>
                        </a>
                        <a
                            href="https://www.klook.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-colors"
                        >
                            <span className="text-sm">🎫</span>
                            <span className="text-[10px] font-bold">現地ツアー</span>
                            <span className="text-[8px] text-orange-500">Klook / KKday</span>
                        </a>
                        <a
                            href="https://www.klook.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-colors"
                        >
                            <span className="text-sm">📶</span>
                            <span className="text-[10px] font-bold">タイ用eSIM</span>
                            <span className="text-[8px] text-emerald-500">即時開通・格安</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}