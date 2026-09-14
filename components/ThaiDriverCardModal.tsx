// components/ThaiDriverCardModal.tsx
'use client';

import React from 'react';
import { getThaiInfo } from '@/data/thaiInfo';

interface ThaiDriverCardProps {
    destinationTitle: string;
    onClose: () => void;
}

export default function ThaiDriverCardModal({ destinationTitle, onClose }: ThaiDriverCardProps) {
    const thaiData = getThaiInfo(destinationTitle);
    const displayThaiTitle = thaiData.thaiName || destinationTitle;
    const thaiNote = thaiData.note;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative animate-scale-up">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500">運転手さんに見せてください</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                        ✕
                    </button>
                </div>

                {/* タイ語カード本体 */}
                <div className="bg-yellow-50 border-2 border-orange-400 rounded-2xl p-6 text-center shadow-inner mb-6">
                    <p className="text-sm text-gray-600 mb-2">กรุณาไปส่งที่</p>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-relaxed">
                        {displayThaiTitle}
                    </h2>
                    {thaiNote && (
                        <p className="text-sm font-bold text-blue-600">
                            ({thaiNote})
                        </p>
                    )}
                </div>

                <div className="text-center text-xs text-gray-500 mb-4">
                    日本語名称: <span className="font-bold text-gray-800">{destinationTitle}</span>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
}