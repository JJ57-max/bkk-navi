// components/EmergencyModal.tsx
'use client';

import React, { useState } from 'react';
import { bangkokEmergencyContacts, EmergencyContact } from '@/data/emergency';

interface EmergencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (title: string, lat: number, lng: number) => void;
}

export default function EmergencyModal({ isOpen, onClose, onSelectLocation }: EmergencyModalProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCopyAddress = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col p-6 animate-scale-up border border-gray-100">
                {/* ヘッダー */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <h2 className="font-extrabold text-gray-900 text-base">緊急時・医療サポート</h2>
                            <p className="text-[10px] text-gray-500">病院・警察・大使館の連絡先と現在地からのアクセス</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2 py-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* 本文リスト */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 text-xs text-gray-700">
                    <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-red-900 text-[11px] leading-relaxed">
                        <span className="font-bold block mb-1">⚠️ 万が一のトラブルや急病のときは</span>
                        日本語通訳が常駐する病院や、24時間対応の観光警察ホットライン（1155）へすぐに連絡・移動できるようにしています。
                    </div>

                    {bangkokEmergencyContacts.map((contact) => (
                        <div key={contact.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${
                                        contact.category === 'hospital' ? 'bg-rose-600' :
                                        contact.category === 'police' ? 'bg-blue-600' : 'bg-amber-600'
                                    }`}>
                                        {contact.category === 'hospital' ? '総合病院' : contact.category === 'police' ? '警察・通報' : '大使館'}
                                    </span>
                                    <h3 className="font-extrabold text-gray-900 text-xs mt-1.5">{contact.name}</h3>
                                </div>
                                <a 
                                    href={`tel:${contact.phone}`}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-colors shrink-0"
                                >
                                    <span>📞</span> {contact.phone}
                                </a>
                            </div>

                            <p className="text-[11px] text-gray-600 leading-relaxed">{contact.description}</p>

                            {/* タイ語・英語住所とコピーボタン */}
                            <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-bold">タクシー等で見せるタイ語住所:</span>
                                    <button
                                        onClick={() => handleCopyAddress(contact.id, contact.addressTh)}
                                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded transition-colors"
                                    >
                                        {copiedId === contact.id ? '✓ コピー完了' : '住所をコピー'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-800 font-medium select-all bg-gray-50 p-1.5 rounded">
                                    {contact.addressTh}
                                </p>
                            </div>

                            {/* マップで場所を見る（現在地からのルート案内連動）ボタン */}
                            <button
                                onClick={() => {
                                    onSelectLocation(contact.name, contact.coordinate.latitude, contact.coordinate.longitude);
                                    onClose();
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-center text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-0.5"
                            >
                                <span>📍</span> マップで場所を見る（現在地からのアクセス）
                            </button>
                        </div>
                    ))}
                </div>

                {/* フッター閉じるボタン */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-2xl text-xs transition-colors"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
}