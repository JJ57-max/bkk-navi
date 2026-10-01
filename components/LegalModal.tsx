'use client';

type LegalModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LegalModal({
    isOpen,
    onClose,
}: LegalModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            Bangkok Omamori Compass
                        </p>
                        <h2
                            id="legal-modal-title"
                            className="text-base font-bold text-gray-900"
                        >
                            プライバシー・免責
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="閉じる"
                        className="rounded-full bg-gray-100 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-5 px-5 py-5 text-xs leading-relaxed text-gray-700">
                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            位置情報について
                        </h3>
                        <p>
                            本サービスは、現在地周辺の情報表示や移動案内のため、利用者が許可した場合にブラウザの位置情報機能を利用します。位置情報を許可しない場合、取得できない場合、または対象エリア外の場合は、バンコクのデモ位置を使用します。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            アクセス解析について
                        </h3>
                        <p>
                            本サービスでは、利用状況の把握とサービス改善のためGoogle Analyticsを利用しています。Google AnalyticsによりCookie等が使用される場合があります。データの取扱いについてはGoogleの規約・プライバシーポリシーをご確認ください。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            Google Maps Platformについて
                        </h3>
                        <p>
                            地図、スポット検索、住所・ルート等の機能にGoogle Maps Platformを利用しています。Googleが提供する情報は、実際の現地状況と異なる場合があります。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            広告・アフィリエイトについて
                        </h3>
                        <p>
                            本サービスには、Agoda、Klook、KKday、Wise、Airalo、ValueCommerce等の外部サービスへの広告・アフィリエイトリンクが含まれる場合があります。対象のリンクや案内にはPRであることが分かる表示を行います。リンク経由で予約・購入等が行われた場合、運営者が報酬を受け取ることがあります。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            外部サービスについて
                        </h3>
                        <p>
                            外部サイトへ移動した後のサービス内容、料金、予約条件、個人情報の取扱い等は、各事業者の規約・ポリシーが適用されます。申込み前に各事業者の最新情報をご確認ください。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            情報の正確性・最新性について
                        </h3>
                        <p>
                            交通機関、船着場、運航状況、営業時間、料金、施設情報等は変更されることがあります。本サービスでは情報の確認・更新に努めていますが、完全性、正確性、最新性を保証するものではありません。安全や予約、移動に関わる重要事項は、必ず運営事業者・施設・公的機関等の公式情報もご確認ください。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            免責事項
                        </h3>
                        <p>
                            本サービスの掲載情報や外部サービスの利用によって生じた損害について、運営者は法令上認められる範囲で責任を負いません。緊急時や安全に関わる判断では、本サービスだけに依存せず、現地の公的機関・緊急サービス・公式情報を優先してください。
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-1 font-bold text-gray-900">
                            お問い合わせ
                        </h3>
                        <p>
                            お問い合わせ窓口は準備中です。窓口を公開後、本ページを更新します。
                        </p>
                    </section>

                    <div className="border-t border-gray-100 pt-4 text-[10px] text-gray-500">
                        制定・最終更新: 2026年10月1日
                    </div>
                </div>
            </div>
        </div>
    );
}
