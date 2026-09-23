// components/GuideModal.tsx
'use client';

import React, { useState } from 'react';
import { bangkokExchangeShops, ExchangeShop } from '@/data/guides';
import { bangkokRecommendations, RecommendedSpot } from '@/data/recommendations';

interface GuideModalProps {
    type: 'exchange' | 'squall' | 'prep' | 'manner' | 'recommend' | 'transport' | null;
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
                            {type === 'exchange' ? '💴' : 
                             type === 'squall' ? '🌧️' : 
                             type === 'prep' ? '✈️' : 
                             type === 'recommend' ? '✨' : 
                             type === 'transport' ? '🚆' : '📖'}
                        </span>
                        <h2 className="font-bold text-gray-900 text-base">
                            {type === 'exchange' ? '高レート両替所ガイド (PR)' : 
                             type === 'squall' ? 'スコール避難スポット' : 
                             type === 'prep' ? 'タイ渡航の準備 (TDAC)' : 
                             type === 'recommend' ? '周辺おすすめリフレッシュ' : 
                             type === 'transport' ? 'タイ国鉄・鉄道移動ガイド' : 'タイマナー ＆ チップ'}
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
                    {/* 4. 周辺おすすめスポット（タブ） */}
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

                    {type === 'transport' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            {/* タイ国鉄の予約・攻略 */}
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-900 text-[11px]">
                                <span className="font-bold block mb-1">🚆 タイ国鉄（寝台列車など）切符予約の攻略法</span>
                                人気の寝台列車などのチケット争奪戦を勝ち抜くための「二段構え」のコツです。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">本命（最安・最速）</span>
                                        <h3 className="font-bold text-gray-900 text-xs mt-1">タイ国鉄 公式 (D-Ticket)</h3>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-600">手数料が一番安く最速ですが、<b>動作が重くエラーが起きやすい</b>です。事前のアカウント作成・ログインが必須。</p>
                                <a href="https://www.dticket.railway.co.th/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-xl text-center text-[10px] transition-colors">
                                    🌐 D-Ticket 公式サイトを開く
                                </a>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">保険・裏技（軽快・確実）</span>
                                        <h3 className="font-bold text-gray-900 text-xs mt-1">12Go / Baolau</h3>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-600">タイ全土をカバーし、<b>画面が非常に軽くてスムーズ</b>です。公式が繋がらない時のバックアップに最適（手数料あり）。</p>
                                <div className="flex gap-2">
                                    <a href="https://12go.asia/ja" target="_blank" rel="noopener noreferrer" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2 rounded-xl text-center text-[10px] transition-colors">
                                        🌐 12Goを開く
                                    </a>
                                    <a href="https://www.baolau.com/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-bold py-1.5 px-2 rounded-xl text-center text-[10px] transition-colors">
                                        🌐 Baolauを開く
                                    </a>
                                </div>
                            </div>

                            {/* BTS / MRT のチケットレス乗車ガイド */}
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">💳 市内移動（BTS / MRT）のチケットレス術</span>
                                券売機の長い行列に並ばず、日本のSUICA感覚でスムーズに乗車する方法です！
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-900 text-xs">1. BTS（スカイトレイン）</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    <b>ラビットカード (Rabbit Card)</b> という日本のSuicaのような交通系ICカードが窓口や駅構内で購入できます。または、<b>タッチ決済対応のクレジットカード（Visa/Mastercardのコンタクトレス）</b>が一部改札でそのまま使えます！
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-900 text-xs">2. MRT（地下鉄ブルーライン・パープルライン）</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    窓口や券売機に並ばず、改札のタッチ部分に<b>タッチ決済対応のクレジットカード（Visa/Mastercard）やデビットカード（Wiseなど）を直接タッチ</b>するだけで、そのまま乗車・決済できます（※トークンを買う手間が省けて一番ラクです）。
                                </p>
                            </div>

                            {/* バスの乗り方ガイド */}
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">🚌 バンコク路線バスの乗り方・攻略法</span>
                                ローカルな移動を楽しめますが、言葉の壁や難易度が高いため事前のコツが大切です！
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">1. 乗る（手を挙げてアピール）</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    バス停で目的のバスが見えたら、<b>運転手に向けて手を水平に高く差し出し「乗ります」のサイン</b>を必ず出します（出さないと通過してしまいます）。
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">2. 料金を払う（車掌さんへ現金）</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    乗車後、集金バッグを持った車掌さんが席まで来るので、<b>現金（小銭か20バーツ札）</b>を渡して切符を受け取ります。
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">💡 言葉が不安なときの対策＆アドバイス</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    行き先がタイ文字で読めない・タイ語で伝えられない場合は、無理せず<b>「MTR」「BTS」「配車アプリ（Grab/Bolt）」</b>を使うのが圧倒的に安心です。どうしてもバスに乗る場合は、<b>行きたい場所のタイ語表記（Googleマップ画面など）を車掌さんに無言で見せる</b>と、降りるべき場所で教えてもらいやすくなります！
                                </p>
                            </div>

                            {/* バイタク＆トゥクトゥクの攻略ガイド */}
                            <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-purple-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">🏍️ バイタク ＆ 🛺 トゥクトゥクの乗り方</span>
                                バンコクならではのスリル満点な移動手段ですが、安全に乗るためのコツがあります！
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">1. バイタク（バイクタクシー / Win）</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    <b>大渋滞をすり抜ける最強の時短ツール</b>です。街なかの専用ベストを着た運転手がたむろする「ウィン（Win）」と呼ばれる乗り場から乗ります。
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-600">
                                    <li><b>料金交渉が基本</b>: 乗る前に必ず行き先を告げて値段を確認（または配車アプリ「Grab / Bolt」経由で呼ぶとぼったくりが防げて安心）。</li>
                                    <li><b>安全第一</b>: ヘルメットの着用が義務づけられています。スピードが出るため、しっかり捕まりましょう。</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800 text-xs">2. トゥクトゥク（三輪タクシー）</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    風を切りながら走る観光の目玉ですが、<b>実用的な移動というよりは「エンタメ・観光体験」</b>として割り切るのがおすすめです。
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-600">
                                    <li><b>乗車前の価格交渉が必須</b>: メーターがないため、乗る前に必ず「いくらか」を確認し、合意してから乗りましょう。</li>
                                    <li><b>排気ガスに注意</b>: 窓がないため大気汚染や排気ガスをダイレクトに浴びます。夜間の短距離や雰囲気を楽しむ用として使うのがスマートです。</li>
                                </ul>
                            </div>

                            {/* LINE MAN について */}
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900 text-[11px] mt-1">
                                <span className="font-bold block mb-1">🛵 タイの超定番ライフライン「LINE MAN」</span>
                                フードデリバリーから移動まで何でも揃う国民的アプリです。
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex flex-col gap-2">
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    日本のLINEアプリとは別ですが、<b>タイに到着してから現地でアプリをダウンロードし、ご自身のLINEアカウントや電話番号でログインして利用可能</b>です。
                                </p>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    ホテルの部屋から一歩も出ずにローカルフードを頼みたいときや、GrabやBoltのサブの配車手段として非常に強力な味方になります！
                                </p>
                            </div>
                        </div>
                    )}

                    {type === 'manner' && (
                        <div className="flex flex-col gap-3 leading-relaxed">
                            <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-orange-900 text-[11px]">
                                <span className="font-bold block mb-1">📖 知っておくべきタイの文化とマナー</span>
                                王室への敬意、寺院での服装、チップの習慣など、最低限のマナーを知っておくとトラブルを防げます。
                            </div>
                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl border space-y-2">
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