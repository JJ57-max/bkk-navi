// components/EmergencyModal.tsx
'use client';

import React, { useState } from 'react';
import { bangkokEmergencyContacts, EmergencyContact } from '@/data/emergency';

interface EmergencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (title: string, lat: number, lng: number) => void;
}

const getCategoryStyle = (category: EmergencyContact['category']) => {
    switch (category) {
        case 'hospital':
            return { label: '総合病院', className: 'bg-rose-600' };
        case 'medical':
            return { label: '救急医療', className: 'bg-red-600' };
        case 'fire':
            return { label: '消防', className: 'bg-orange-600' };
        case 'police':
            return { label: '警察・通報', className: 'bg-blue-600' };
        case 'embassy':
            return { label: '大使館', className: 'bg-amber-600' };
        default:
            return { label: 'サポート', className: 'bg-gray-600' };
    }
};

export default function EmergencyModal({ isOpen, onClose, onSelectLocation }: EmergencyModalProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [pendingCall, setPendingCall] = useState<EmergencyContact | null>(null);

    if (!isOpen) return null;

    const handleCopyAddress = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleConfirmCall = () => {
        if (!pendingCall) return;
        window.location.href = `tel:${pendingCall.phone}`;
        setPendingCall(null);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 pointer-events-auto animate-fade-in overflow-hidden">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[calc(100dvh-1rem)] min-h-0 flex flex-col p-4 sm:p-6 animate-scale-up border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <h2 className="font-extrabold text-gray-900 text-base">緊急時・医療サポート</h2>
                            <p className="text-[10px] text-gray-500">緊急番号・病院・大使館の連絡先</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2 py-1 transition-colors"
                        aria-label="閉じる"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-3 pr-1 text-xs text-gray-700">
                    <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-red-900 text-[11px] leading-relaxed">
                        <span className="font-bold block mb-1">⚠️ 緊急時は状況に合った番号へ</span>
                        警察191、救急医療1669、バンコクの救急医療1646、消防199。旅行中のトラブルは24時間対応の観光警察1155（8言語対応）も利用できます。
                    </div>

                    {bangkokEmergencyContacts.map((contact) => {
                        const categoryStyle = getCategoryStyle(contact.category);

                        return (
                            <div key={contact.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${categoryStyle.className}`}>
                                            {categoryStyle.label}
                                        </span>
                                        <h3 className="font-extrabold text-gray-900 text-xs mt-1.5">{contact.name}</h3>
                                        {contact.phoneLabel && (
                                            <p className="text-[9px] text-gray-500 mt-0.5">{contact.phoneLabel}</p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPendingCall(contact)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-colors shrink-0"
                                        aria-label={`${contact.phone}へ電話`}
                                    >
                                        <span>📞</span> {contact.phone}
                                    </button>
                                </div>

                                <p className="text-[11px] text-gray-600 leading-relaxed">{contact.description}</p>

                                {contact.addressTh && (
                                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-bold">タクシー等で見せるタイ語住所:</span>
                                            <button
                                                onClick={() => handleCopyAddress(contact.id, contact.addressTh!)}
                                                className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded transition-colors"
                                            >
                                                {copiedId === contact.id ? '✓ コピー完了' : '住所をコピー'}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-800 font-medium select-all bg-gray-50 p-1.5 rounded">
                                            {contact.addressTh}
                                        </p>
                                    </div>
                                )}

                                {contact.coordinate && (
                                    <button
                                        onClick={() => {
                                            onSelectLocation(
                                                contact.name,
                                                contact.coordinate!.latitude,
                                                contact.coordinate!.longitude
                                            );
                                            onClose();
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-center text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-0.5"
                                    >
                                        <span>📍</span> マップで場所を見る（現在地からのアクセス）
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-2xl text-xs transition-colors"
                >
                    閉じる
                </button>
            </div>

            {pendingCall && (
                <div
                    className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="emergency-call-confirm-title"
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
                        <h3 id="emergency-call-confirm-title" className="text-sm font-extrabold text-gray-900">
                            電話をかけますか？
                        </h3>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                            {pendingCall.name}（{pendingCall.phone}）への発信画面を開きます。
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPendingCall(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCall}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                            >
                                電話する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
