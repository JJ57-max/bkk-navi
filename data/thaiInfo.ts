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
        return { thaiName: "วัดสระเกศราชวรมหาวิหาร", note: "ภูเขาทอง อยู่ใกล้ภูเขาทอง" };
    } else if (lowerName.includes("トライミット") || lowerName.includes("traimit") || lowerName.includes("黄金仏")) {
        return { thaiName: "วัดไตรมิตรวิทยารามวรวิหาร", note: "อยู่ใกล้เยาวราชวงเวียนโอเดียน" };
    } else if (lowerName.includes("ベンチャマボピット") || lowerName.includes("大理石") || lowerName.includes("benchamabophit")) {
        return { thaiName: "วัดเบญจมบพิตรดุสิตวนาราม", note: "วัดหินอ่อน อยู่ใกล้ลานพระบรมรูปทรงม้า" };
    } else if (lowerName.includes("ラーチャナッダー") || lowerName.includes("rochanadda")) {
        return { thaiName: "วัดราชนัดดารามวรวิหาร", note: "โลหะปราสาท อยู่ใกล้ผ่านฟ้า" };
    }
    
    // ナイトスポット・バー・クラブ
    else if (lowerName.includes("カオサン") || lowerName.includes("khaosan")) {
        return { thaiName: "ถนนข้าวสาร", note: "อยู่ใกล้บางลำพู" };
    } else if (lowerName.includes("ダンネラミット") || lowerName.includes("dan neramit")) {
        return { thaiName: "จ๊อดแฟร์ แดนเนรมิต", note: "อยู่ใกล้ BTS ห้าแยกลาดพร้าว" };
    } else if (lowerName.includes("ジョッド") || lowerName.includes("jodd") || lowerName.includes("フェアーズ")) {
        return { thaiName: "ตลาดจ๊อดแฟร์", note: "อยู่ใกล้ MRT พระราม 9" };
    } else if (lowerName.includes("シナカリン") || lowerName.includes("srinakarin") || lowerName.includes("鉄道市場")) {
        return { thaiName: "ตลาดนัดรถไฟ ศรีนครินทร์", note: "อยู่หลังห้างซีคอนสแควร์" };
    } else if (lowerName.includes("アジアティーク") || lowerName.includes("asiatique")) {
        return { thaiName: "เอเชียทีค เดอะ ริเวอร์ฟรอนท์", note: "อยู่ริมแม่น้ำเจ้าพระยา ถนนเจริญกรุง" };
    } else if (lowerName.includes("オクターブ") || lowerName.includes("octave")) {
        return { thaiName: "ออคเทฟ รูฟท็อป บาร์", note: "โรงแรมแมริออท สุขุมวิท 57 (BTS ทองหล่อ)" };
    } else if (lowerName.includes("シロッコ") || lowerName.includes("sirocco") || lowerName.includes("sky bar")) {
        return { thaiName: "สกายบาร์ เลอบัว", note: "โรงแรมเลอบัว ถนนสีลม" };
    } else if (lowerName.includes("バーヤード") || lowerName.includes("bar yard")) {
        return { thaiName: "บาร์ ยาร์ด", note: "โรงแรมคิมป์ตัน มาลัย ถนนหลังสวน" };
    } else if (lowerName.includes("rca") || lowerName.includes("アールシーエー")) {
        return { thaiName: "RCA (รอยัล ซิตี้ แอเวนิว)", note: "ถนนพระราม 9 อยู่ใกล้ใกล้โรงพยาบาลปิยะเวท" };
    } else if (lowerName.includes("ヤワラート") || lowerName.includes("yaowarat") || lowerName.includes("中華街")) {
        return { thaiName: "ถนนเยาวราช", note: "ตลาดเก่าเยาวราช" };
    } else if (lowerName.includes("パッポン") || lowerName.includes("patpong")) {
        return { thaiName: "ถนนพัฒน์พงศ์", note: "อยู่ใกล้ BTS ศาลาแดง / MRT สีลม" };
    } else if (lowerName.includes("ソーイ・カウボーイ") || lowerName.includes("soi cowboy")) {
        return { thaiName: "ซอยคาวบอย", note: "อยู่ใกล้ BTS อโศก / MRT สุขุมวิท" };
    } else if (lowerName.includes("ナナ・プラザ") || lowerName.includes("nana plaza")) {
        return { thaiName: "นานาพลาซ่า", note: "สุขุมวิท ซอย 4" };
    } else if (lowerName.includes("マハナコン") || lowerName.includes("mahanakhon")) {
        return { thaiName: "คิง เพาเวอร์ มหานคร", note: "อยู่ที่สถานี BTS ช่องนนทรี" };
    }
    
    // ショッピングモール
    else if (lowerName.includes("mbk") || lowerName.includes("エムビーケー") || lowerName.includes("mbkセンター")) {
        return { thaiName: "มาบุญครอง (MBK Center)", note: "อยู่ใกล้สนามกีฬาแห่งชาติ (National Stadium)" };
    } else if (lowerName.includes("アイコンサイアム") || lowerName.includes("iconsiam")) {
        return { thaiName: "ไอคอนสยาม", note: "อยู่ริมแม่น้ำเจ้าพระยา ถนนเจริญนคร" };
    } else if (lowerName.includes("サイアム・パラゴン") || lowerName.includes("siam paragon") || lowerName.includes("パラゴン")) {
        return { thaiName: "สยามพารากอน", note: "อยู่ที่สถานี BTS สยาม" };
    } else if (lowerName.includes("セントラルワールド") || lowerName.includes("centralworld")) {
        return { thaiName: "เซ็นทรัลเวิลด์", note: "อยู่ใกล้สี่แยกราชประสงค์" };
    } else if (lowerName.includes("ターミナル21") || lowerName.includes("terminal 21")) {
        return { thaiName: "เทอร์มินัล 21", note: "อยู่ที่สถานี BTS อโศก" };
    } else if (lowerName.includes("エムクオーティエ") || lowerName.includes("emquartier")) {
        return { thaiName: "ดิ เอ็มควอเทียร์", note: "อยู่ที่สถานี BTS พร้อมพงษ์" };
    } else if (lowerName.includes("エムスフィア") || lowerName.includes("emsphere")) {
        return { thaiName: "ดิ เอ็มสเฟียร์", note: "อยู่ใกล้ BTS พร้อมพงษ์" };
    } else if (lowerName.includes("チャトゥチャック") || lowerName.includes("chatuchak")) {
        return { thaiName: "ตลาดนัดจตุจักร", note: "อยู่ใกล้ BTS หมอชิต" };
    } else if (lowerName.includes("ワン・バンコク") || lowerName.includes("one bangkok")) {
        return { thaiName: "วัน แบงค็อก", note: "อยู่ใกล้ MRT ลุมพินี ถนนพระราม 4" };
    }
    
    // 交通・空港
    else if (lowerName.includes("ラークラバン") || lowerName.includes("lat krabang")) {
        return { thaiName: "สถานีรถไฟลาดกระบัง", note: "แอร์พอร์ตเรลลิงก์ สถานีลาดกระบัง" };
    } else if (lowerName.includes("スワンナプーム") || lowerName.includes("suvarnabhumi")) {
        return { thaiName: "สนามบินสุวรรณภูมิ", note: "อาคารผู้โดยสารขาออก" };
    } else if (lowerName.includes("ドンムアン") || lowerName.includes("don mueang")) {
        return { thaiName: "สนามบินดอนเมือง", note: "อาคารผู้โดยสารขาออก" };
    }

    // --- 2. 自動キーワード判定（どんな未知のスポットやホテルも自動でタイ語化） ---
    else if (lowerName.includes("ホテル") || lowerName.includes("hotel") || lowerName.includes("resort") || lowerName.includes("リゾート")) {
        return { thaiName: `โรงแรม ${name}`, note: "Hotel / กรุณาไปส่งที่โรงแรมนี้" };
    } else if (lowerName.includes("病院") || lowerName.includes("hospital") || lowerName.includes("clinic") || lowerName.includes("クリニック")) {
        return { thaiName: `โรงพยาบาล ${name}`, note: "Hospital / ไปโรงพยาบาล" };
    } else if (lowerName.includes("駅") || lowerName.includes("station") || lowerName.includes("bts") || lowerName.includes("mrt")) {
        return { thaiName: `สถานี ${name}`, note: "Train Station / สถานีรถไฟฟ้า" };
    } else if (lowerName.includes("寺") || lowerName.includes("temple") || lowerName.includes("วัด")) {
        return { thaiName: `วัด ${name}`, note: "Temple / วัดในกรุงเทพฯ" };
    } else if (lowerName.includes("市場") || lowerName.includes("market") || lowerName.includes("ตลาด")) {
        return { thaiName: `ตลาด ${name}`, note: "Market / ตลาดในกรุงเทพฯ" };
    } else if (lowerName.includes("モール") || lowerName.includes("mall") || lowerName.includes("center") || lowerName.includes("センター") || lowerName.includes("plaza") || lowerName.includes("プラザ")) {
        return { thaiName: `ห้างสรรพสินค้า ${name}`, note: "Shopping Center / ศูนย์การค้า" };
    } else if (lowerName.includes("通り") || lowerName.includes("road") || lowerName.includes("soi") || lowerName.includes("ソイ")) {
        return { thaiName: `ถนน ${name}`, note: "Road / ซอยในกรุงเทพฯ" };
    }
    
    // --- 3. 完全な未知のスポットの最終フォールバック ---
    return { 
        thaiName: name, 
        note: "Bangkok, Thailand (Please drive to this location / กรุณาไปส่งที่นี่)" 
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