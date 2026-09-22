// components/GuideModal.tsx
'use client';

import React, { useState } from 'react';
import { bangkokExchangeShops, ExchangeShop } from '@/data/guides';
import { bangkokRecommendations, RecommendedSpot } from '@/data/recommendations';

interface GuideModalProps {
    type: 'exchange' | 'squall' | 'prep' | 'manner' | 'recommend' | null;
    onClose: () => void;
    onSelectExchangeShop: (shop: ExchangeShop) => void;
    onSelectRecommendedSpot?: (spot: RecommendedSpot) => void;
}

export default function GuideModal({
    type,
    onClose,
    onSelectExchangeShop,
    onSelectRecommendedSpot,
}: GuideModalProps) {
    const [recCategory, setRecCategory] = useState<'all' | 'massage' | 'cafe' | 'food'>('all');

    if (!type) return null;

    const filteredSpots = recCategory === 'all' 
        ? bangkokRecommendations 
        : bangkokRecommendations.filter(s => s.category === recCategory);

    return (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col p-6 animate-scale-up border border-gray-100">
                {/* ヘッダー */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">
                            {type === 'exchange' ? '💴' : type === 'squall' ? '🌧️' : type === 'prep' ? '✈️' : type === 'recommend' ? '✨' : '📖'}
                        </span>
                        <h2 className="font-bold text-gray-900 text-base">
                            {type === 'exchange' ? '高レート両替所ガイド (PR)' : type === 'squall' ? 'スコール避難スポット' : type === 'prep' ? 'タイ渡航の準備 (TDAC)' : type === 'recommend' ? '周辺おすすめリフレッシュ' : 'タイマナー ＆ チップ'}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2 py-1"
                    >
                        ✕
                    </button>
                </div>

                {/* コンテンツ本文 */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 text-xs text-gray-700">
                    {/* 4. 周辺おすすめスポット（新設タブ） */}
                    {type === 'recommend' && (
                        <div className="flex flex-col gap-3">
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px] leading-relaxed">
                                <span className="font-bold block mb-1">✨ 街歩きの合間のリフレッシュ</span>
                                バンコク市内の人気スパ・マッサージ店、おしゃれカフェ、活気あるナイトマーケットやローカルグルメを厳選しました。ワンタップで目的地に設定できます！
                            </div>

                            {/* カテゴリ切り替えボタン */}
                            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-2xl">
                                {[
                                    { key: 'all', label: 'すべて' },
                                    { key: 'massage', label: '💆 マッサージ' },
                                    { key: 'cafe', label: '☕ カフェ' },
                                    { key: 'food', label: '🍜 グルメ' },
                                ].map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setRecCategory(cat.key as any)}
                                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-xl transition-all ${
                                            recCategory === cat.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* スポット一覧 */}
                            {filteredSpots.map((spot) => (
                                <div key={spot.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${
                                                spot.category === 'massage' ? 'bg-purple-600' :
                                                spot.category === 'cafe' ? 'bg-amber-600' : 'bg-rose-600'
                                            }`}>
                                                {spot.category === 'massage' ? 'マッサージ・スパ' : spot.category === 'cafe' ? 'カフェ・スイーツ' : 'グルメ・屋台'}
                                            </span>
                                            <h3 className="font-bold text-gray-900 text-xs mt-1.5">{spot.name}</h3>
                                            <span className="text-[10px] text-gray-500 font-medium">📍 エリア: {spot.area}</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-600 leading-relaxed">{spot.description}</p>
                                    
                                    <button
                                        onClick={() => {
                                            if (onSelectRecommendedSpot) {
                                                onSelectRecommendedSpot(spot);
                                            }
                                            onClose();
                                        }}
                                        className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-center hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1 mt-1"
                                    >
                                        <span>📍</span> マップで場所を見る（目的地に設定）
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {type === 'exchange' && (
                        <div className="flex flex-col gap-3">
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-800 text-[11px] leading-relaxed">
                                <span className="font-bold block mb-1">💡 バンコク両替の鉄則</span>
                                空港やホテルの両替所はレートが低いため、市内の「高レート両替所」をピンポイントで利用するのが一番お得です！※必ずパスポートを持参してください。
                            </div>
                            
                            {bangkokExchangeShops.map((shop) => (
                                <div key={shop.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                                {shop.rateRank}
                                            </span>
                                            <h3 className="font-bold text-gray-900 text-xs mt-1">{shop.name}</h3>
                                            <p className="text-[10px] text-gray-500">{shop.area}</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-600">{shop.description}</p>
                                    
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => {
                                                onSelectExchangeShop(shop);
                                                onClose();
                                            }}
                                            className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-center hover:bg-emerald-700 transition-colors"
                                        >
                                            📍 マップで場所を見る
                                        </button>
                                        {shop.affiliateUrl && (
                                            <a
                                                href={shop.affiliateUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-xl text-center flex items-center justify-center"
                                                title="公式サイト・パートナーリンク"
                                            >
                                                🌐
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* 両替所ガイド専用のお得なPRセクション（Wise・Airalo） */}
                            <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
                                <p className="text-[10px] text-gray-400 font-bold px-1">現金と合わせてお得な準備サービス (PR)</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <a 
                                        href="https://wise.com/invite/dic/junichim52" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center"
                                    >
                                        <span className="text-base">💳</span>
                                        <span className="text-[11px] font-bold text-emerald-900 leading-tight">Wiseデビットカード (PR)</span>
                                        <span className="text-[9px] text-emerald-600 font-medium">手数料最安クラスで両替</span>
                                    </a>

                                    <a 
                                        href="https://www.airalo.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center"
                                    >
                                        <span className="text-base">📶</span>
                                        <span className="text-[11px] font-bold text-indigo-900 leading-tight">タイ用eSIM (Airalo)</span>
                                        <span className="text-[9px] text-indigo-600 font-medium">街歩き中のネット確保</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {type === 'squall' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-2xl text-cyan-900 text-[11px]">
                                <span className="font-bold block mb-1">🌧️ 雨季（5月〜10月）のスコール対策</span>
                                夕方以降に突然激しい雨が降ります。30分〜1時間程度で止むことが多いため、無理に歩かず大型商業施設や地下鉄駅へ避難するのがベストです。
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl border">
                                <h4 className="font-bold text-gray-800 mb-1">🏢 おすすめの雨宿りスポット</h4>
                                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                    <li><b>サイアム・パラゴン / セントラル・ワールド</b> (地下街や直結通路が充実)</li>
                                    <li><b>ターミナル21アソーク</b> (駅直結でフードコートもあり雨宿りに最適)</li>
                                    <li><b>各MRT（地下鉄）の駅構内</b> (地下のため完全に濡れません)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {type === 'prep' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-[11px]">
                                <span className="font-bold block mb-1">✈️ 入国前の事前準備：TDAC（入国カード）</span>
                                タイ入国に際して、デジタル入国カード（TDAC）の事前登録が求められます。スムーズな渡航のために出発前にお済ませください。
                                <div className="mt-2">
                                    <a 
                                        href="https://tdac.immigration.go.th" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition-colors"
                                    >
                                        🌐 TDAC公式申請サイトを開く
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl border text-[11px] text-gray-600 space-y-1">
                                <p><b>パスポート残存期間</b>: タイ入国時に6ヶ月以上残っている必要があります。</p>
                                <p><b>航空券の準備</b>: 出国用の航空券（Eチケット等）の提示が求められる場合があります。</p>
                            </div>
                        </div>
                    )}

                    {type === 'manner' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-orange-900 text-[11px]">
                                <span className="font-bold block mb-1">📖 知っておくべきタイの文化とマナー</span>
                                王室への敬意、寺院での服装、チップの習慣など、最低限のマナーを知っておくとトラブルを防げます。
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <p><b>1. 寺院の服装</b>: 露出の多い服装（タンクトップや短パン）はNG。肩や膝が隠れる服装で行きましょう。</p>
                                <p><b>2. チップの習慣</b>: 高級レストランやマッサージではお気持ち程度（20〜100バーツ紙幣）を渡すとスマートです。</p>
                                <p><b>3. タクシーの乗車</b>: 乗る前に必ず「メーター（By Meter?）」と確認するか、配車アプリ（Grab / Bolt）の利用が安心です。</p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">🚗 Grab / Boltを安全に使いこなすコツ</span>
                                <ul className="list-disc pl-4 space-y-1 text-blue-800">
                                    <li><b>ナンバー照合</b>: 乗車前にアプリ表示と実際の車のナンバーを必ず確認。</li>
                                    <li><b>アプリ決済推奨</b>: クレジットカード紐付けで、お釣りやぼったくりのトラブルを回避。</li>
                                    <li><b>GPSの確認</b>: 乗車中もスマホのマップで正しいルートを通っているかチェック。</li>
                                </ul>
                            </div>
                        </div>
                    )}
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