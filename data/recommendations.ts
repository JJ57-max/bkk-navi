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
        description:
            'アソークエリアにあるHealth Landの大型スパ。タイ古式マッサージをはじめ複数の施術メニューがあります。',
        coordinate: {
            latitude: 13.7432,
            longitude: 100.5621,
        },
    },
    {
        id: 'let_us_relax_siam',
        name: 'Let’s Relax Spa (サイアム・スクエア1)',
        category: 'massage',
        area: 'サイアム',
        description:
            'Siam Square Oneの6階にあるスパ。サイアム中心部で利用しやすく、複数のマッサージ・スパメニューがあります。',
        coordinate: {
            latitude: 13.7445,
            longitude: 100.5332,
        },
    },
    {
        id: 'asia_herb_phrom_phong',
        name: 'Asia Herb Association (スクンビット24・プロンポン)',
        category: 'massage',
        area: 'プロンポン',
        description:
            'スクンビット24にあるマッサージスパ。ハーブボールを使ったトリートメントなどを提供しています。',
        coordinate: {
            latitude: 13.7315,
            longitude: 100.5710,
        },
    },
    {
        id: 'Yunomori_Onsen',
        name: '湯の森 温泉＆スパ (スクンビット26)',
        category: 'massage',
        area: 'プロンポン',
        description:
            'スクンビット26にある日本式温浴施設とスパ。温浴設備に加えてマッサージやボディケアを利用できます。',
        coordinate: {
            latitude: 13.7225,
            longitude: 100.5680,
        },
    },
    {
        id: 'divana_divine_thonglor',
        name: 'Divana Divine Spa (トンロー)',
        category: 'massage',
        area: 'トンロー',
        description:
            'トンロー17にある一軒家スタイルのスパ。アロマ系を含む各種スパトリートメントを提供しています。',
        coordinate: {
            latitude: 13.7320,
            longitude: 100.5810,
        },
    },
    {
        id: 'health_land_sathorn',
        name: 'Health Land Sathorn (サトーン店)',
        category: 'massage',
        area: 'サトーン',
        description:
            'サトーンエリアにあるHealth Landの店舗。タイ古式マッサージをはじめ複数の施術メニューがあります。',
        coordinate: {
            latitude: 13.7230,
            longitude: 100.5315,
        },
    },
    {
        id: 'rarin_jinda_ratchadamri',
        name: 'RarinJinda Wellness Spa (ラチャダムリ)',
        category: 'massage',
        area: 'ラチャダムリ',
        description:
            'Grande Centre Point Ratchadamriの8階にあるウェルネススパ。タイマッサージやアロマ、スパトリートメントを提供しています。',
        coordinate: {
            latitude: 13.7415,
            longitude: 100.5403,
        },
    },
    {
        id: 'lets_relax_im_chinatown',
        name: 'Let’s Relax Spa (I’m Chinatown)',
        category: 'massage',
        area: 'ヤワラー・チャイナタウン',
        description:
            'I’m Chinatownの3階にあるスパ。MRTワット・マンコン駅1番出口から徒歩約170mで、足マッサージなど複数の施術メニューがあります。',
        coordinate: {
            latitude: 13.74151,
            longitude: 100.51119,
        },
    },

    // ==========================================
    // カフェ・スイーツ
    // ==========================================
    {
        id: 'after_you_siam',
        name: 'After You Dessert Cafe (サイアム・パラゴン)',
        category: 'cafe',
        area: 'サイアム',
        description:
            'タイ発のデザートカフェ。サイアム・パラゴン店では、かき氷やトーストなどのデザートを楽しめます。',
        coordinate: {
            latitude: 13.7462,
            longitude: 100.5350,
        },
    },
    {
        id: 'blue_whale_cafe',
        name: 'Blue Whale Cafe (王宮・ワットポー周辺)',
        category: 'cafe',
        area: 'ワット・ポー',
        description:
            'Maha Rat Roadにあるカフェ。王宮やワット・ポー周辺の散策時に立ち寄りやすい場所にあります。',
        coordinate: {
            latitude: 13.7442,
            longitude: 100.4930,
        },
    },
    {
        id: 'roast_thonglor',
        name: 'Roast (theCOMMONS Thonglor)',
        category: 'cafe',
        area: 'トンロー',
        description:
            'theCOMMONS Thonglor内にあるオールデイダイニング。コーヒーのほか、ブランチや食事メニューも提供しています。',
        coordinate: {
            latitude: 13.73497,
            longitude: 100.58216,
        },
    },
    {
        id: 'factory_coffee_phaya_thai',
        name: 'Factory Coffee (Phaya Thai)',
        category: 'cafe',
        area: 'パヤタイ',
        description:
            '49 Phaya Thai Roadにあるコーヒーショップ兼ロースタリー。自家焙煎コーヒーやエスプレッソ系メニューを提供しています。',
        coordinate: {
            latitude: 13.75934,
            longitude: 100.53544,
        },
    },
    {
        id: 'mother_roaster_talat_noi',
        name: 'Mother Roaster (Talat Noi)',
        category: 'cafe',
        area: 'タラートノイ',
        description:
            'タラートノイのSoi Charoen Krung 22にあるコーヒーショップ。タイ国内外の豆を使ったコーヒーを提供しています。',
        coordinate: {
            latitude: 13.73318,
            longitude: 100.51228,
        },
    },

    // ==========================================
    // グルメ・ナイトマーケット・ショッピング
    // ==========================================
    {
        id: 'jodd_fairs',
        name: 'JODD FAIRS Ratchada (ジョド・フェアーズ・ラチャダー)',
        category: 'food',
        area: 'ラチャダー',
        description:
            'ラチャダーにあるナイトマーケット。屋台料理、ドリンク、衣類・雑貨などの店舗が並びます。MRTタイランド・カルチャーセンター駅から徒歩約2分です。',
        coordinate: {
            latitude: 13.76833,
            longitude: 100.57094,
        },
    },
    {
        id: 'chinatown_yaowarat',
        name: 'ヤワラー (中華街・夜の屋台街)',
        category: 'food',
        area: 'ヤワラー',
        description:
            'バンコクの中華街として知られるヤワラー通り周辺。夜は中華料理、シーフード、スイーツなどの飲食店や屋台が並びます。',
        coordinate: {
            latitude: 13.7410,
            longitude: 100.5090,
        },
    },
    {
        id: 'nai_ek_roll_noodles',
        name: 'Nai Ek Roll Noodles (陳億粿條)',
        category: 'food',
        area: 'ヤワラー',
        description:
            'ヤワラー通り442番地にあるクイジャップ（巻いた米麺）の店。胡椒を効かせたスープや豚肉を使った料理を提供しています。',
        coordinate: {
            latitude: 13.74026,
            longitude: 100.50998,
        },
    },
    {
        id: 'go_ang_pratunam',
        name: 'Go-Ang Pratunam Chicken Rice (カオマンガイ)',
        category: 'food',
        area: 'プラトゥーナム',
        description:
            '海南鶏飯（カオマンガイ）を提供する店として知られるGo-Ang Pratunam Chicken Rice。鶏肉、ご飯、タレを組み合わせた料理が中心です。',
        coordinate: {
            latitude: 13.7505,
            longitude: 100.5392,
        },
    },
    {
        id: 'thipsamai_padthai',
        name: 'Thipsamai Pratoopee (パッタイ専門店)',
        category: 'food',
        area: '旧市街・プラトゥーピー',
        description:
            '313-315 Maha Chai Roadにあるパッタイ専門店。1939年創業の歴史を持ち、パッタイを中心に提供しています。',
        coordinate: {
            latitude: 13.7538,
            longitude: 100.5042,
        },
    },
    {
        id: 'iconsiam_sook_siam',
        name: 'ICONSIAM (SOOKSIAM)',
        category: 'food',
        area: 'クローンサーン（チャオプラヤー川沿い）',
        description:
            'ICONSIAM館内にあるタイ各地の食や文化をテーマにしたエリア。飲食店や食品・物販の店舗があります。',
        coordinate: {
            latitude: 13.7265,
            longitude: 100.5108,
        },
    },
    {
        id: 'wattana_panich_beef_noodle',
        name: 'Wattana Panich (エカマイ)',
        category: 'food',
        area: 'エカマイ',
        description:
            'エカマイ通りにあるタイ料理店。牛肉の煮込みやビーフヌードルなどを提供しています。',
        coordinate: {
            latitude: 13.7262,
            longitude: 100.5850,
        },
    },
    {
        id: 'asiatique_the_riverfront',
        name: 'Asiatique The Riverfront Destination',
        category: 'food',
        area: 'チャルンクルン（チャオプラヤー川沿い）',
        description:
            'チャオプラヤー川沿いの複合施設。レストラン、ショップ、観覧車などがあり、サトーン桟橋との無料シャトルボートも運行されています。',
        coordinate: {
            latitude: 13.7025,
            longitude: 100.5038,
        },
    },
];