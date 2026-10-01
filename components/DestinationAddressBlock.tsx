'use client';

import type { DestinationAddress } from '@/hooks/useDestinationAddress';

export default function DestinationAddressBlock({ address, onRetry }: {
    address: DestinationAddress;
    onRetry: () => void;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs break-words">
            <p className="font-bold text-gray-700 mb-1">ピン位置の住所</p>
            {address.status === 'loading' && <p className="text-gray-500" role="status">住所を取得しています…</p>}
            {address.addressJa && <p className="text-gray-700 mb-2">{address.addressJa}</p>}
            {address.addressTh && <p lang="th" className="font-bold text-gray-900 text-sm leading-relaxed">{address.addressTh}</p>}
            {address.status === 'error' && (
                <div role="status" className="text-amber-800">
                    <p>タイ語住所を取得できませんでした。</p>
                    <button type="button" onClick={onRetry} className="underline font-bold mt-1">住所を再取得</button>
                </div>
            )}
            <p className="text-gray-500 mt-2">座標: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}</p>
            <a className="text-blue-700 underline" target="_blank" rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}>
                Google Mapsでピン位置を確認
            </a>
            <p className="text-[10px] text-gray-500 mt-1">住所はピン付近の検索結果です。施設の入口は地図で確認してください。</p>
        </div>
    );
}
