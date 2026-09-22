// data/emergency.ts

export interface EmergencyContact {
    id: string;
    name: string;
    category: 'hospital' | 'police' | 'embassy' | 'support';
    phone: string;
    addressTh: string;
    addressEn: string;
    description: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
}

export const bangkokEmergencyContacts: EmergencyContact[] = [
    {
        id: 'samitivej',
        name: 'サミティベート・スクンビット病院（日本語通訳常駐）',
        category: 'hospital',
        phone: '02-022-2222',
        addressTh: '133 Soi Sukhumvit 49, Klongtan Nua, Wattana, Bangkok 10110',
        addressEn: '133 Soi Sukhumvit 49, Klongtan Nua, Wattana, Bangkok 10110',
        description: '日本人駐在員や旅行者が最も多く利用する、日本語サポートが非常に手厚い総合病院です。',
        coordinate: { latitude: 13.7368, longitude: 100.5772 }
    },
    {
        id: 'bumrungrad',
        name: 'バムルンラード国際病院',
        category: 'hospital',
        phone: '02-066-8888',
        addressTh: '33 Sukhumvit Soi 3 (Nana Nuea), Wattana, Bangkok 10110',
        addressEn: '33 Sukhumvit Soi 3 (Nana Nuea), Wattana, Bangkok 10110',
        description: '世界中から患者が集まる世界最高水準の大規模国際病院。日本語通訳スタッフも常駐しています。',
        coordinate: { latitude: 13.7460, longitude: 100.5555 }
    },
    {
        id: 'tourist_police',
        name: 'タイ観光警察 (Tourist Police)',
        category: 'police',
        phone: '1155',
        addressTh: 'タイ全国対応 (24時間英語・日本語対応コールセンターあり)',
        addressEn: 'Nationwide (24/7 Hotline with English support)',
        description: 'スリやぼったくり、パスポート紛失など、観光客のトラブルを専門に扱う警察ホットラインです。',
        coordinate: { latitude: 13.7440, longitude: 100.5210 }
    },
    {
        id: 'embassy',
        name: '在タイ日本国大使館',
        category: 'embassy',
        phone: '02-207-8500',
        addressTh: '177 Witthayu Rd, Lumphini, Pathum Wan, Bangkok 10330',
        addressEn: '177 Witthayu Rd, Lumphini, Pathum Wan, Bangkok 10330',
        description: 'パスポートの紛失（帰国用渡航書の発給）や重大な事件・事故の際に連絡・訪問します。',
        coordinate: { latitude: 13.7373, longitude: 100.5471 }
    }
];