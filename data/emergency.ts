// data/emergency.ts

export interface EmergencyContact {
    id: string;
    name: string;
    category: 'hospital' | 'police' | 'fire' | 'medical' | 'embassy' | 'support';
    phone: string;
    phoneLabel?: string;
    addressTh?: string;
    addressEn?: string;
    description: string;
    coordinate?: {
        latitude: number;
        longitude: number;
    };
}

export const bangkokEmergencyContacts: EmergencyContact[] = [
    {
        id: 'police_emergency',
        name: '警察・緊急通報',
        category: 'police',
        phone: '191',
        phoneLabel: '緊急通報',
        description: '事件・事故など、警察への緊急通報番号です。タイ政府の公式緊急番号です。',
    },
    {
        id: 'medical_emergency',
        name: '救急医療（タイ全国）',
        category: 'medical',
        phone: '1669',
        phoneLabel: '救急医療',
        description: '急病・重傷などで救急医療が必要な場合の全国共通番号です。',
    },
    {
        id: 'bangkok_medical_emergency',
        name: 'バンコク救急医療（Erawan Center）',
        category: 'medical',
        phone: '1646',
        phoneLabel: 'バンコク・救急医療',
        description: 'バンコク都のErawan Center（ศูนย์เอราวัณ）による24時間の健康・医療相談ホットラインです。救急医療の緊急通報は1669を利用してください。',
    },
    {
        id: 'fire_emergency',
        name: '消防・火災通報',
        category: 'fire',
        phone: '199',
        phoneLabel: '消防',
        description: '火災などで消防への通報が必要な場合の緊急番号です。',
    },
    {
        id: 'tourist_police',
        name: 'タイ観光警察 (Tourist Police)',
        category: 'police',
        phone: '1155',
        phoneLabel: '観光警察',
        description: '観光客向けの警察ホットラインです。24時間対応で、日本語を含む8言語に対応しています。スリ、詐欺、パスポート紛失など旅行中のトラブル時に利用できます。',
    },
    {
        id: 'samitivej',
        name: 'サミティベート・スクンビット病院',
        category: 'hospital',
        phone: '02-022-2222',
        phoneLabel: '代表',
        addressTh: '133 สุขุมวิท 49 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
        addressEn: '133 Sukhumvit 49, Khlong Tan Nuea, Watthana, Bangkok 10110',
        description: '日本人向け医療サービスや日本語通訳に対応する総合病院です。日本語対応の可否・時間帯は受診時に病院へ確認してください。',
        coordinate: { latitude: 13.7368, longitude: 100.5772 },
    },
    {
        id: 'bumrungrad',
        name: 'バムルンラード国際病院',
        category: 'hospital',
        phone: '02-011-3388',
        phoneLabel: '24時間日本語',
        addressTh: '33 สุขุมวิท 3 (นานาเหนือ) แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
        addressEn: '33 Sukhumvit 3 (Nana Nuea), Watthana, Bangkok 10110',
        description: '日本語コールセンターは24時間対応です。日本語サービスカウンターは通常7:00〜18:00で、18:00以降の日本語通訳は電話対応となります。',
        coordinate: { latitude: 13.7460, longitude: 100.5555 },
    },
    {
        id: 'embassy',
        name: '在タイ日本国大使館',
        category: 'embassy',
        phone: '02-207-8500',
        phoneLabel: '代表・夜間緊急',
        addressTh: '177 ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330',
        addressEn: '177 Witthayu Road, Lumphini, Pathum Wan, Bangkok 10330',
        description: 'パスポート紛失や重大な事件・事故などで日本国大使館の支援が必要な場合に連絡します。邦人援護は02-207-8502 / 02-696-3002、夜間・休館日の緊急連絡は代表番号02-207-8500 / 02-696-3000です。',
        coordinate: { latitude: 13.7373, longitude: 100.5471 },
    },
];
