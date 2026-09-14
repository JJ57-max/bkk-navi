// data/guides.ts

export interface ExchangeShop {
    id: string;
    name: string;
    rateRank: '最高レート' | '高レート' | '標準';
    area: string;
    description: string;
    coordinate: {
        lat: number;
        lng: number;
    };
    affiliateUrl?: string; // スポンサー・パートナー用リンク
}

export const bangkokExchangeShops: ExchangeShop[] = [
    {
        id: 'superrich-thonglor',
        name: 'SuperRich Thailand (直営・本店/主要支店)',
        rateRank: '最高レート',
        area: 'チットロム・ラチャダムリ周辺',
        description: 'タイ両替の代名詞。日本円からタイバーツへの換算レートが最も良いことで有名です。パスポート持参必須。',
        coordinate: { lat: 13.7483, lng: 100.5401 },
        affiliateUrl: 'https://www.superrichthailand.com'
    },
    {
        id: 'superrich-green',
        name: 'SuperRich (緑 / ヴェルト)',
        rateRank: '最高レート',
        area: 'サイアム・各大駅構内',
        description: 'オレンジのSuperRichと並び称される高レート両替所。BTS駅チカにも多く展開しており非常に便利。',
        coordinate: { lat: 13.7441, lng: 100.5350 },
        affiliateUrl: 'https://www.superrichsure.com'
    },
    {
        id: 'vallex',
        name: 'Value Plus Exchange',
        rateRank: '高レート',
        area: 'アソーク駅直結 (ターミナル21近郊)',
        description: 'スクンビットエリアで高レートを狙うならここ。アクセス抜群で観光客に大人気。',
        coordinate: { lat: 13.7378, lng: 100.5602 },
    },
    {
        id: 'siam-exchange',
        name: 'Siam Exchange',
        rateRank: '最高レート',
        area: 'ナショナルスタジアム近郊',
        description: 'ナショナルスタジアム駅から徒歩圏内。本店に匹敵する高レートを提供。',
        coordinate: { lat: 13.7445, lng: 100.5285 },
    }
];