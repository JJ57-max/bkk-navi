// data/thaiInfo.ts

export function getThaiInfo(name: string): { thaiName: string; note: string } {
    const lowerName = name.toLowerCase();
    
    // --- 1. 個別の主要スポット・寺院・ナイトスポット ---
    if (lowerName.includes("ワット・アルン") || lowerName.includes("暁の寺") || lowerName.includes("arun")) {
        return { thaiName: "วัดอรุณราชวราราม", note: "อยู่ริมแม่น้ำเจ้าพระยา ฝั่งธนบุรี" };
    } else if (lowerName.includes("プラケオ") || lowerName.includes("エメラルド") || lowerName.includes("phra kaew")) {
        return { thaiName: "วัดพระศรีรัตนศาสดาราม", note: "อยู่ข้างพระบรมมหาราชวัง" };
    } else if (lowerName.includes("ワット・ポー") || lowerName.includes("涅槃") || lowerName.includes("pho")) {
        return { thaiName: "วัดพระเชตุโพนวิมลมังคลาราม", note: "อยู่ใกล้ MRT สนามไชย" };
    } else if (lowerName.includes("サケット") || lowerName.includes("saket") || lowerName.includes("黄金の山")) {
        return { thaiName: "วัดสระเกศราชวรมหาวิหาร", note: "ภูเขาทอง (Golden Mount)" };
    } else if (lowerName.includes("トライミット") || lowerName.includes("traimit") || lowerName.includes("黄金仏")) {
        return { thaiName: "วัดไตรมิตรวิทยารามวรวิหาร", note: "อยู่ใกล้เยาวราชวงเวียนโอเดียน" };
    } else if (lowerName.includes("ベンチャマボピット") || lowerName.includes("大理石") || lowerName.includes("benchamabophit")) {
        return { thaiName: "วัดเบญจมบพิตรดุสิตวนาราม", note: "วัดหินอ่อน (Marble Temple)" };
    } else if (lowerName.includes("ラーチャナッダー") || lowerName.includes("rochanadda")) {
        return { thaiName: "วัดราชนัดดารามวรวิหาร", note: "โลหะปราสาท (Loha Prasat)" };
    }
    
    // ナイトスポット・バー・クラブ
    else if (lowerName.includes("カオサン") || lowerName.includes("khaosan")) {
        return { thaiName: "ถนนข้าวสาร", note: "Khaosan Road / อยู่ใกล้บางลำพู" };
    } else if (lowerName.includes("ダンネラミット") || lowerName.includes("dan neramit")) {
        return { thaiName: "จ๊อดแฟร์ แดนเนรมิต", note: "Jodd Fairs DanNeramit" };
    } else if (lowerName.includes("ジョッド") || lowerName.includes("jodd") || lowerName.includes("フェアーズ")) {
        return { thaiName: "ตลาดจ๊อดแฟร์", note: "Jodd Fairs Rama 9" };
    } else if (lowerName.includes("シナカリン") || lowerName.includes("srinakarin") || lowerName.includes("鉄道市場")) {
        return { thaiName: "ตลาดนัดรถไฟ ศรีนครินทร์", note: "Train Night Market Srinakarin" };
    } else if (lowerName.includes("アジアティーク") || lowerName.includes("asiatique")) {
        return { thaiName: "เอเชียทีค เดอะ ริเวอร์ฟรอนท์", note: "Asiatique The Riverfront" };
    } else if (lowerName.includes("オクターブ") || lowerName.includes("octave")) {
        return { thaiName: "ออคเทฟ รูฟท็อป บาร์", note: "Octave Rooftop Bar (Marriott Sukhumvit 57)" };
    } else if (lowerName.includes("シロッコ") || lowerName.includes("sirocco") || lowerName.includes("sky bar")) {
        return { thaiName: "สกายบาร์ เลอบัว", note: "Sky Bar Lebua (State Tower Silom)" };
    } else if (lowerName.includes("バーヤード") || lowerName.includes("bar yard")) {
        return { thaiName: "บาร์ ยาร์ด", note: "Bar.Yard (Kimpton Maa-Lai Bangkok)" };
    } else if (lowerName.includes("rca") || lowerName.includes("アールシーエー")) {
        return { thaiName: "RCA (รอยัล ซิตี้ แอเวนิว)", note: "Royal City Avenue (Rama 9)" };
    } else if (lowerName.includes("ヤワラート") || lowerName.includes("yaowarat") || lowerName.includes("中華街")) {
        return { thaiName: "ถนนเยาวราช", note: "Yaowarat Road (Chinatown Bangkok)" };
    } else if (lowerName.includes("パッポン") || lowerName.includes("patpong")) {
        return { thaiName: "ถนนพัฒน์พงศ์", note: "Patpong Road (Silom)" };
    } else if (lowerName.includes("ソーイ・カウボーイ") || lowerName.includes("soi cowboy")) {
        return { thaiName: "ซอยคาวบอย", note: "Soi Cowboy (Sukhumvit Asoke)" };
    } else if (lowerName.includes("ナナ・プラザ") || lowerName.includes("nana plaza")) {
        return { thaiName: "นานาพลาซ่า", note: "Nana Plaza (Sukhumvit Soi 4)" };
    } else if (lowerName.includes("マハナコン") || lowerName.includes("mahanakhon")) {
        return { thaiName: "คิง เพาเวอร์ มหานคร", note: "King Power Mahanakhon (BTS Chong Nonsi)" };
    }
    
    // ショッピングモール
    else if (lowerName.includes("mbk") || lowerName.includes("エムビーケー") || lowerName.includes("mbkセンター")) {
        return { thaiName: "มาบุญครอง (MBK Center)", note: "อยู่ใกล้สนามกีฬาแห่งชาติ (National Stadium)" };
    } else if (lowerName.includes("アイコンサイアム") || lowerName.includes("iconsiam")) {
        return { thaiName: "ไอคอนสยาม", note: "ICONSIAM (Charoen Nakhon Road)" };
    } else if (lowerName.includes("サイアム・パラゴン") || lowerName.includes("siam paragon") || lowerName.includes("パラゴン")) {
        return { thaiName: "สยามพารากอน", note: "Siam Paragon (BTS Siam)" };
    } else if (lowerName.includes("セントラルワールド") || lowerName.includes("centralworld")) {
        return { thaiName: "เซ็นทรัลเวิลด์", note: "CentralWorld (Ratchaprasong)" };
    } else if (lowerName.includes("ターミナル21") || lowerName.includes("terminal 21")) {
        return { thaiName: "เทอร์มินัล 21", note: "Terminal 21 Asok (BTS Asok)" };
    } else if (lowerName.includes("エムクオーティエ") || lowerName.includes("emquartier")) {
        return { thaiName: "ดิ เอ็มควอเทียร์", note: "EmQuartier (BTS Phrom Phong)" };
    } else if (lowerName.includes("エムスフィア") || lowerName.includes("emsphere")) {
        return { thaiName: "ดิ เอ็มสเฟียร์", note: "EMSPHERE (BTS Phrom Phong)" };
    } else if (lowerName.includes("チャトゥチャック") || lowerName.includes("chatuchak")) {
        return { thaiName: "ตลาดนัดจตุจักร", note: "Chatuchak Weekend Market (BTS Mo Chit)" };
    } else if (lowerName.includes("ワン・バンコク") || lowerName.includes("one bangkok")) {
        return { thaiName: "วัน แบงค็อก", note: "One Bangkok (MRT Lumpini)" };
    }
    
    // 交通・空港
    else if (lowerName.includes("ラークラバン") || lowerName.includes("lat krabang")) {
        return { thaiName: "สถานีรถไฟลาดกระบัง", note: "Lat Krabang Station (ARL)" };
    } else if (lowerName.includes("スワンナプーム") || lowerName.includes("suvarnabhumi")) {
        return { thaiName: "สนามบินสุวรรณภูมิ", note: "Suvarnabhumi Airport (BKK)" };
    } else if (lowerName.includes("ドンムアン") || lowerName.includes("don mueang")) {
        return { thaiName: "สนามบินดอนเมือง", note: "Don Mueang Airport (DMK)" };
    }

    // --- 2. 自動キーワード判定（汎用タイ語変換） ---
    else if (lowerName.includes("ホテル") || lowerName.includes("hotel") || lowerName.includes("resort") || lowerName.includes("リゾート")) {
        return { thaiName: `โรงแรม ${name.replace(/ホテル|Hotel|Resort|リゾート/gi, '').trim()}`, note: "Hotel in Bangkok (กรุณาไปส่งที่โรงแรมนี้)" };
    } else if (lowerName.includes("病院") || lowerName.includes("hospital") || lowerName.includes("clinic") || lowerName.includes("クリニック")) {
        return { thaiName: `โรงพยาบาล ${name.replace(/病院|Hospital|Clinic|クリニック/gi, '').trim()}`, note: "Hospital (ไปโรงพยาบาล)" };
    } else if (lowerName.includes("駅") || lowerName.includes("station") || lowerName.includes("bts") || lowerName.includes("mrt")) {
        return { thaiName: `สถานี ${name}`, note: "Train Station (สถานีรถไฟฟ้า)" };
    } else if (lowerName.includes("寺") || lowerName.includes("temple") || lowerName.includes("ワット")) {
        return { thaiName: `วัด ${name}`, note: "Buddhist Temple in Bangkok" };
    } else if (lowerName.includes("市場") || lowerName.includes("market") || lowerName.includes("市場")) {
        return { thaiName: `ตลาด ${name}`, note: "Market in Bangkok" };
    } else if (lowerName.includes("モール") || lowerName.includes("mall") || lowerName.includes("center") || lowerName.includes("センター") || lowerName.includes("plaza") || lowerName.includes("プラザ")) {
        return { thaiName: `ห้าง ${name}`, note: "Shopping Mall / Center" };
    } else if (lowerName.includes("通り") || lowerName.includes("road") || lowerName.includes("soi") || lowerName.includes("ソイ")) {
        return { thaiName: `ถนน ${name}`, note: "Road in Bangkok" };
    }
    
    // --- 3. 最終フォールバック（日本語をそのまま出さず、タイ語の目的地案内フォーマットに変換） ---
    return { 
        thaiName: `สถานที่: ${name}`, 
        note: "โปรดขับรถไปส่งที่จุดหมายนี้ในกรุงเทพฯ (Please drive to this location)" 
    };
}

export function getTips(name: string): string | null {
    if (name.includes("ワット・アルン")) { return "拝観料目安: 200バーツ。露出の多い服装は不可。"; }
    if (name.includes("プラケオ")) { return "拝観料目安: 500バーツ。服装規定が大変厳格です。"; }
    if (name.includes("オクターブ")) { return "45〜49階の360度パノラマビュー。ドレスコード有（サンダル・短パン不可）。"; }
    if (name.includes("シロッコ")) { return "映画のロケ地としても有名な超高級ルーフトップバー。ドレスコード厳格。"; }
    if (name.includes("バーヤード")) { return "トロピカルな雰囲気が人気の40階ルーフトップバー。予約推奨。"; }
    if (name.includes("ダンネラミット")) { return "お城のオブジェが目印の映え系ナイトマーケット。レトロカー展示あり。"; }
    if (name.includes("シナカリン")) { return "レトロ＆ヴィンテージ商品が充実。広大な敷地の巨大ナイトマーケット。"; }
    if (name.includes("rca")) { return "バンコク最大級のクラブ街（Route 66やONYXが有名）。パスポート必携。"; }
    if (name.includes("ヤワラート")) { return "夕方以降は屋台街に変身。フカヒレ、燕の巣、シーフードが絶品。"; }
    if (name.includes("チャトゥチャック")) { return "土日開催。1万5千以上の露店が並ぶメガマーケット。"; }
    if (name.includes("ラークラバン")) { return "スワンナプーム空港までARLで1駅（約6分）。周辺にローカル市場あり。"; }
    if (name.toLowerCase().includes("mbk")) { return "東南アジア最大級のショッピングモール。お土産探しに最適。"; }
    return null;
}