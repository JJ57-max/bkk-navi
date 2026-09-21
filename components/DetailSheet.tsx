// components/DetailSheet.tsx
'use client';

import React, { useState } from 'react';

interface DetailSheetProps {
    title: string;
    distanceKm: number;
    onClose: () => void;
    onOpenThaiCard: () => void;
}

export default function DetailSheet({ title, distanceKm, onClose, onOpenThaiCard }: DetailSheetProps) {
    const [showHotelModal, setShowHotelModal] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopyTitle = () => {
        navigator.clipboard.writeText(title);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl p-5 flex flex-col gap-4 max-w-md mx-auto border-t border-gray-200 animate-slide-up box-border">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-blue-600 text-lg">📍</span>
                    <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">目的地ガイド ＆ 予約サポート</p>
                        <h3 className="text-base font-extrabold text-gray-900 truncate">{title}</h3>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0 transition-colors">
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
                <div>
                    <p className="text-[10px] text-gray-500 font-bold">推定直線距離</p>
                    <p className="text-sm font-extrabold text-gray-800">約 {distanceKm} km</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 font-bold">移動の目安</p>
                    <p className="text-sm font-extrabold text-emerald-600">快適アクセス</p>
                </div>
            </div>

            <button 
                onClick={onOpenThaiCard}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
                <span>🛺</span>
                <span>タイ語ドライバーカードを表示（ぼったくり防止）</span>
            </button>

            <div className="flex flex-col gap-1.5 pt-1">
                <p className="text-[10px] text-gray-400 font-bold px-1">現地で役立つおすすめサービス (PR)</p>
                <div className="grid grid-cols-3 gap-2">
                    <button 
                        onClick={() => setShowHotelModal(true)}
                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center group"
                    >
                        <span className="text-base">🏨</span>
                        <span className="text-[11px] font-bold text-blue-900 leading-tight">ホテルを検索</span>
                        <span className="text-[9px] text-blue-600 font-medium">Agoda (PR)</span>
                    </button>
                    
                    <a 
                        href="https://www.klook.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-amber-50 hover:bg-amber-100 border border-amber-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center"
                    >
                        <span className="text-base">🎫</span>
                        <span className="text-[11px] font-bold text-amber-900 leading-tight">現地ツアー</span>
                        <span className="text-[9px] text-amber-600 font-medium">Klook / KKday</span>
                    </a>

                    <a 
                        href="https://www.airalo.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center"
                    >
                        <span className="text-base">📶</span>
                        <span className="text-[11px] font-bold text-indigo-900 leading-tight">タイ用eSIM</span>
                        <span className="text-[9px] text-indigo-600 font-medium">即時開通・格安</span>
                    </a>
                </div>
            </div>

            {/* ホテル詳細・予約案内ポップアップ (ダイアログ) */}
            {showHotelModal && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm rounded-t-3xl flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-5 shadow-2xl max-w-sm w-full flex flex-col gap-4 border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🏨</span>
                                <h4 className="text-sm font-extrabold text-gray-900">ホテルの詳細・予約案内</h4>
                            </div>
                            <button onClick={() => setShowHotelModal(false)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-gray-600 font-bold">選択中の施設名:</p>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center gap-2">
                                <span className="text-xs font-extrabold text-blue-900 truncate">{title}</span>
                                <button 
                                    onClick={handleCopyTitle}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm"
                                >
                                    {copied ? '✓ コピー完了' : '名前をコピー'}
                                </button>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
                                上記のホテル名をコピーしてAgodaで検索するか、以下の公式提携リンクから最新の空室状況・料金プランをご確認いただけます。
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            {/* バンコク都市IDを指定した安全なAgodaパートナーリンク */}
                            <a 
                                href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1974942&city=9391"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl text-center shadow-md transition-colors flex items-center justify-center gap-1.5"
                            >
                                <span>🌐</span> Agoda バンコク宿泊施設一覧を開く (PR)
                            </a>
                            <button 
                                onClick={() => setShowHotelModal(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}