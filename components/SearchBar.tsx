// components/SearchBar.tsx
'use client';

import React, { useState } from 'react';
import { allBangkokStations, Station } from '@/data/stations';

interface SearchBarProps {
    onSelectStation: (station: Station) => void;
}

export default function SearchBar({ onSelectStation }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // 日本語名や路線名で部分一致フィルタリング
    const filteredStations = query.trim() === '' ? [] : allBangkokStations.filter(station => 
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.line.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="absolute top-4 left-4 z-30 w-80 max-w-full">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    placeholder="駅名・船着場を日本語で検索 (例: サイアム)"
                    className="w-full px-4 py-3 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                />
                <span className="absolute right-3 top-3.5 text-gray-400 text-sm">🔍</span>
            </div>

            {/* 検索候補ドロップダウン */}
            {isOpen && filteredStations.length > 0 && (
                <ul className="absolute mt-2 w-full bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-40">
                    {filteredStations.map((station, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onSelectStation(station);
                                setQuery(station.name);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-none"
                        >
                            <span className="font-bold text-gray-800">{station.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                                {station.line}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}