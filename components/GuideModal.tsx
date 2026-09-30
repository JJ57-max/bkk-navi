'use client';

import React, { useState } from 'react';
import { bangkokExchangeShops, ExchangeShop } from '@/data/guides';
import {
    bangkokRecommendations,
    RecommendedSpot,
} from '@/data/recommendations';

interface GuideModalProps {
    type:
        | 'exchange'
        | 'squall'
        | 'prep'
        | 'manner'
        | 'recommend'
        | 'transport'
        | 'safety'
        | 'thai_phrases'
        | 'drive'
        | 'stomach'
        | 'shopping'
        | null;
    onClose: () => void;
    onSelectExchangeShop: (shop: ExchangeShop) => void;
    onSelectRecommendedSpot?: (spot: RecommendedSpot) => void;
    currentLocation?: { lat: number; lng: number };
}

type RecommendationCategory = 'all' | 'massage' | 'cafe' | 'food';

// 2地点の緯度経度から直線距離(km)を算出するヘルパー関数
const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export default function GuideModal({
    type,
    onClose,
    onSelectExchangeShop,
    onSelectRecommendedSpot,
    currentLocation = {
        lat: 13.7462,
        lng: 100.535,
    },
}: GuideModalProps) {
    const [recCategory, setRecCategory] =
        useState<RecommendationCategory>('all');

    if (!type) return null;

    // カテゴリでフィルタリングしつつ、現在地からの距離を計算して「近い順」にソート
    const filteredSpots = bangkokRecommendations
        .filter(
            (s) =>
                recCategory === 'all' ||
                s.category === recCategory
        )
        .map((spot) => {
            const distance = calculateDistance(
                currentLocation.lat,
                currentLocation.lng,
                spot.coordinate.latitude,
                spot.coordinate.longitude
            );

            return {
                ...spot,
                distance: Math.round(distance * 10) / 10,
            };
        })
        .sort((a, b) => a.distance - b.distance);

    const recommendationCategories: {
        key: RecommendationCategory;
        label: string;
    }[] = [
        { key: 'all', label: 'すべて' },
        { key: 'massage', label: '💆 マッサージ' },
        { key: 'cafe', label: '☕ カフェ' },
        { key: 'food', label: '🍜 グルメ' },
    ];

    return (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 pointer-events-auto overflow-hidden">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[calc(100dvh-1rem)] min-h-0 flex flex-col p-4 sm:p-6 animate-scale-up border border-gray-100 overflow-hidden">
                {/* ヘッダー */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">
                            {type === 'exchange'
                                ? '💴'
                                : type === 'squall'
                                  ? '🌧️'
                                  : type === 'prep'
                                    ? '✈️'
                                    : type === 'recommend'
                                      ? '✨'
                                      : type === 'transport'
                                        ? '🚆'
                                        : type === 'safety'
                                          ? '🛡️'
                                          : type === 'thai_phrases'
                                            ? '🗣️'
                                            : type === 'drive'
                                              ? '🚗'
                                              : type === 'stomach'
                                                ? '🧊'
                                                : type === 'shopping'
                                                  ? '🛍️'
                                                  : '📖'}
                        </span>
                        <h2 className="font-bold text-gray-900 text-base">
                            {type === 'exchange'
                                ? 'バンコク両替ガイド (PR)'
                                : type === 'squall'
                                  ? 'スコール避難スポット'
                                  : type === 'prep'
                                    ? 'タイ渡航の準備 (TDAC)'
                                    : type === 'recommend'
                                      ? '周辺おすすめリフレッシュ'
                                      : type === 'transport'
                                        ? 'タイ国鉄・鉄道移動ガイド'
                                        : type === 'safety'
                                          ? '安全・治安＆注意エリアガイド'
                                          : type === 'thai_phrases'
                                            ? 'サバイバルタイ語会話'
                                            : type === 'drive'
                                              ? 'タイの運転・レンタカーガイド'
                                              : type === 'stomach'
                                                ? '食あたり・水あたり対策ガイド'
                                                : type === 'shopping'
                                                  ? 'お買い物 ＆ 免税手続き(VAT Refund)'
                                                  : 'タイマナー ＆ チップ'}
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
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-3 pr-1 text-xs text-gray-700">
                    {/* 周辺おすすめスポット */}
                    {type === 'recommend' && (
                        <div className="flex flex-col gap-3">
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px] leading-relaxed">
                                <span className="font-bold block mb-1">
                                    ✨ 現在地周辺のおすすめリフレッシュ
                                </span>
                                掲載中のスパ・カフェ・グルメスポットなどを、あなたの現在地から近い順に表示しています。ワンタップで目的地に設定できます！
                            </div>

                            {/* カテゴリ切り替えボタン */}
                            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-2xl">
                                {recommendationCategories.map(
                                    (cat) => (
                                        <button
                                            key={cat.key}
                                            onClick={() =>
                                                setRecCategory(
                                                    cat.key
                                                )
                                            }
                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-xl transition-all ${
                                                recCategory ===
                                                cat.key
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-gray-600 hover:bg-white'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* スポット一覧（近い順に動的ソート） */}
                            {filteredSpots.map(
                                (spot) => (
                                    <div
                                        key={spot.id}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span
                                                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${
                                                            spot.category ===
                                                            'massage'
                                                                ? 'bg-purple-600'
                                                                : spot.category ===
                                                                    'cafe'
                                                                  ? 'bg-amber-600'
                                                                  : 'bg-rose-600'
                                                        }`}
                                                    >
                                                        {spot.category ===
                                                        'massage'
                                                            ? 'マッサージ・スパ'
                                                            : spot.category ===
                                                                'cafe'
                                                              ? 'カフェ・スイーツ'
                                                              : 'グルメ・屋台'}
                                                    </span>

                                                    <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                                                        現在地から約{' '}
                                                        {
                                                            spot.distance
                                                        }{' '}
                                                        km
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-gray-900 text-xs mt-1">
                                                    {spot.name}
                                                </h3>

                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    📍 エリア:{' '}
                                                    {spot.area}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-gray-600 leading-relaxed">
                                            {
                                                spot.description
                                            }
                                        </p>

                                        <button
                                            onClick={() => {
                                                if (
                                                    onSelectRecommendedSpot
                                                ) {
                                                    onSelectRecommendedSpot(
                                                        spot
                                                    );
                                                }

                                                onClose();
                                            }}
                                            className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-center hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1 mt-1"
                                        >
                                            <span>📍</span>{' '}
                                            マップで場所を見る（目的地に設定）
                                        </button>
                                    </div>
                                )
                            )}

                            {/* ガイド内おすすめPR枠 (Klook & KKday) */}
                            <div className="mt-2 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                                <a
                                    href="/api/klook"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-amber-50 hover:bg-amber-100 border border-amber-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center group"
                                >
                                    <span className="text-base">
                                        🎫
                                    </span>
                                    <span className="text-[11px] font-bold text-amber-900 leading-tight">
                                        現地ツアー検索
                                    </span>
                                    <span className="text-[9px] text-amber-600 font-medium">
                                        Klook (PR)
                                    </span>
                                </a>

                                <a
                                    href="/api/kkday"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-orange-50 hover:bg-orange-100 border border-orange-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center group"
                                >
                                    <span className="text-base">
                                        🎡
                                    </span>
                                    <span className="text-[11px] font-bold text-orange-900 leading-tight">
                                        現地ツアー検索
                                    </span>
                                    <span className="text-[9px] text-orange-600 font-medium">
                                        KKday (PR)
                                    </span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* お買い物 ＆ 免税手続きパネル */}
                    {type === 'shopping' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-purple-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🛍️ バンコクお買い物 ＆ 免税のコツ
                                </span>
                                デパート等でのショッピングを楽しむ際に知っておきたいポイントと、免税（VAT Refund）の手続き手順です。
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    💡 お買い物の便利ティップス
                                </h4>

                                <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-600">
                                    <li>
                                        <b>
                                            ツーリストカードの活用
                                        </b>
                                        : サイアム・パラゴンやセントラルなどの大型デパートでは、外国人向けのキャンペーンや割引が行われることがあります。内容や条件は各施設のインフォメーションで確認しましょう。
                                    </li>
                                    <li>
                                        <b>免税の条件</b>
                                        : 「VAT Refund for Tourists」の掲示があるお店で、<b>1日・1店舗あたり2,000バーツ以上</b>購入することが条件です。
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    📄 免税書類（P.P.10）の作り方
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    お買い物当日、お店のレジや免税カウンターで<b>パスポートを提示</b>し、VAT Refundの手続きを依頼します。対象店舗ではP.P.10またはe-P.P.10等の必要書類を発行してもらい、購入時の税務書類を保管してください。
                                </p>

                                <p className="text-[10px] text-gray-500">
                                    ※購入品は原則として購入日から60日以内にタイ国外へ持ち出す必要があります。
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    ✈️ 空港での免税手続きステップ
                                </h4>

                                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-gray-600">
                                    <li>
                                        <b>チェックイン前</b>
                                        : 出国当日の購入品合計が<b>20,000バーツ以上</b>の場合は、パスポート・P.P.10/e-P.P.10・原本の税務書類・購入品を税関へ提示して確認を受けます。
                                    </li>
                                    <li>
                                        <b>出国審査後</b>
                                        : VAT Refund Counterで必要書類を提出し、還付手続きを行います。
                                    </li>
                                </ol>

                                <p className="text-[10px] text-gray-500">
                                    ※対象となる高額品などは、出国審査後に追加確認が必要な場合があります。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 食あたり・水あたり対策ガイドパネル */}
                    {type === 'stomach' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-2xl text-cyan-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🧊 食あたり・水あたりを防ぐポイント
                                </span>
                                タイ旅行中のお腹のトラブルを避けるために、水・氷・食事について気をつけたいポイントと、氷を断るタイ語をご紹介します。
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    💧 飲料水と「氷」の注意点
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    飲用にはボトル水など安全な水を利用し、水道水をそのまま飲むことは避けましょう。氷についても、水の衛生状態が分からない場合は避けると安心です。
                                </p>

                                <div className="bg-white p-2.5 rounded-xl border border-cyan-200 mt-1">
                                    <div className="text-[10px] font-bold text-gray-500">
                                        「氷を入れないでください」
                                    </div>
                                    <div className="text-cyan-800 font-extrabold text-xs mt-0.5">
                                        マイ・サイ・ナムケーン・カップ / カー
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    🍜 屋台や飲食店選びのコツ
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    生肉、生魚、貝類などの生・加熱不十分な食品には注意し、十分に加熱された料理を選びましょう。屋台や飲食店では、料理が高温で提供されるか、食品が適切に保管されているかも確認すると安心です。
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    💊 お腹を壊してしまったときの備え
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    体調不良時は無理をせず、必要に応じて薬局や医療機関へ相談しましょう。普段使用している薬がある場合は、旅行前に必要量を準備しておくと安心です。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* タイの運転・レンタカーガイドパネル */}
                    {type === 'drive' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🚗 タイでの運転ルールと歩行者の心得
                                </span>
                                タイは左側通行です。日本とは交通事情や道路上の動きが異なるため、信号・標識を確認し、周囲の車両や二輪車に十分注意して運転しましょう。
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    🪪 国際運転免許証について
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    タイで運転する場合は、<b>日本の運転免許証だけで運転できるとは限りません</b>。タイの運輸当局が認める国際運転免許証など、滞在条件に合った有効な免許を事前に確認してください。
                                </p>

                                <p className="text-[10px] text-gray-500">
                                    ※レンタカー会社の貸出条件・保険条件も別途確認しましょう。
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    🛵 バイクのすり抜けに注意
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    車線変更や右左折の際には、車両の左右から二輪車が近づいてくることがあります。ミラーだけに頼らず、周囲を十分確認してから進路変更を行いましょう。
                                </p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🚶 歩行者も安全第一
                                </span>
                                大通りを横断する際は、信号・横断歩道・歩道橋などの安全な横断設備を利用しましょう。車両の接近がある場合は無理に横断せず、周囲を十分確認してください。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                            おすすめ予約 (PR)
                                        </span>

                                        <h3 className="font-bold text-gray-900 text-xs mt-1">
                                            Rentalcars.com (レンタカーズ)
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-600">
                                    郊外へのドライブや地方都市への旅行などでレンタカーを手配したい場合は、複数のレンタカー会社を比較できる予約サービスを利用する方法があります。利用前に貸出条件・免許条件・保険内容を確認しましょう。
                                </p>

                                <a
                                    href="https://www.rentalcars.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-xl text-center text-[10px] transition-colors"
                                >
                                    🌐 Rentalcars.com 公式サイトを開く
                                </a>
                            </div>
                        </div>
                    )}

                    {/* 安全・治安＆注意エリアガイド */}
                    {type === 'safety' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🛡️ バンコクの安全対策
                                </span>
                                バンコクでは、スリ、置き引き、ひったくりなどに注意し、夜間や人通りの少ない場所では周囲を確認して行動しましょう。
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    ⚠️ 不審な声かけに注意
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    観光地などで知らない人から突然、金銭や財布・紙幣を見せるよう求められた場合は、応じず、その場を離れましょう。財布や現金を人前で取り出すことも避けると安心です。
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    ⚠️ 夜間の単独行動・人通りの少ない場所
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    夜間にナナプラザやソイ・カウボーイ周辺などの繁華街を歩く場合も、メイン通りから外れた暗い路地や人通りの少ない場所には注意しましょう。必要に応じて配車アプリ（Grab/Bolt）などを利用してください。
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    🛵 バイクによるひったくりへの警戒
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    道路側でスマートフォンやバッグを操作する際は注意しましょう。立ち止まる場合は、可能な範囲で建物側など車道から離れた場所を選ぶと安心です。
                                </p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    📞 緊急時の連絡先（お守りメモ）
                                </span>

                                <ul className="list-disc pl-4 space-y-1 text-[10px] text-amber-900">
                                    <li>
                                        <b>観光警察</b>: 1155（24時間）
                                    </li>
                                    <li>
                                        <b>警察（一般）</b>: 191
                                    </li>
                                    <li>
                                        <b>在タイ日本国大使館</b>:
                                        +66-2-207-8500 / +66-2-696-3000
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* サバイバルタイ語会話パネル */}
                    {type === 'thai_phrases' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-2xl text-indigo-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🗣️ 旅で役立つサバイバルタイ語
                                </span>
                                タイ語では、丁寧な文末表現として、男性話者は「〜カップ（ครับ）」、女性話者は「〜カー（ค่ะ / คะ）」を使います。
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border space-y-2.5">
                                <div className="border-b pb-2">
                                    <div className="font-bold text-gray-900 text-xs">
                                        こんにちは / お疲れ様です
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        サワディー・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        基本の挨拶。お店に入る時や人に会った時などに使えます。
                                    </div>
                                </div>

                                <div className="border-b pb-2">
                                    <div className="font-bold text-gray-900 text-xs">
                                        氷を入れないでください
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        マイ・サイ・ナムケーン・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        氷を入れたくないときに使える表現です。
                                    </div>
                                </div>

                                <div className="border-b pb-2">
                                    <div className="font-bold text-gray-900 text-xs">
                                        ありがとうございます
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        コプ・クン・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        お礼を伝える基本表現です。
                                    </div>
                                </div>

                                <div className="border-b pb-2">
                                    <div className="font-bold text-gray-900 text-xs">
                                        いくらですか？
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        ラーカ・タオライ・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        屋台やマーケットなどで価格を尋ねるときに使えます。
                                    </div>
                                </div>

                                <div className="border-b pb-2">
                                    <div className="font-bold text-gray-900 text-xs">
                                        辛くしないでください
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        マイ・ペット・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        辛さを控えてほしいときに使える表現です。
                                    </div>
                                </div>

                                <div className="border-b pb-2">
                                    <div className="font-bold text-gray-900 text-xs">
                                        美味しいです！
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        アロイ・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        料理がおいしいことを伝える表現です。
                                    </div>
                                </div>

                                <div>
                                    <div className="font-bold text-gray-900 text-xs">
                                        いりません / 結構です
                                    </div>
                                    <div className="text-blue-600 font-extrabold text-xs mt-0.5">
                                        マイ・アオ・カップ / カー
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        不要な商品や勧誘などを断るときに使える表現です。
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 両替ガイド */}
                    {type === 'exchange' && (
                        <div className="flex flex-col gap-3">
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-800 text-[11px] leading-relaxed">
                                <span className="font-bold block mb-1">
                                    💡 バンコク両替のポイント
                                </span>
                                両替レートや手数料は、空港・ホテル・市内の店舗など場所や店舗によって異なります。複数の店舗を比較し、必要な金額だけ両替するのがおすすめです。両替時にはパスポートが必要になる場合があります。
                            </div>

                            {bangkokExchangeShops.map(
                                (shop) => (
                                    <div
                                        key={shop.id}
                                        className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                                    {
                                                        shop.rateRank
                                                    }
                                                </span>

                                                <h3 className="font-bold text-gray-900 text-xs mt-1">
                                                    {shop.name}
                                                </h3>

                                                <p className="text-[10px] text-gray-500">
                                                    {shop.area}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-gray-600">
                                            {
                                                shop.description
                                            }
                                        </p>

                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() => {
                                                    onSelectExchangeShop(
                                                        shop
                                                    );
                                                    onClose();
                                                }}
                                                className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-center hover:bg-emerald-700 transition-colors"
                                            >
                                                📍 マップで場所を見る
                                            </button>

                                            {shop.affiliateUrl && (
                                                <a
                                                    href={
                                                        shop.affiliateUrl
                                                    }
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
                                )
                            )}

                            {/* 両替所ガイド専用のPRセクション（Wise・Airalo） */}
                            <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
                                <p className="text-[10px] text-gray-400 font-bold px-1">
                                    現金と合わせて便利な準備サービス (PR)
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    <a
                                        href="https://wise.com/invite/dic/junichim52"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all text-center"
                                    >
                                        <span className="text-base">
                                            💳
                                        </span>
                                        <span className="text-[11px] font-bold text-emerald-900 leading-tight">
                                            Wiseデビットカード (PR)
                                        </span>
                                        <span className="text-[9px] text-emerald-600 font-medium">
                                            海外利用に便利
                                        </span>
                                    </a>

                                    <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-center">
                                        <span className="text-base">
                                            📶
                                        </span>
                                        <span className="text-[11px] font-bold text-indigo-900 leading-tight">
                                            Airalo eSIM (PR)
                                        </span>
                                        <a
                                            href="https://airalo.pxf.io/BKKNAVI"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold py-1.5 px-2 rounded-lg transition-colors"
                                        >
                                            全ユーザー 10% OFF
                                        </a>
                                        <a
                                            href="https://airalo.pxf.io/BKKNAVINEW"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-700 text-[9px] font-bold py-1.5 px-2 rounded-lg transition-colors"
                                        >
                                            新規ユーザー 15% OFF
                                        </a>
                                        <span className="text-[8px] text-indigo-500 font-medium leading-tight">
                                            2027/6/30まで・リンクからクーポン自動適用
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* スコール避難ガイド */}
                    {type === 'squall' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-2xl text-cyan-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🌧️ 雨季（一般に5月〜10月頃）のスコール対策
                                </span>
                                バンコクでは雨季に急な強い雨が降ることがあります。雨が強いときは無理に移動せず、大型商業施設や駅直結の屋内スペースなどへ避難しましょう。
                            </div>

                            <div className="bg-gray-50 p-3 rounded-2xl border">
                                <h4 className="font-bold text-gray-800 mb-1">
                                    🏢 雨宿りしやすいスポット
                                </h4>

                                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                    <li>
                                        <b>
                                            サイアム・パラゴン / セントラル・ワールド
                                        </b>{' '}
                                        (大型商業施設で屋内に避難しやすい)
                                    </li>
                                    <li>
                                        <b>
                                            ターミナル21アソーク
                                        </b>{' '}
                                        (駅直結で屋内施設へ移動しやすい)
                                    </li>
                                    <li>
                                        <b>
                                            BTS・MRTなどの駅周辺
                                        </b>{' '}
                                        (駅直結の商業施設など、雨を避けられる屋内スペースを探しましょう)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* 渡航準備ガイド */}
                    {type === 'prep' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    ✈️ 入国前の事前準備：TDAC（デジタル到着カード）
                                </span>
                                タイに入国する外国人は、原則としてデジタル到着カード（TDAC）の事前登録が必要です。<b>到着の72時間前から</b>登録できますので、出発前に公式サイトで手続きを済ませましょう。

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

                            <div className="bg-gray-50 p-3 rounded-2xl border text-[11px] text-gray-600 space-y-2">
                                <p>
                                    <b>TDACの登録タイミング</b>:
                                    入国予定日の72時間前から登録できます。1回の入国に対して必要な手続きです。
                                </p>

                                <p>
                                    <b>パスポート・入国条件</b>:
                                    パスポートの残存期間や航空券などの入国条件は、国籍・滞在条件等によって異なる場合があります。出発前にタイ政府・大使館などの最新情報を確認してください。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 交通ガイド */}
                    {type === 'transport' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            {/* タイ国鉄の予約 */}
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    🚆 タイ国鉄（寝台列車など）の切符予約
                                </span>
                                人気列車を予約する場合は、タイ国鉄の公式オンライン予約サービスを利用できます。必要に応じて民間予約サービスも比較しましょう。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                            公式予約
                                        </span>

                                        <h3 className="font-bold text-gray-900 text-xs mt-1">
                                            タイ国鉄 公式 (D-Ticket)
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-600">
                                    タイ国鉄（SRT）の公式オンライン予約サービスです。利用には会員登録・ログインが必要です。
                                </p>

                                <a
                                    href="https://www.dticket.railway.co.th/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-xl text-center text-[10px] transition-colors"
                                >
                                    🌐 D-Ticket 公式サイトを開く
                                </a>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                            予約の選択肢
                                        </span>

                                        <h3 className="font-bold text-gray-900 text-xs mt-1">
                                            12Go / Baolau
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-600">
                                    複数の交通機関をまとめて検索・予約できる民間サービスです。公式サイトと比較する場合は、運賃・手数料・予約条件を確認しましょう。
                                </p>

                                <div className="flex gap-2">
                                    <a
                                        href="https://12go.asia/ja"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2 rounded-xl text-center text-[10px] transition-colors"
                                    >
                                        🌐 12Goを開く
                                    </a>

                                    <a
                                        href="https://www.baolau.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-bold py-1.5 px-2 rounded-xl text-center text-[10px] transition-colors"
                                    >
                                        🌐 Baolauを開く
                                    </a>
                                </div>
                            </div>

                            {/* BTS / MRT のチケットレス乗車ガイド */}
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">
                                    💳 市内移動（BTS / MRT）のチケットレス術
                                </span>
                                対応している駅・改札では、交通系カードやコンタクトレス決済を利用することで、乗車券購入の手間を減らせます。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-900 text-xs">
                                    1. BTS（スカイトレイン）
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    <b>ラビットカード (Rabbit Card)</b>{' '}
                                    という交通系ICカードが利用できます。また、タッチ決済対応カードについては、対応している駅・改札の案内を現地で確認してください。
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-900 text-xs">
                                    2. MRT（地下鉄ブルーライン・パープルライン）
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    MRT Blue Line / Purple Lineでは、対応する<b>Visa・Mastercard等のコンタクトレスカード</b>を改札で直接タッチして利用できます。カードの対応状況は公式案内を確認してください。
                                </p>
                            </div>

                            {/* バスの乗り方ガイド */}
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">
                                    🚌 バンコク路線バスの乗り方
                                </span>
                                ローカルな移動を楽しめますが、路線・車両によって乗り方や支払い方法が異なるため、現地で確認しながら利用しましょう。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">
                                    1. 乗る
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    バス停で目的のバスが近づいてきたら、運転手に乗車意思が伝わるよう手を挙げるなどしてアピールすると分かりやすいです。路線によって停車方法が異なる場合があります。
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">
                                    2. 料金を払う
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    車内係員がいるバスでは、乗車後に運賃を現金で支払う方式が一般的です。路線・車両によって異なるため、細かい現金を用意しておくと便利です。
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">
                                    💡 言葉が不安なときの対策＆アドバイス
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    行き先がタイ文字で読めない・タイ語で伝えられない場合は、無理せず<b>「MRT」「BTS」「配車アプリ（Grab/Bolt）」</b>など分かりやすい交通手段を利用する方法があります。バスに乗る場合は、<b>行きたい場所のタイ語表記（Googleマップ画面など）を車掌さんに見せる</b>と、目的地を伝えやすくなります。
                                </p>
                            </div>

                            {/* バイタク＆トゥクトゥクの攻略ガイド */}
                            <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-purple-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">
                                    🏍️ バイタク ＆ 🛺 トゥクトゥクの乗り方
                                </span>
                                バンコクならではの移動手段です。料金や安全面を確認して利用しましょう。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">
                                    1. バイタク（バイクタクシー / Win）
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    渋滞時の移動手段の一つです。街なかの専用ベストを着た運転手が集まる「ウィン（Win）」と呼ばれる乗り場があります。
                                </p>

                                <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-600">
                                    <li>
                                        <b>料金を事前確認</b>:
                                        乗る前に行き先を告げて料金を確認しましょう。配車アプリを利用する方法もあります。
                                    </li>
                                    <li>
                                        <b>安全第一</b>:
                                        ヘルメットを着用し、走行中は運転手の指示に従いましょう。
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">
                                    2. トゥクトゥク（三輪タクシー）
                                </h3>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    バンコクらしい乗り物の一つです。メーターではなく料金交渉になることが多いため、乗車前に料金を確認して合意してから利用しましょう。
                                </p>

                                <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-600">
                                    <li>
                                        <b>乗車前の価格確認</b>:
                                        行き先と料金を事前に確認しましょう。
                                    </li>
                                    <li>
                                        <b>排気ガスに注意</b>:
                                        車両の構造上、走行中に排気ガスや道路上の空気を受けやすいため、体調や空気の状態に応じて利用しましょう。
                                    </li>
                                </ul>
                            </div>

                            {/* LINE MAN について */}
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">
                                    🛵 タイの「LINE MAN」
                                </span>
                                タイで利用されているフードデリバリーや各種サービスのアプリです。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    LINE MANでは<b>LINE IDを使ったログイン</b>が案内されています。利用可能なサービスや提供エリアは現地の最新情報を確認してください。
                                </p>

                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    フードデリバリーなどを利用したい場合や、他の配車・配送サービスと比較したい場合の選択肢になります。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* マナー ＆ チップのガイドパネル */}
                    {type === 'manner' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-orange-900 text-[11px]">
                                <span className="font-bold block mb-1">
                                    📖 知っておきたいタイの文化とマナー
                                </span>
                                王室への敬意、寺院での服装、チップの習慣など、現地の文化を尊重して行動しましょう。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl space-y-2">
                                <p>
                                    <b>1. 寺院の服装</b>:
                                    寺院によって服装規定があります。肩や膝が隠れる服装を求められることが多いため、露出の少ない服装を準備しておくと安心です。
                                </p>

                                <p>
                                    <b>2. タクシーの乗車</b>:
                                    メータータクシーを利用する場合は、メーター使用を確認しましょう。配車アプリ（Grab / Bolt）を利用する方法もあります。
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl space-y-2">
                                <h4 className="font-bold text-gray-800 text-xs">
                                    💸 チップの考え方
                                </h4>

                                <p className="text-[11px] text-gray-600">
                                    タイでは欧米と同じ形の一律のチップ制度ではありません。サービス料（Service Charge）が含まれているかを確認し、チップを渡す場合はサービスや店舗の慣習に応じて判断しましょう。
                                </p>

                                <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-600">
                                    <li>
                                        <b>サービス料込のお店</b>:
                                        メニューやレシートに「Service Charge」などの記載がある場合は、その内容を確認しましょう。
                                    </li>
                                    <li>
                                        <b>マッサージ・スパなど</b>:
                                        チップを渡すかどうか、金額はサービス内容や店舗によって異なります。必須ではありません。
                                    </li>
                                    <li>
                                        <b>判断に迷う場合</b>:
                                        店舗の表示やスタッフへの確認を優先し、無理に渡す必要はありません。
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">
                                    🚗 Grab / Boltを安全に使うコツ
                                </span>

                                <ul className="list-disc pl-4 space-y-1 text-blue-800">
                                    <li>
                                        <b>ナンバー照合</b>:
                                        乗車前にアプリ表示と実際の車のナンバーを確認。
                                    </li>
                                    <li>
                                        <b>アプリ決済</b>:
                                        対応している場合はアプリ決済を利用すると、料金確認がしやすくなります。
                                    </li>
                                    <li>
                                        <b>GPSの確認</b>:
                                        必要に応じてスマートフォンのマップで現在地やルートを確認しましょう。
                                    </li>
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