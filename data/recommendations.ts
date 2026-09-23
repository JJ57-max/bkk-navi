// data/recommendations.ts

export interface RecommendedSpot {
    id: string;
    name: string;
    category: 'massage' | 'cafe' | 'food';
    area: string;
    description: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
}

export const bangkokRecommendations: RecommendedSpot[] = [
    // ==========================================
    // マッサージ・スパ
    // ==========================================
    {
        id: 'health_land_asoke',
        name: 'Health Land Asoke (ヘルスランド)',
        category: 'massage',
        area: 'アソーク',
        description: '清潔で広々とした高級感のある有名スパチェーン。タイ古式マッサージが手頃な価格で受けられます。',
        coordinate: { latitude: 13.7432, longitude: 100.5621 }
    },
    {
        id: 'let_us_relax_siam',
        name: 'Let’s Relax Spa (サイアム・スクエア1)',
        category: 'massage',
        area: 'サイアム',
        description: 'アクセスの良い立地で極上のリラクゼーションを提供してくれる大人気スパ。',
        coordinate: { latitude: 13.7445, longitude: 100.5332 }
    },
    {
        id: 'asia_herb_phrom_phong',
        name: 'Asia Herb Association (プロンポン店)',
        category: 'massage',
        area: 'プロンポン',
        description: '日本人観光客に絶大な支持を誇る、自家製ハーブボールを使ったマッサージが人気のサロン。',
        coordinate: { latitude: 13.7315, longitude: 100.5710 }
    },
    {
        id: 'Yunomori_Onsen',
        name: '湯の森 温泉＆スパ (ソイ26)',
        category: 'massage',
        area: 'プロンポン',
        description: 'バンコクにいながら本格的な日本の温泉や露天風呂、極上マッサージが楽しめる癒やしスポット。',
        coordinate: { latitude: 13.7225, longitude: 100.5680 }
    },
    {
        id: 'divana_divine_thonglor',
        name: 'Divana Divine Spa (トンロー)',
        category: 'massage',
        area: 'トンロー',
        description: '緑豊かな一軒家で極上のアロママッサージやハーバルスパが体験できるラグジュアリー店。',
        coordinate: { latitude: 13.7320, longitude: 100.5810 }
    },
    {
        id: 'health_land_sathorn',
        name: 'Health Land Sathorn (サトーン店)',
        category: 'massage',
        area: 'サトーン',
        description: 'コロニアル様式の美しい建築が特徴の大型店舗。落ち着いた環境で本格的な施術が受けられます。',
        coordinate: { latitude: 13.7230, longitude: 100.5315 }
    },
    {
        id: 'rarin_jinda_gaysorn',
        name: 'Rarin Jinda Wellness Spa (ゲソーンタワー)',
        category: 'massage',
        area: 'チットロム',
        description: '高級デパート内にあり、最新のウェルネス技術と伝統的なタイマッサージを融合させた極上スパ。',
        coordinate: { latitude: 13.7440, longitude: 100.5420 }
    },
    {
        id: 'urban_retreat_asoke',
        name: 'Urban Retreat Spa (アソーク店)',
        category: 'massage',
        area: 'アソーク',
        description: '駅近でリーズナブルながら清潔感があり、アロママッサージやスクラブが評判の隠れ家的サロン。',
        coordinate: { latitude: 13.7378, longitude: 100.5605 }
    },

    // ==========================================
    // カフェ・スイーツ
    // ==========================================
    {
        id: 'after_you_siam',
        name: 'After You Dessert Cafe (パラゴン店)',
        category: 'cafe',
        area: 'サイアム',
        description: 'タイで大人気の絶品かき氷やハニートーストが楽しめる大行列の有名スイーツカフェ。',
        coordinate: { latitude: 13.7462, longitude: 100.5350 }
    },
    {
        id: 'blue_whale_cafe',
        name: 'Blue Whale Cafe (王宮・寺院エリア)',
        category: 'cafe',
        area: 'ワット・ポー',
        description: '青いバタフライピーラテがSNSで大人気の、おしゃれで落ち着いた隠れ家カフェ。',
        coordinate: { latitude: 13.7442, longitude: 100.4930 }
    },
    {
        id: 'roast_thonglor',
        name: 'Roast (The Commons トンロー)',
        category: 'cafe',
        area: 'トンロー',
        description: 'おしゃれなオープンエア空間で、こだわりの自家焙煎コーヒーや絶品ブランチが楽しめる名店。',
        coordinate: { latitude: 13.7345, longitude: 100.5822 }
    },
    {
        id: 'factory_coffee_phaya_thai',
        name: 'Factory Coffee (パヤタイ)',
        category: 'cafe',
        area: 'パヤタイ',
        description: '数々の世界バリスタチャンピオンシップで受賞した、バンコク最高峰の本格エスプレッソバー。',
        coordinate: { latitude: 13.7562, longitude: 100.5358 }
    },
    {
        id: 'hands_and_heart_ari',
        name: 'Hands and Heart (アーリー)',
        category: 'cafe',
        area: 'アーリー',
        description: '白を基調としたミニマルな空間で、こだわりのドリップコーヒーをしっとりと味わえる人気カフェ。',
        coordinate: { latitude: 13.7820, longitude: 100.5440 }
    },
    {
        id: 'intr_cnx_sathorn',
        name: 'ORGANIC SUPPLY (サトーン・ソイ)',
        category: 'cafe',
        area: 'サトーン',
        description: 'オーガニック食材にこだわったスムージーやヘルシーなスイーツが楽しめる、緑に囲まれたカフェ。',
        coordinate: { latitude: 13.7190, longitude: 100.5370 }
    },
    {
        id: 'li_life_cafe_ekamai',
        name: 'Heals Cafe & Workspace (エカマイ)',
        category: 'cafe',
        area: 'エカマイ',
        description: '静かな住宅街に佇む、木の温もりを感じる落ち着いた雰囲気の隠れ家カフェ。',
        coordinate: { latitude: 13.7280, longitude: 100.5875 }
    },
    {
        id: 'ici_bkk_sathorn',
        name: 'ici.bkk (サトーン)',
        category: 'cafe',
        area: 'サトーン',
        description: 'まるで芸術作品のような美しすぎるフレンチデザートと写真映えする空間が人気のパティスリーカフェ。',
        coordinate: { latitude: 13.7198, longitude: 100.5285 }
    },

    // ==========================================
    // グルメ・ナイトマーケット・ショッピング
    // ==========================================
    {
        id: 'jodd_fairs',
        name: 'JODD FAIRS (ジョド・フェアーズ)',
        category: 'food',
        area: 'ラマ9世',
        description: '活気あふれる人気のナイトマーケット。巨大な豚の背骨タワーや多彩な屋台グルメが楽しめます。',
        coordinate: { latitude: 13.7570, longitude: 100.5665 }
    },
    {
        id: 'chinatown_yaowarat',
        name: 'ヤワラー (中華街・夜の屋台街)',
        category: 'food',
        area: 'フワランポーン',
        description: '夜になるとネオンが輝き、フカヒレや絶品シーフード、中華スイーツの屋台が軒を連ねる美食街。',
        coordinate: { latitude: 13.7410, longitude: 100.5090 }
    },
    {
        id: 'go_ang_pratunam',
        name: 'ピンクのカオマンガイ (ガイトーン・プラトゥーナム)',
        category: 'food',
        area: 'プラトゥーナム',
        description: '言わずと知れた超有名店。ジューシーな鶏肉と特製ピリ辛ダレが絶品の絶品カオマンガイ。',
        coordinate: { latitude: 13.7505, longitude: 100.5392 }
    },
    {
        id: 'thipsamai_padthai',
        name: 'ティップサマイ (パッタイ専門店)',
        category: 'food',
        area: '旧市街・民主記念塔',
        description: '「タイで一番美味しいパッタイ」と称される老舗行列店。卵で包まれた元祖エビパッタイは必食。',
        coordinate: { latitude: 13.7538, longitude: 100.5042 }
    },
    {
        id: 'iconsiam_sook_siam',
        name: 'アイコンサイアム (SOOKSIAM)',
        category: 'food',
        area: 'トンブリー（チャオプラヤー川沿い）',
        description: '超巨大ショッピングモール内の、屋内型水上マーケットを模した一大フードテーマパーク。',
        coordinate: { latitude: 13.7265, longitude: 100.5108 }
    },
    {
        id: 'wattana_panich_beef_noodle',
        name: 'ワッタナー・パーニット (エカマイ)',
        category: 'food',
        area: 'エカマイ',
        description: '何十年も継ぎ足されてきた伝説のスープが絶品の、牛肉ビーフヌードル（クッティオ・ヌア）の名店。',
        coordinate: { latitude: 13.7262, longitude: 100.5850 }
    },
    {
        id: 'asiatique_the_riverfront',
        name: 'アジアティーク・ザ・リバーフロント',
        category: 'food',
        area: 'チャルンクルン通り',
        description: 'チャオプラヤー川沿いの倉庫街を改装した、夜景と観覧車、グルメが楽しめるおしゃれなナイトスポット。',
        coordinate: { latitude: 13.7025, longitude: 100.5038 }
    },
    {
        id: 'baan_ice_thonglor',
        name: 'Baan Ice (トンロー店)',
        category: 'food',
        area: 'トンロー',
        description: '南タイの本格的でスパイシーな家庭料理を落ち着いたモダンな空間で味わえる大人気レストラン。',
        coordinate: { latitude: 13.7350, longitude: 100.5795 }
    }
];