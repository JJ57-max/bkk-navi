// data/hotels.ts

export interface HotelItem {
    id: string;
    name: string;
    star: number; // 3, 4, 5
    category: string;
    area: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    description: string;
}

export const bangkokHotels: HotelItem[] = [
    // --- 【星5】ラグジュアリー・リバーサイド・超有名ホテル ---
    {
        id: 'h-1',
        name: 'マンダリン オリエンタル バンコク',
        star: 5,
        category: 'ホテル (星5)',
        area: 'リバーサイド',
        coordinate: { latitude: 13.7225, longitude: 100.5140 },
        description: 'チャオプラヤ川沿いに佇む世界最高峰の伝統と格式を誇る伝説的ホテル。'
    },
    {
        id: 'h-2',
        name: 'ザ・ペニンシュラ バンコク',
        star: 5,
        category: 'ホテル (星5)',
        area: 'リバーサイド',
        coordinate: { latitude: 13.7230, longitude: 100.5105 },
        description: '全室リバービューの贅沢な眺望と極上のタイおもてなしが魅力の名門。'
    },
    {
        id: 'h-3',
        name: 'シャングリ・ラ バンコク',
        star: 5,
        category: 'ホテル (星5)',
        area: 'リバーサイド',
        coordinate: { latitude: 13.7210, longitude: 100.5155 },
        description: 'サパーンタクシン駅にほど近く、リゾート感と利便性を兼ね備えた大型ホテル。'
    },
    {
        id: 'h-4',
        name: 'グランデ センター ポイント ターミナル21',
        star: 5,
        category: 'ホテル (星5)',
        area: 'スクンビット',
        coordinate: { latitude: 13.7375, longitude: 100.5604 },
        description: 'アソーク駅＆ターミナル21直結で、観光・ショッピングの拠点として抜群の利便性。'
    },
    {
        id: 'h-5',
        name: 'シェラトン グランデ スクンビット',
        star: 5,
        category: 'ホテル (星5)',
        area: 'スクンビット',
        coordinate: { latitude: 13.7370, longitude: 100.5600 },
        description: 'アソーク駅に直結するラグジュアリーコレクションの重厚感ある人気ホテル。'
    },
    {
        id: 'h-6',
        name: 'サイアム Kempinski ホテル バンコク',
        star: 5,
        category: 'ホテル (星5)',
        area: 'サイアム',
        coordinate: { latitude: 13.7445, longitude: 100.5375 },
        description: 'サイアムパラゴン背後に広がる、都会のオアシスのようなリゾート型高級ホテル。'
    },

    // --- 【星4】モダン・スタイリッシュ・ビジネス観光向け ---
    {
        id: 'h-7',
        name: 'マリオット ホテル スクンビット',
        star: 4,
        category: 'ホテル (星4)',
        area: 'トンロー',
        coordinate: { latitude: 13.7235, longitude: 100.5800 },
        description: 'トンロー駅近。おしゃれな飲食店街に近く、ルーフトップバーも大人気。'
    },
    {
        id: 'h-8',
        name: 'イーステイン グランデ ホテル サトーン',
        star: 4,
        category: 'ホテル (星4)',
        area: 'サトーン',
        coordinate: { latitude: 13.7195, longitude: 100.5175 },
        description: 'スラサック駅直結でコスパが非常に高く、インフィニティプールが有名。'
    },
    {
        id: 'h-9',
        name: 'センター ポイント スクンビット 10',
        star: 4,
        category: 'ホテル (星4)',
        area: 'アソーク',
        coordinate: { latitude: 13.7385, longitude: 100.5570 },
        description: '緑豊かなベンチャキティ公園近くの落ち着いた環境にあるレジデンス風ホテル。'
    },
    {
        id: 'h-10',
        name: 'アマリ バンコク',
        star: 4,
        category: 'ホテル (星4)',
        area: 'プラトゥーナム',
        coordinate: { latitude: 13.7505, longitude: 100.5400 },
        description: 'セントラルワールド向かい。ショッピングやグルメの拠点に最適な活気あるホテル。'
    },

    // --- 【星3】コスパ重視・定番エコノミー・好立地 ---
    {
        id: 'h-11',
        name: 'ザ 93 ホテル',
        star: 3,
        category: 'ホテル (星3)',
        area: 'プラトゥーナム',
        coordinate: { latitude: 13.7530, longitude: 100.5425 },
        description: 'プラトゥーナム市場やエアポートリンク駅近くの清潔でリーズナブルなホテル。'
    },
    {
        id: 'h-12',
        name: 'イビス バンコク スクンビット 4',
        star: 3,
        category: 'ホテル (星3)',
        area: 'ナナ',
        coordinate: { latitude: 13.7410, longitude: 100.5540 },
        description: 'ナナ駅周辺で手頃に泊まれる、機能的で安心の世界的エコノミーブランド。'
    },
    {
        id: 'h-13',
        name: 'バリスリ ホテル (ViVa Rama IX)',
        star: 3,
        category: 'ホテル (星3)',
        area: 'ラマ9世',
        coordinate: { latitude: 13.7570, longitude: 100.5650 },
        description: '新都心ラマ9世エリアへのアクセスが良く、モダンで手頃なコスパホテル。'
    }
];

// --- Agoda アフィリエイト連携 ---

/**
 * AgodaアフィリエイトCID
 */
const AGODA_CID = '1974942';

/**
 * キーワードからAgodaのパートナー検索用アフィリエイトURLを生成する関数
 */
export const getAgodaSearchUrl = (keyword: string) => {
    return `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${AGODA_CID}&hl=ja&textToSearch=${encodeURIComponent(keyword)}`;
};