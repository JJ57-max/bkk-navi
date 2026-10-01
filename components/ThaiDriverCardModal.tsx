// components/ThaiDriverCardModal.tsx
'use client';

import React, { useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getThaiInfo } from '@/data/thaiInfo';
import type { DestinationAddress } from '@/hooks/useDestinationAddress';
import DestinationAddressBlock from '@/components/DestinationAddressBlock';

// SSRと初回hydrationではPortalを描画せず、クライアントでのみ有効にする。
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface ThaiDriverCardProps {
    destinationTitle: string;
    destinationAddress: DestinationAddress;
    onRetryAddress: () => void;
    verifiedThaiName?: string;
    onClose: () => void;
}

export default function ThaiDriverCardModal({
    destinationTitle,
    destinationAddress,
    onRetryAddress,
    verifiedThaiName,
    onClose,
}: ThaiDriverCardProps) {
    const thaiData = getThaiInfo(destinationTitle);
    const candidateThaiTitle = verifiedThaiName || thaiData.thaiName || '';
    const candidateContainsThai = /[\u0E00-\u0E7F]/.test(candidateThaiTitle);
    const candidateContainsJapanese = /[\u3040-\u30ff\u3400-\u9fff]/.test(candidateThaiTitle);
    const candidateContainsLatin = /[A-Za-z]/.test(candidateThaiTitle);
    const hasSafeThaiTitle =
        candidateContainsThai &&
        !candidateContainsJapanese &&
        !candidateContainsLatin;
    const displayThaiTitle = hasSafeThaiTitle
        ? candidateThaiTitle
        : destinationTitle;
    const thaiNote = verifiedThaiName
        ? 'ชื่อสถานีภาษาไทยที่ตรวจสอบแล้ว'
        : hasSafeThaiTitle
          ? thaiData.note
          : '';
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const mounted = useSyncExternalStore(
        subscribeToClient,
        getClientSnapshot,
        getServerSnapshot,
    );

    useEffect(() => {
        return () => {
            if (utteranceRef.current) {
                utteranceRef.current.onstart = null;
                utteranceRef.current.onend = null;
                utteranceRef.current.onerror = null;
            }
            window.speechSynthesis?.cancel();
        };
    }, []);

    // Names and coordinates are never substituted for the pin's Thai address.
    const thaiAddress = destinationAddress.addressTh;
    const canSpeakThai = destinationAddress.status === 'ready' && !!thaiAddress;

    // タイ語音声の再生処理
    const handleSpeakThai = () => {
        if (!canSpeakThai) {
            alert('この目的地はタイ語住所が取得できていないため、住所を再取得してください');
            return;
        }

        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            alert('お使いのブラウザは音声読み上げに対応していません');
            return;
        }

        window.speechSynthesis.cancel(); // 連続再生の重複を防ぐためキャンセル

        // ピン位置から取得したタイ語住所を読み上げる
        const textToSpeak = `กรุณาไปส่งตามที่อยู่นี้ ${thaiAddress}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'th-TH'; // タイ語指定
        utterance.rate = 0.9; // 少しゆっくり聞き取りやすく

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (event) => {
            setIsPlaying(false);
            if (event.error !== 'canceled' && event.error !== 'interrupted') {
                setSpeechError('音声を再生できませんでした。タイ語音声の設定をご確認ください。');
            }
        };
        utteranceRef.current = utterance;
        setSpeechError(null);
        setIsPlaying(true);

        try {
            window.speechSynthesis.speak(utterance);
        } catch {
            setIsPlaying(false);
            setSpeechError('音声を再生できませんでした。タイ語音声の設定をご確認ください。');
        }
    };

    if (!mounted) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[10050] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[calc(100dvh-1rem)] min-h-0 p-4 sm:p-6 relative animate-scale-up flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 flex justify-between items-center mb-4 bg-white">
                    <span className="text-xs font-bold text-gray-500">運転手さんに見せてください</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                        ✕
                    </button>
                </div>

                {/* タイ語カード本体 */}
                <div className="bg-yellow-50 border-2 border-orange-400 rounded-2xl p-4 sm:p-6 text-center shadow-inner mb-4 overflow-y-auto overscroll-contain">
                    <p className="text-sm text-gray-600 mb-2">กรุณาไปส่งที่</p>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-relaxed">
                        {displayThaiTitle}
                    </h2>
                    <div className="mt-3">
                        <DestinationAddressBlock address={destinationAddress} onRetry={onRetryAddress} />
                    </div>
                    {thaiNote && (
                        <p className="text-sm font-bold text-blue-600">
                            ({thaiNote})
                        </p>
                    )}
                </div>

                {/* 音声再生ボタン */}
                <button
                    onClick={handleSpeakThai}
                    disabled={isPlaying || !canSpeakThai}
                    className={`w-full mb-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-xs ${
                        isPlaying
                            ? 'bg-amber-500 text-white animate-pulse'
                            : !canSpeakThai
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                    }`}
                >
                    <span>🔊</span>
                    <span>{isPlaying ? 'タイ語で再生中...' : canSpeakThai ? 'タイ語住所を読み上げる' : destinationAddress.status === 'loading' ? '住所を取得中…' : '住所を再取得してください'}</span>
                </button>

                {speechError && <p role="alert" className="text-xs text-red-700 mb-3">{speechError}</p>}
                <div className="text-center text-xs text-gray-500 mb-4">
                    目的地名: <span className="font-bold text-gray-800">{destinationTitle}</span>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors text-xs"
                >
                    閉じる
                </button>
            </div>
        </div>,
        document.body
    );
}