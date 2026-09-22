// data/stations.ts

export interface Station {
    name: string;
    line: 'BTS' | 'MRT' | 'ARL' | 'SRT' | 'Boat' | 'Bus';
    coordinate: {
        latitude: number;
        longitude: number;
    };
}

export const allBangkokStations: Station[] = [
    // ==========================================
    // 1. タイ国鉄 (SRT) - 地方・長距離路線（拡張版）
    // ==========================================
    // 北本線（チェンマイ方面）
    { name: "クルンテピワット中央駅 (バンスー)", line: "SRT", coordinate: { latitude: 13.8056, longitude: 100.5401 } },
    { name: "アユタヤ駅", line: "SRT", coordinate: { latitude: 14.3541, longitude: 100.5786 } },
    { name: "ロッブリー駅", line: "SRT", coordinate: { latitude: 14.7997, longitude: 100.6120 } },
    { name: "ピッサヌローク駅", line: "SRT", coordinate: { latitude: 16.8217, longitude: 100.2631 } },
    { name: "ランパーン駅", line: "SRT", coordinate: { latitude: 18.2905, longitude: 99.5019 } },
    { name: "チェンマイ駅", line: "SRT", coordinate: { latitude: 18.7883, longitude: 99.0117 } },

    // 東北本線（コラート・ノンカイ方面）
    { name: "チャチュンサオ駅", line: "SRT", coordinate: { latitude: 13.6903, longitude: 101.0778 } },
    { name: "パクチョン駅 (カオヤイ近郊)", line: "SRT", coordinate: { latitude: 14.7061, longitude: 101.4153 } },
    { name: "ナコンラチャシマ駅 (コラート)", line: "SRT", coordinate: { latitude: 14.9799, longitude: 102.1030 } },
    { name: "コンケン駅", line: "SRT", coordinate: { latitude: 16.4322, longitude: 102.8236 } },
    { name: "ウドンタニ駅", line: "SRT", coordinate: { latitude: 17.4083, longitude: 102.8028 } },
    { name: "ノンカイ駅 (ラオス国境)", line: "SRT", coordinate: { latitude: 17.8825, longitude: 102.7431 } },
    { name: "ウボンラチャタニ駅", line: "SRT", coordinate: { latitude: 15.2289, longitude: 104.8583 } },

    // 東本線（パタヤ方面）
    { name: "チョンブリー駅", line: "SRT", coordinate: { latitude: 13.3611, longitude: 100.9847 } },
    { name: "シラチャ駅", line: "SRT", coordinate: { latitude: 13.1675, longitude: 100.9389 } },
    { name: "パタヤ駅", line: "SRT", coordinate: { latitude: 12.9364, longitude: 100.9083 } },
    { name: "パタヤใต้ (南パタヤ/プール・ター・ルアン)", line: "SRT", coordinate: { latitude: 12.6711, longitude: 100.9578 } },

    // 南本線・カンチャナブリー方面（泰緬鉄道ルート）
    { name: "フワランポーン駅 (国鉄旧中央駅)", line: "SRT", coordinate: { latitude: 13.7397, longitude: 100.5164 } },
    { name: "トンブリー駅 (西方路線起点)", line: "SRT", coordinate: { latitude: 13.7550, longitude: 100.4850 } },
    { name: "ナコンパトム駅", line: "SRT", coordinate: { latitude: 13.8197, longitude: 100.0622 } },
    { name: "カンチャナブリー駅", line: "SRT", coordinate: { latitude: 14.0228, longitude: 99.5328 } },
    { name: "クウェー川橋駅", line: "SRT", coordinate: { latitude: 14.0431, longitude: 99.5033 } },
    { name: "ナムトック駅 (終点/滝)", line: "SRT", coordinate: { latitude: 14.2383, longitude: 99.1350 } },
    { name: "ホアヒン駅", line: "SRT", coordinate: { latitude: 12.5647, longitude: 99.9572 } },
    { name: "チュムポーン駅", line: "SRT", coordinate: { latitude: 10.4942, longitude: 99.1794 } },
    { name: "スラートターニー駅 (サムイ島玄関口)", line: "SRT", coordinate: { latitude: 9.1353, longitude: 99.3361 } },
    { name: "ハジャイ駅", line: "SRT", coordinate: { latitude: 7.0083, longitude: 100.4739 } },

    // ==========================================
    // 2. バンコク都市圏 (BTS スクンビット線)
    // ==========================================
    { name: "クーコット", line: "BTS", coordinate: { latitude: 13.9525, longitude: 100.6386 } },
    { name: "タイ王国空軍博物館", line: "BTS", coordinate: { latitude: 13.9272, longitude: 100.6236 } },
    { name: "インチャルーン市場", line: "BTS", coordinate: { latitude: 13.8964, longitude: 100.6056 } },
    { name: "ワット・プラ・シー・マハータート", line: "BTS", coordinate: { latitude: 13.8733, longitude: 100.5950 } },
    { name: "モーチット", line: "BTS", coordinate: { latitude: 13.8016, longitude: 100.5539 } },
    { name: "サイアム", line: "BTS", coordinate: { latitude: 13.7460, longitude: 100.5347 } },
    { name: "アソーク", line: "BTS", coordinate: { latitude: 13.7377, longitude: 100.5604 } },
    { name: "プロンポン", line: "BTS", coordinate: { latitude: 13.7312, longitude: 100.5708 } },
    { name: "トンロー", line: "BTS", coordinate: { latitude: 13.7244, longitude: 100.5786 } },
    { name: "エカマイ", line: "BTS", coordinate: { latitude: 13.7189, longitude: 100.5858 } },
    { name: "オンヌット", line: "BTS", coordinate: { latitude: 13.7042, longitude: 100.6022 } },
    { name: "バンナー", line: "BTS", coordinate: { latitude: 13.6683, longitude: 100.6069 } },
    { name: "ベーリング", line: "BTS", coordinate: { latitude: 13.6586, longitude: 100.6094 } },
    { name: "ケーケー", line: "BTS", coordinate: { latitude: 13.5997, longitude: 100.5986 } },

    // ==========================================
    // 3. バンコク都市圏 (BTS シロム線)
    // ==========================================
    { name: "ナショナルスタジアム", line: "BTS", coordinate: { latitude: 13.7461, longitude: 100.5292 } },
    { name: "ラチャダムリ", line: "BTS", coordinate: { latitude: 13.7428, longitude: 100.5408 } },
    { name: "サラデーン", line: "BTS", coordinate: { latitude: 13.7283, longitude: 100.5339 } },
    { name: "チョンノンシー", line: "BTS", coordinate: { latitude: 13.7222, longitude: 100.5328 } },
    { name: "サパーンタクシン", line: "BTS", coordinate: { latitude: 13.7189, longitude: 100.5144 } },
    { name: "クルントンブリー", line: "BTS", coordinate: { latitude: 13.7214, longitude: 100.5019 } },
    { name: "ウォンワヤン", line: "BTS", coordinate: { latitude: 13.7161, longitude: 100.4939 } },
    { name: "タートル", line: "BTS", coordinate: { latitude: 13.7019, longitude: 100.4639 } },
    { name: "バンワー", line: "BTS", coordinate: { latitude: 13.7153, longitude: 100.4422 } },

    // ==========================================
    // 4. バンコク都市圏 (MRT ブルー線・パープル線)
    // ==========================================
    { name: "チャトゥチャック公園", line: "MRT", coordinate: { latitude: 13.8031, longitude: 100.5531 } },
    { name: "ラマ9世", line: "MRT", coordinate: { latitude: 13.7578, longitude: 100.5653 } },
    { name: "スクンビット", line: "MRT", coordinate: { latitude: 13.7375, longitude: 100.5600 } },
    { name: "シーロム", line: "MRT", coordinate: { latitude: 13.7281, longitude: 100.5361 } },
    { name: "フワランポーン (地下鉄)", line: "MRT", coordinate: { latitude: 13.7392, longitude: 100.5167 } },
    { name: "サンパウ", line: "MRT", coordinate: { latitude: 13.7439, longitude: 100.5061 } },
    { name: "サナムチャイ", line: "MRT", coordinate: { latitude: 13.7444, longitude: 100.4931 } },
    { name: "チャラン13", line: "MRT", coordinate: { latitude: 13.7297, longitude: 100.4686 } },

    // ==========================================
    // 5. エアポートレイルリンク (ARL)
    // ==========================================
    { name: "パヤタイ (ARL)", line: "ARL", coordinate: { latitude: 13.7558, longitude: 100.5342 } },
    { name: "マッカサン", line: "ARL", coordinate: { latitude: 13.7497, longitude: 100.5650 } },
    { name: "ラムカムヘン", line: "ARL", coordinate: { latitude: 13.7431, longitude: 100.6033 } },
    { name: "フアマーク", line: "ARL", coordinate: { latitude: 13.7381, longitude: 100.6406 } },
    { name: "バーン・タップチャーン", line: "ARL", coordinate: { latitude: 13.7303, longitude: 100.6822 } },
    { name: "ラートクラバン", line: "ARL", coordinate: { latitude: 13.7236, longitude: 100.7208 } },
    { name: "スワンナプーム空港", line: "ARL", coordinate: { latitude: 13.6900, longitude: 100.7501 } },

    // ==========================================
    // 6. チャオプラヤー・エクスプレス（船）
    // ==========================================
    { name: "サトアン船着場 (スパター)", line: "Boat", coordinate: { latitude: 13.7194, longitude: 100.5122 } },
    { name: "ワット・ポー船着場 (タ・ティアン)", line: "Boat", coordinate: { latitude: 13.7444, longitude: 100.4908 } },
    { name: "王宮船着場 (タ・チャチャン)", line: "Boat", coordinate: { latitude: 13.7503, longitude: 100.4883 } },
    { name: "ワンラン船着場 (シリラート)", line: "Boat", coordinate: { latitude: 13.7589, longitude: 100.4867 } },
    { name: "ノンタブリー船着場 (北部終点)", line: "Boat", coordinate: { latitude: 13.8292, longitude: 100.4950 } }
];