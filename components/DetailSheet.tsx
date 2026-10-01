// components/DetailSheet.tsx
'use client';

import React, {
    useEffect,
    useState,
} from 'react';

import { createPortal } from 'react-dom';
import type { DestinationAddress } from '@/hooks/useDestinationAddress';
import DestinationAddressBlock from '@/components/DestinationAddressBlock';
import BoatServiceNotice from '@/components/BoatServiceNotice';

interface DetailSheetProps {
    title: string;
    destinationAddress: DestinationAddress;
    onRetryAddress: () => void;
    distanceKm: number;
    agodaHotelId?: string;
    onClose: () => void;
    onOpenThaiCard: () => void;
}

export default function DetailSheet({
    title,
    destinationAddress,
    onRetryAddress,
    distanceKm,
    agodaHotelId,
    onClose,
    onOpenThaiCard,
}: DetailSheetProps) {
    const [mounted, setMounted] =
        useState(false);

    const [showHotelModal, setShowHotelModal] =
        useState<boolean>(false);

    const [copied, setCopied] =
        useState<boolean>(false);


    const getBangkokDateString = (offsetDays: number) => {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(new Date());

        const year = Number(parts.find((part) => part.type === 'year')?.value);
        const month = Number(parts.find((part) => part.type === 'month')?.value);
        const day = Number(parts.find((part) => part.type === 'day')?.value);
        const date = new Date(Date.UTC(year, month - 1, day + offsetDays));
        return date.toISOString().slice(0, 10);
    };

    const [checkIn, setCheckIn] = useState<string>(() => getBangkokDateString(1));
    const [checkOut, setCheckOut] = useState<string>(() => getBangkokDateString(2));
    const [adults, setAdults] = useState<number>(2);

    const bookingConditionsValid =
        checkIn.length > 0 &&
        checkOut.length > 0 &&
        checkOut > checkIn &&
        Number.isInteger(adults) &&
        adults >= 1 &&
        adults <= 20;

    const agodaBookingUrl = (() => {
        if (!agodaHotelId) {
            return 'https://www.agoda.com/ja-jp/city/bangkok-th.html?cid=1974942';
        }

        const params = new URLSearchParams({
            cid: '1974942',
            hid: agodaHotelId,
            currency: 'JPY',
            checkin: checkIn,
            checkout: checkOut,
            NumberofAdults: String(adults),
            NumberofChildren: '0',
            Rooms: '1',
        });

        return `https://www.agoda.com/partners/partnersearch.aspx?${params.toString()}`;
    })();

    /*
     * Portal は document.body を使用するため、
     * クライアント側でマウントされた後だけ描画する。
     */
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setMounted(true);
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    /*
     * ESCキーでも閉じられるようにする。
     */
    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key !== 'Escape') {
                return;
            }

            if (showHotelModal) {
                setShowHotelModal(false);
                return;
            }

            onClose();
        };

        window.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, [
        onClose,
        showHotelModal,
    ]);

    const handleCopyTitle = async () => {
        try {
            await navigator.clipboard.writeText(
                title
            );

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error(
                'Clipboard copy failed:',
                error
            );
        }
    };

    /*
     * タクシー料金目安
     */
    const calculateTaxiFare = (
        km: number
    ) => {
        if (km <= 1) {
            return '約 40〜50 バーツ';
        }

        const base = 35;
        const add =
            (km - 1) * 6.5;

        const total =
            Math.round(
                base + add
            );

        return `約 ${total}〜${total + 30} バーツ`;
    };

    /*
     * 所要時間目安
     */
    const calculateDuration = (
        km: number
    ) => {
        const minutes =
            Math.round(
                km * 4 + 10
            );

        if (minutes >= 60) {
            return `約 ${(minutes / 60).toFixed(1)} 時間`;
        }

        return `約 ${minutes} 分`;
    };

    if (!mounted) {
        return null;
    }

    const sheet = (
        /*
         * =====================================================
         * Portal root
         * =====================================================
         *
         * document.body 直下に描画される。
         *
         * page.tsx の
         * overflow-hidden / stacking context / position
         * の影響を受けない。
         */
        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center

                p-2


                [@media(max-height:500px)]:p-0

                pointer-events-none
                overflow-hidden
            "
        >
            {/*
             * 背景
             *
             * クリックで閉じる。
             */}
            <button
                type="button"
                aria-label="目的地ガイドを閉じる"
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    bg-black/10
                    pointer-events-auto
                    cursor-default
                "
            />

            {/*
             * =================================================
             * DetailSheet本体
             * =================================================
             */}
            <section
                role="dialog"
                aria-modal="true"
                aria-label="目的地ガイド"
                className="
                    relative
                    z-10
                    pointer-events-auto

                    w-full
                    max-w-md

                    h-full
                    min-h-0
                    max-h-full

                    bg-white
                    rounded-2xl

                    md:h-auto
                    md:max-h-[calc(100dvh-2rem)]
                    md:min-h-0
                    md:rounded-2xl

                    [@media(max-height:500px)]:h-full
                    [@media(max-height:500px)]:max-h-full
                    [@media(max-height:500px)]:rounded-none
                    shadow-2xl

                    border
                    border-gray-200
                    border-b-0

                    overflow-hidden

                    flex
                    flex-col

                    box-border
                "
            >
                {/*
                 * =================================================
                 * 固定ヘッダー
                 * =================================================
                 */}
                <header
                    className="
                        relative
                        shrink-0
                        min-h-[56px]
                        [@media(max-height:500px)]:min-h-[48px]

                        flex
                        items-center

                        px-4
                        pr-16
                        py-2
                        [@media(max-height:500px)]:py-1

                        bg-white

                        border-b
                        border-gray-200

                        z-30
                    "
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-blue-600 text-lg shrink-0">
                            📍
                        </span>

                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                目的地ガイド ＆ 予約サポート
                            </p>

                            <h3 className="text-sm font-extrabold text-gray-900 truncate">
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/*
                     * 右上閉じるボタン
                     */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="目的地ガイドを閉じる"
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2

                            z-50

                            w-10
                            h-10

                            flex
                            items-center
                            justify-center

                            rounded-full

                            bg-gray-900
                            text-white

                            text-lg
                            font-bold

                            shadow-lg

                            hover:bg-gray-700
                            active:bg-black
                        "
                    >
                        ✕
                    </button>
                </header>

                {/*
                 * =================================================
                 * スクロールコンテンツ
                 * =================================================
                 */}
                <div
                    className="
                        min-h-0
                        flex-1

                        overflow-y-auto
                        overscroll-contain

                        px-4
                        py-3
                    "
                >
                    <div className="flex flex-col gap-3">
                        <DestinationAddressBlock address={destinationAddress} onRetry={onRetryAddress} />
                        <BoatServiceNotice latitude={destinationAddress.latitude} longitude={destinationAddress.longitude} />
                        {/*
                         * アクセス概要
                         */}
                        <div
                            className="
                                bg-gray-50
                                p-3
                                rounded-2xl
                                border
                                border-gray-100
                                flex
                                flex-col
                                gap-2
                            "
                        >
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold">
                                        直線距離
                                    </p>

                                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">
                                        約 {distanceKm} km
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold">
                                        移動の目安時間
                                    </p>

                                    <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                                        {calculateDuration(
                                            distanceKm
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold">
                                        タクシー料金相場
                                    </p>

                                    <p className="text-xs font-extrabold text-blue-600 mt-0.5">
                                        {calculateTaxiFare(
                                            distanceKm
                                        )}
                                    </p>
                                </div>
                            </div>

                            <p className="text-[9px] text-gray-400 text-center border-t border-gray-200/60 pt-1.5">
                                ※バンコク市内の交通渋滞やルートにより、時間・料金は変動します。
                            </p>
                        </div>

                        {/*
                         * タイドライバーカード
                         */}
                        <button
                            type="button"
                            onClick={
                                onOpenThaiCard
                            }
                            className="
                                w-full

                                bg-gradient-to-r
                                from-teal-600
                                to-emerald-600

                                hover:from-teal-700
                                hover:to-emerald-700

                                text-white
                                text-xs
                                font-bold

                                py-3

                                rounded-2xl
                                shadow-md

                                flex
                                items-center
                                justify-center
                                gap-2

                                transition-all
                            "
                        >
                            <span>
                                🛺
                            </span>

                            <span>
                                タイ語ドライバーカードを表示（ぼったくり防止）
                            </span>
                        </button>

                        {/*
                         * PRサービス
                         */}
                        <div className="flex flex-col gap-1.5 pt-1">
                            <p className="text-[10px] text-gray-400 font-bold px-1">
                                現地で役立つおすすめサービス (PR)
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowHotelModal(
                                            true
                                        )
                                    }
                                    className="
                                        bg-blue-50
                                        hover:bg-blue-100
                                        border
                                        border-blue-200
                                        p-2.5
                                        rounded-2xl

                                        flex
                                        flex-col
                                        items-center
                                        gap-1

                                        transition-all
                                        text-center
                                    "
                                >
                                    <span className="text-base">
                                        🏨
                                    </span>

                                    <span className="text-[11px] font-bold text-blue-900 leading-tight">
                                        ホテルを検索 (Agoda)
                                    </span>

                                    <span className="text-[9px] text-blue-600 font-medium">
                                        PR
                                    </span>
                                </button>

                                <div
                                    className="
                                        bg-indigo-50
                                        border
                                        border-indigo-200
                                        p-2.5
                                        rounded-2xl

                                        flex
                                        flex-col
                                        items-center
                                        gap-1.5

                                        text-center
                                    "
                                >
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

                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <a
                                    href="/api/klook"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        bg-amber-50
                                        hover:bg-amber-100
                                        border
                                        border-amber-200
                                        p-2.5
                                        rounded-2xl

                                        flex
                                        flex-col
                                        items-center
                                        gap-1

                                        transition-all
                                        text-center
                                    "
                                >
                                    <span className="text-base">
                                        🎫
                                    </span>

                                    <span className="text-[11px] font-bold text-amber-900 leading-tight">
                                        現地ツアー
                                    </span>

                                    <span className="text-[9px] text-amber-600 font-medium">
                                        Klook (PR)
                                    </span>
                                </a>

                                <a
                                    href="/api/kkday"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        bg-orange-50
                                        hover:bg-orange-100
                                        border
                                        border-orange-200
                                        p-2.5
                                        rounded-2xl

                                        flex
                                        flex-col
                                        items-center
                                        gap-1

                                        transition-all
                                        text-center
                                    "
                                >
                                    <span className="text-base">
                                        🎡
                                    </span>

                                    <span className="text-[11px] font-bold text-orange-900 leading-tight">
                                        現地ツアー
                                    </span>

                                    <span className="text-[9px] text-orange-600 font-medium">
                                        KKday (PR)
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/*
                 * =================================================
                 * 常時表示フッター
                 * =================================================
                 *
                 * 低い画面でも必ず閉じられるようにする。
                 */}
                <footer
                    className="
                        shrink-0
                        z-30

                        bg-white

                        border-t
                        border-gray-200

                        px-4
                        pt-2
                        [@media(max-height:500px)]:pt-1

                        pb-[max(0.5rem,env(safe-area-inset-bottom))]
                        [@media(max-height:500px)]:pb-1
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-full

                            bg-gray-900
                            hover:bg-gray-700
                            active:bg-black

                            text-white

                            text-xs
                            font-bold

                            py-2.5

                            rounded-xl

                            shadow-sm

                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <span>
                            ✕
                        </span>

                        <span>
                            閉じる
                        </span>
                    </button>
                </footer>

                {/*
                 * =================================================
                 * Agoda Modal
                 * =================================================
                 */}
                {showHotelModal && (
                    <div
                        className="
                            absolute
                            inset-0

                            z-[100]

                            bg-black/60
                            backdrop-blur-sm

                            p-2

                            flex
                            items-center
                            justify-center
                        "
                    >
                        <div
                            className="
                                bg-white

                                rounded-3xl
                                shadow-2xl

                                max-w-sm
                                w-full

                                max-h-[calc(100%-8px)]

                                overflow-hidden

                                flex
                                flex-col

                                border
                                border-gray-100
                            "
                        >
                            <div
                                className="
                                    relative
                                    shrink-0

                                    border-b
                                    border-gray-100

                                    px-5
                                    py-3
                                    pr-14
                                "
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-lg shrink-0">
                                        🏨
                                    </span>

                                    <h4 className="text-sm font-extrabold text-gray-900 truncate">
                                        ホテルの詳細・予約案内
                                    </h4>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowHotelModal(
                                            false
                                        )
                                    }
                                    aria-label="ホテル案内を閉じる"
                                    className="
                                        absolute
                                        top-1/2
                                        right-3
                                        -translate-y-1/2

                                        w-9
                                        h-9

                                        rounded-full

                                        bg-gray-900
                                        text-white

                                        hover:bg-gray-700

                                        flex
                                        items-center
                                        justify-center

                                        font-bold
                                        shadow-md
                                    "
                                >
                                    ✕
                                </button>
                            </div>

                            <div
                                className="
                                    min-h-0
                                    flex-1

                                    overflow-y-auto
                                    overscroll-contain

                                    p-5

                                    flex
                                    flex-col
                                    gap-4
                                "
                            >
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-gray-600 font-bold">
                                        選択中の施設名:
                                    </p>

                                    <div
                                        className="
                                            bg-gray-50

                                            p-3

                                            rounded-xl

                                            border
                                            border-gray-200

                                            flex
                                            justify-between
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <span className="text-xs font-extrabold text-blue-900 truncate">
                                            {title}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={
                                                handleCopyTitle
                                            }
                                            className="
                                                bg-blue-600
                                                hover:bg-blue-700

                                                text-white
                                                text-[10px]
                                                font-bold

                                                px-3
                                                py-1.5

                                                rounded-lg

                                                shrink-0

                                                transition-colors
                                                shadow-sm
                                            "
                                        >
                                            {copied
                                                ? '✓ コピー完了'
                                                : '名前をコピー'}
                                        </button>
                                    </div>

                                    <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
                                        Agoda掲載ホテルを選択した場合は、ホテル・宿泊日・大人人数を引き継いでAgodaを開きます。
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex flex-col gap-1 text-[10px] font-bold text-gray-600">
                                        チェックイン
                                        <input id="hotel-check-in" name="checkIn" type="date" value={checkIn} min={getBangkokDateString(0)} onChange={(event) => setCheckIn(event.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs text-gray-900" />
                                    </label>
                                    <label className="flex flex-col gap-1 text-[10px] font-bold text-gray-600">
                                        チェックアウト
                                        <input id="hotel-check-out" name="checkOut" type="date" value={checkOut} min={checkIn || getBangkokDateString(0)} onChange={(event) => setCheckOut(event.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs text-gray-900" />
                                    </label>
                                </div>

                                <label className="flex flex-col gap-1 text-[10px] font-bold text-gray-600">
                                    宿泊人数（大人）
                                    <select id="hotel-adults" name="adults" value={adults} onChange={(event) => setAdults(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs text-gray-900 bg-white">
                                        {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                                            <option key={count} value={count}>{count}名</option>
                                        ))}
                                    </select>
                                </label>

                                {!bookingConditionsValid && (
                                    <p className="text-[10px] font-bold text-red-600">チェックアウトはチェックインより後の日付を指定してください。</p>
                                )}

                                {!agodaHotelId && (
                                    <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 leading-relaxed">この施設は固定おすすめデータのためAgoda Hotel IDを保持していません。Agodaのバンコクページを開き、施設名で検索してください。</p>
                                )}

                                <div className="flex flex-col gap-2 pt-1">
                                    <a
                                        href={bookingConditionsValid ? agodaBookingUrl : undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            w-full

                                            bg-blue-600
                                            hover:bg-blue-700

                                            text-white
                                            text-xs
                                            font-bold

                                            py-3

                                            rounded-xl

                                            text-center

                                            shadow-md

                                            transition-colors

                                            flex
                                            items-center
                                            justify-center
                                            gap-1.5
                                        "
                                    >
                                        <span>
                                            🇹🇭
                                        </span>

                                        {agodaHotelId ? 'Agodaでこのホテルを確認 (PR)' : 'Agoda バンコク専用ページを開く (PR)'}
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowHotelModal(
                                                false
                                            )
                                        }
                                        className="
                                            w-full

                                            bg-gray-100
                                            hover:bg-gray-200

                                            text-gray-700
                                            text-xs
                                            font-bold

                                            py-2.5

                                            rounded-xl

                                            transition-colors
                                        "
                                    >
                                        閉じる
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );

    return createPortal(
        sheet,
        document.body
    );
}
