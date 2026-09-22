// components/ThaiDriverCardModal.tsx
'use client';

import React, { useState } from 'react';
import { getThaiInfo } from '@/data/thaiInfo';

interface ThaiDriverCardProps {
    destinationTitle: string;
    onClose: () => void;
}

export default function ThaiDriverCardModal({ destinationTitle, onClose }: ThaiDriverCardProps) {
    const thaiData = getThaiInfo(destinationTitle);
    const displayThaiTitle = thaiData.thaiName || destinationTitle;
    const thaiNote = thaiData.note;
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // タイ語音声の再生処理
    const handleSpeakThai = () => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('お使いのブラウザは音声読み上げに対応していません');
            return;
        }

        window.speechSynthesis.cancel(); // 連続再生の重複を防ぐためキャンセル

        // タクシー向けに「〇〇へ行ってください（กรุณาไปส่งที่ ...）」の形式で読み上げ
        const textToSpeak = `กรุณาไปส่งที่ ${displayThaiTitle}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'th-TH'; // タイ語指定
        utterance.rate = 0.9; // 少しゆっくり聞き取りやすく

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

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
                <div className="bg-yellow-50 border-2 border-orange-400 rounded-2xl p-6 text-center shadow-inner mb-4">
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

                {/* 音声再生ボタン */}
                <button
                    onClick={handleSpeakThai}
                    disabled={isPlaying}
                    className={`w-full mb-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-xs ${
                        isPlaying 
                            ? 'bg-amber-500 text-white animate-pulse' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                    }`}
                >
                    <span>🔊</span>
                    <span>{isPlaying ? 'タイ語で再生中...' : '音声で目的地を伝える（タイ語読み上げ）'}</span>
                </button>

                <div className="text-center text-xs text-gray-500 mb-4">
                    日本語名称: <span className="font-bold text-gray-800">{destinationTitle}</span>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors text-xs"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
}