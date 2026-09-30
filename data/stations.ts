export type StationLine =

    | "BTS"

    | "MRT"

    | "ARL"

    | "Gold"

    | "Pink"

    | "Yellow"

    | "Purple"

    | "Red"

    | "SRT"

    | "Boat"

    | "Bus";



export interface Station {

    name: string;

    /**
     * Localized display names.
     *
     * `name` remains the canonical source name.
     * UI display priority:
     * nameJa -> nameEn -> name
     */
    nameEn?: string;
    nameJa?: string;

    line: StationLine;

    route?: string;

    stationCode?: string;

    serviceStatus?: "active" | "limited" | "inactive";
    serviceNote?: string;
    serviceDataDate?: string;

    coordinate: {

        latitude: number;

        longitude: number;

    };

}



/**

 * Bangkok public transportation stations / piers.

 *

 * Rail station coordinates are based primarily on the current

 * Department of Rail Transport (DRT) open data and cross-checked

 * against current operator / MRTA information where necessary.

 *

 * NOTE:

 * - Only verified pier coordinates are included for now.

 * - Do not add guessed coordinates for piers.

 */



export const allBangkokStations: Station[] = [

    // =========================================================

    // BTS Sukhumvit Line

    // =========================================================



    {

        name: "サイアム",

        line: "BTS",

        route: "Sukhumvit Line / Silom Line",

        stationCode: "CEN",

        coordinate: { latitude: 13.74561143, longitude: 100.5341474 },

    },

    {

        name: "ラーチャテーウィー",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N1",

        coordinate: { latitude: 13.75207562, longitude: 100.5315714 },

    },

    {

        name: "パヤータイ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N2",

        coordinate: { latitude: 13.75700979, longitude: 100.5338066 },

    },

    {

        name: "ビクトリー・モニュメント",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N3",

        coordinate: { latitude: 13.7628712, longitude: 100.5370477 },

    },

    {

        name: "サナームパオ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N4",

        coordinate: { latitude: 13.77264449, longitude: 100.5421253 },

    },

    {

        name: "アーリー",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N5",

        coordinate: { latitude: 13.77985028, longitude: 100.5446531 },

    },

    {

        name: "サパーン・クワイ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N7",

        coordinate: { latitude: 13.79380459, longitude: 100.5497505 },

    },

    {

        name: "モーチット",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N8",

        coordinate: { latitude: 13.8027276, longitude: 100.5538694 },

    },

    {

        name: "ハーイェーク・ラートプラオ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N9",

        coordinate: { latitude: 13.81641185, longitude: 100.5619534 },

    },

    {

        name: "パホンヨーティン24",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N10",

        coordinate: { latitude: 13.82403179, longitude: 100.5663319 },

    },

    {

        name: "ラチャヨーティン",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N11",

        coordinate: { latitude: 13.82976184, longitude: 100.569629 },

    },

    {

        name: "セーナーニコム",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N12",

        coordinate: { latitude: 13.83635368, longitude: 100.573518 },

    },

    {

        name: "カセサート大学",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N13",

        coordinate: { latitude: 13.84237073, longitude: 100.577111 },

    },

    {

        name: "王立森林局",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N14",

        coordinate: { latitude: 13.85039048, longitude: 100.5817693 },

    },

    {

        name: "バンブア",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N15",

        coordinate: { latitude: 13.85597345, longitude: 100.5851115 },

    },

    {

        name: "第11歩兵連隊",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N16",

        coordinate: { latitude: 13.86755996, longitude: 100.5918953 },

    },

    {

        name: "ワット・プラシーマハタート",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N17",

        coordinate: { latitude: 13.87534903, longitude: 100.596748 },

    },

    {

        name: "パホンヨーティン59",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N18",

        coordinate: { latitude: 13.88259699, longitude: 100.600773 },

    },

    {

        name: "サーイユット",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N19",

        coordinate: { latitude: 13.88844049, longitude: 100.604197 },

    },

    {

        name: "サパーンマイ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N20",

        coordinate: { latitude: 13.89660637, longitude: 100.6090666 },

    },

    {

        name: "プミポン・アドゥンヤデート病院",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N21",

        coordinate: { latitude: 13.91070517, longitude: 100.6173433 },

    },

    {

        name: "タイ空軍博物館",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N22",

        coordinate: { latitude: 13.91794885, longitude: 100.6216541 },

    },

    {

        name: "ヤーク・コー・ポー・オー",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N23",

        coordinate: { latitude: 13.92502233, longitude: 100.6259235 },

    },

    {

        name: "クーコット",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "N24",

        coordinate: { latitude: 13.93235302, longitude: 100.6466286 },

    },



    {

        name: "チットロム",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E1",

        coordinate: { latitude: 13.74408069, longitude: 100.5430873 },

    },

    {

        name: "プルンチット",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E2",

        coordinate: { latitude: 13.74305844, longitude: 100.5490357 },

    },

    {

        name: "ナナ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E3",

        coordinate: { latitude: 13.74053723, longitude: 100.5554754 },

    },

    {

        name: "アソーク",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E4",

        coordinate: { latitude: 13.73704787, longitude: 100.5603549 },

    },

    {

        name: "プロンポン",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E5",

        coordinate: { latitude: 13.73045553, longitude: 100.5696996 },

    },

    {

        name: "トンロー",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E6",

        coordinate: { latitude: 13.72435715, longitude: 100.5784291 },

    },

    {

        name: "エカマイ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E7",

        coordinate: { latitude: 13.71955685, longitude: 100.5850876 },

    },

    {

        name: "プラカノン",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E8",

        coordinate: { latitude: 13.71523481, longitude: 100.5912765 },

    },

    {

        name: "オンヌット",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E9",

        coordinate: { latitude: 13.70563696, longitude: 100.6010277 },

    },

    {

        name: "バーンチャーク",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E10",

        coordinate: { latitude: 13.69673557, longitude: 100.6052246 },

    },

    {

        name: "プンナウィティ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E11",

        coordinate: { latitude: 13.68924559, longitude: 100.6090509 },

    },

    {

        name: "ウドムスック",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E12",

        coordinate: { latitude: 13.67991899, longitude: 100.6095904 },

    },

    {

        name: "バンナー",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E13",

        coordinate: { latitude: 13.66814729, longitude: 100.6047186 },

    },

    {

        name: "ベーリング",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E14",

        coordinate: { latitude: 13.66133924, longitude: 100.6019284 },

    },

    {

        name: "サムローン",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E15",

        coordinate: { latitude: 13.64618067, longitude: 100.5955061 },

    },

    {

        name: "プーチャオ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E16",

        coordinate: { latitude: 13.63724629, longitude: 100.5920546 },

    },

    {

        name: "チャーン・エラワン",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E17",

        coordinate: { latitude: 13.62153309, longitude: 100.5902021 },

    },

    {

        name: "ロイヤル・タイ・ネイバル・アカデミー",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E18",

        coordinate: { latitude: 13.60845311, longitude: 100.5949343 },

    },

    {

        name: "パークナム",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E19",

        coordinate: { latitude: 13.60211662, longitude: 100.5971519 },

    },

    {

        name: "シーナカリン",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E20",

        coordinate: { latitude: 13.59205817, longitude: 100.608983 },

    },

    {

        name: "プレークサ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E21",

        coordinate: { latitude: 13.58432495, longitude: 100.607975 },

    },

    {

        name: "サイルアット",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E22",

        coordinate: { latitude: 13.57771156, longitude: 100.6054492 },

    },

    {

        name: "ケーハ",

        line: "BTS",

        route: "Sukhumvit Line",

        stationCode: "E23",

        coordinate: { latitude: 13.56766421, longitude: 100.6077781 },

    },



    // =========================================================

    // BTS Silom Line

    // =========================================================



    {

        name: "国立競技場",

        line: "BTS",

        route: "Silom Line",

        stationCode: "W1",

        coordinate: { latitude: 13.7467374, longitude: 100.529049 },

    },

    {

        name: "ラーチャダムリ",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S1",

        coordinate: { latitude: 13.73945684, longitude: 100.5394348 },

    },

    {

        name: "サラデーン",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S2",

        coordinate: { latitude: 13.72845579, longitude: 100.5340886 },

    },

    {

        name: "チョンノンシー",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S3",

        coordinate: { latitude: 13.7237111, longitude: 100.5294617 },

    },

    {

        name: "セントルイス",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S4",

        coordinate: { latitude: 13.72092969, longitude: 100.5268975 },

    },

    {

        name: "スラサック",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S5",

        coordinate: { latitude: 13.71921117, longitude: 100.5214964 },

    },

    {

        name: "サパーンタクシン",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S6",

        coordinate: { latitude: 13.71881539, longitude: 100.5141108 },

    },

    {

        name: "クルン・トンブリー",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S7",

        coordinate: { latitude: 13.72084312, longitude: 100.5027149 },

    },

    {

        name: "ウォンウィアン・ヤイ",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S8",

        coordinate: { latitude: 13.72108781, longitude: 100.4953148 },

    },

    {

        name: "ポーニミット",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S9",

        coordinate: { latitude: 13.71925298, longitude: 100.4860682 },

    },

    {

        name: "タラートプルー",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S10",

        coordinate: { latitude: 13.71422607, longitude: 100.4768081 },

    },

    {

        name: "ウタカート",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S11",

        coordinate: { latitude: 13.71307476, longitude: 100.4689102 },

    },

    {

        name: "バーンワー",

        line: "BTS",

        route: "Silom Line",

        stationCode: "S12",

        coordinate: { latitude: 13.72052948, longitude: 100.457791 },

    },



    // =========================================================

    // BTS Gold Line

    // =========================================================



    {

        name: "クルン・トンブリー",

        line: "Gold",

        route: "Gold Line",

        stationCode: "G1",

        coordinate: { latitude: 13.72111862, longitude: 100.5036484 },

    },

    {

        name: "チャルンナコン",

        line: "Gold",

        route: "Gold Line",

        stationCode: "G2",

        coordinate: { latitude: 13.72652947, longitude: 100.5089743 },

    },

    {

        name: "クローンサーン",

        line: "Gold",

        route: "Gold Line",

        stationCode: "G3",

        coordinate: { latitude: 13.73045608, longitude: 100.5076094 },

    },



    // =========================================================

    // MRT Blue Line

    // =========================================================



    {

        name: "タープラ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL01",

        coordinate: { latitude: 13.72969778, longitude: 100.4741528 },

    },

    {

        name: "チャラン13",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL02",

        coordinate: { latitude: 13.7403604, longitude: 100.4706533 },

    },

    {

        name: "ファイチャイ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL03",

        coordinate: { latitude: 13.75513012, longitude: 100.469225 },

    },

    {

        name: "バンクンノン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL04",

        coordinate: { latitude: 13.76322858, longitude: 100.4732075 },

    },

    {

        name: "バンイーカン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL05",

        coordinate: { latitude: 13.77753717, longitude: 100.485243 },

    },

    {

        name: "シリントーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL06",

        coordinate: { latitude: 13.78406434, longitude: 100.4934785 },

    },

    {

        name: "バンプラット",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL07",

        coordinate: { latitude: 13.79255197, longitude: 100.5050425 },

    },

    {

        name: "バンオー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL08",

        coordinate: { latitude: 13.79901673, longitude: 100.5096999 },

    },

    {

        name: "バンポー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL09",

        coordinate: { latitude: 13.80646721, longitude: 100.5210402 },

    },

    {

        name: "タオプーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL10",

        coordinate: { latitude: 13.80621259, longitude: 100.530759 },

    },

    {

        name: "バンスー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL11",

        coordinate: { latitude: 13.80312385, longitude: 100.5391893 },

    },

    {

        name: "カムペーンペット",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL12",

        coordinate: { latitude: 13.79809541, longitude: 100.5475954 },

    },

    {

        name: "チャトゥチャック公園",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL13",

        coordinate: { latitude: 13.80213175, longitude: 100.5530476 },

    },

    {

        name: "パホンヨーティン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL14",

        coordinate: { latitude: 13.81434869, longitude: 100.5601448 },

    },

    {

        name: "ラートプラオ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL15",

        coordinate: { latitude: 13.806243, longitude: 100.5739567 },

    },

    {

        name: "ラチャダーピセーク",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL16",

        coordinate: { latitude: 13.79915789, longitude: 100.5746119 },

    },

    {

        name: "スティサン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL17",

        coordinate: { latitude: 13.78973963, longitude: 100.5742003 },

    },

    {

        name: "フワイクワーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL18",

        coordinate: { latitude: 13.77852705, longitude: 100.5736394 },

    },

    {

        name: "タイランド・カルチュラル・センター",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL19",

        coordinate: { latitude: 13.76627655, longitude: 100.5702328 },

    },

    {

        name: "ラーマ9世",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL20",

        coordinate: { latitude: 13.75791625, longitude: 100.5655452 },

    },

    {

        name: "ペッチャブリー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL21",

        coordinate: { latitude: 13.74868501, longitude: 100.5631611 },

    },

    {

        name: "スクンビット",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL22",

        coordinate: { latitude: 13.73855034, longitude: 100.5614557 },

    },

    {

        name: "クイーン・シリキット国際会議場",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL23",

        coordinate: { latitude: 13.72315611, longitude: 100.5601051 },

    },

    {

        name: "クロントゥーイ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL24",

        coordinate: { latitude: 13.72233526, longitude: 100.5539195 },

    },

    {

        name: "ルンピニー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL25",

        coordinate: { latitude: 13.72577127, longitude: 100.5456769 },

    },

    {

        name: "シーロム",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL26",

        coordinate: { latitude: 13.72926025, longitude: 100.5365456 },

    },

    {

        name: "サムヤーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL27",

        coordinate: { latitude: 13.73234822, longitude: 100.5299815 },

    },

    {

        name: "フワランポーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL28",

        coordinate: { latitude: 13.73783973, longitude: 100.5171627 },

    },

    {

        name: "ワット・マンコン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL29",

        coordinate: { latitude: 13.74201328, longitude: 100.5101788 },

    },

    {

        name: "サムヨート",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL30",

        coordinate: { latitude: 13.74715729, longitude: 100.5022257 },

    },

    {

        name: "サナームチャイ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL31",

        coordinate: { latitude: 13.74394426, longitude: 100.4945866 },

    },

    {

        name: "イサラパープ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL32",

        coordinate: { latitude: 13.73832048, longitude: 100.4852921 },

    },

    {

        name: "バンパイ",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL33",

        coordinate: { latitude: 13.72459435, longitude: 100.4651747 },

    },

    {

        name: "バーンワー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL34",

        coordinate: { latitude: 13.72039546, longitude: 100.4571675 },

    },

    {

        name: "ペットカセム48",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL35",

        coordinate: { latitude: 13.71550917, longitude: 100.4456044 },

    },

    {

        name: "パーシーチャルーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL36",

        coordinate: { latitude: 13.71288542, longitude: 100.4341567 },

    },

    {

        name: "バンケー",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL37",

        coordinate: { latitude: 13.71194125, longitude: 100.4223819 },

    },

    {

        name: "ラックソーン",

        line: "MRT",

        route: "Blue Line",

        stationCode: "BL38",

        coordinate: { latitude: 13.7109686, longitude: 100.4099721 },

    },



    // =========================================================

    // MRT Purple Line

    // =========================================================



    {

        name: "クローン・バンパイ",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP01",

        coordinate: { latitude: 13.89253436, longitude: 100.4082496 },

    },

    {

        name: "タラート・バンヤイ",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP02",

        coordinate: { latitude: 13.88112798, longitude: 100.4092513 },

    },

    {

        name: "サムヤック・バンヤイ",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP03",

        coordinate: { latitude: 13.87456616, longitude: 100.4194113 },

    },

    {

        name: "バン・プルー",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP04",

        coordinate: { latitude: 13.87572623, longitude: 100.4338654 },

    },

    {

        name: "バンラックヤイ",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP05",

        coordinate: { latitude: 13.87660559, longitude: 100.4449095 },

    },

    {

        name: "バンラックノーイ・ターイット",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP06",

        coordinate: { latitude: 13.87479655, longitude: 100.4559496 },

    },

    {

        name: "サイマー",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP07",

        coordinate: { latitude: 13.87050059, longitude: 100.4666311 },

    },

    {

        name: "プラナン・クラオ橋",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP08",

        coordinate: { latitude: 13.8703241, longitude: 100.4803656 },

    },

    {

        name: "ヤーク・ノンタブリー1",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP09",

        coordinate: { latitude: 13.86581435, longitude: 100.4946124 },

    },

    {

        name: "バンクラソー",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP10",

        coordinate: { latitude: 13.86169155, longitude: 100.504486 },

    },

    {

        name: "ノンタブリー市民センター",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP11",

        coordinate: { latitude: 13.8602065, longitude: 100.5132428 },

    },

    {

        name: "公衆衛生省",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP12",

        coordinate: { latitude: 13.84867734, longitude: 100.5146738 },

    },

    {

        name: "ヤーク・ティワノン",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP13",

        coordinate: { latitude: 13.83957886, longitude: 100.5148801 },

    },

    {

        name: "ウォンサワン",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP14",

        coordinate: { latitude: 13.83006051, longitude: 100.5264559 },

    },

    {

        name: "バンソーン",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP15",

        coordinate: { latitude: 13.82033224, longitude: 100.5324967 },

    },

    {

        name: "タオプーン",

        line: "Purple",

        route: "Purple Line",

        stationCode: "PP16",

        coordinate: { latitude: 13.80621259, longitude: 100.530759 },

    },



    // =========================================================

    // Airport Rail Link

    // =========================================================



    {

        name: "スワンナプーム",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A1",

        coordinate: { latitude: 13.69790742, longitude: 100.7522493 },

    },

    {

        name: "ラートクラバン",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A2",

        coordinate: { latitude: 13.7278904, longitude: 100.7486236 },

    },

    {

        name: "バーンタップチャーン",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A3",

        coordinate: { latitude: 13.73282618, longitude: 100.6913061 },

    },

    {

        name: "フアマーク",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A4",

        coordinate: { latitude: 13.73804799, longitude: 100.6451781 },

    },

    {

        name: "ラームカムヘン",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A5",

        coordinate: { latitude: 13.74298957, longitude: 100.6001476 },

    },

    {

        name: "マッカサン",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A6",

        coordinate: { latitude: 13.75103218, longitude: 100.5612032 },

    },

    {

        name: "ラチャプラロップ",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A7",

        coordinate: { latitude: 13.75510533, longitude: 100.5421521 },

    },

    {

        name: "パヤタイ",

        line: "ARL",

        route: "Airport Rail Link",

        stationCode: "A8",

        coordinate: { latitude: 13.75677853, longitude: 100.5348391 },

    },



    // =========================================================

    // MRT Pink Line

    // =========================================================



    {

        name: "ノンタブリー市民センター",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK01",

        coordinate: { latitude: 13.86009775, longitude: 100.5181445 },

    },

    {

        name: "ケーライ",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK02",

        coordinate: { latitude: 13.86255791, longitude: 100.5207688 },

    },

    {

        name: "サナームビンナーム",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK03",

        coordinate: { latitude: 13.8741295, longitude: 100.516286 },

    },

    {

        name: "サマッキー",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK04",

        coordinate: { latitude: 13.88919555, longitude: 100.5106468 },

    },

    {

        name: "王立灌漑局",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK05",

        coordinate: { latitude: 13.8986368, longitude: 100.5071267 },

    },

    {

        name: "ヤーク・パークレット",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK06",

        coordinate: { latitude: 13.90644318, longitude: 100.5054788 },

    },

    {

        name: "パークレット・バイパス",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK07",

        coordinate: { latitude: 13.90644017, longitude: 100.5157988 },

    },

    {

        name: "チェーンワッタナ・パークレット28",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK08",

        coordinate: { latitude: 13.9041046, longitude: 100.5291645 },

    },

    {

        name: "シーラット",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK09",

        coordinate: { latitude: 13.90058216, longitude: 100.5398762 },

    },

    {

        name: "ムアントンターニー",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK10",

        coordinate: { latitude: 13.89747577, longitude: 100.5483386 },

    },

    {

        name: "チェーンワッタナ14",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK11",

        coordinate: { latitude: 13.89313571, longitude: 100.5603441 },

    },

    {

        name: "政府総合庁舎",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK12",

        coordinate: { latitude: 13.89071127, longitude: 100.5673977 },

    },

    {

        name: "ナショナル・テレコム",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK13",

        coordinate: { latitude: 13.88742603, longitude: 100.5757986 },

    },

    {

        name: "ラクシー",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK14",

        coordinate: { latitude: 13.88409464, longitude: 100.5825889 },

    },

    {

        name: "ラーチャパット・プラナコーン",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK15",

        coordinate: { latitude: 13.87981519, longitude: 100.5895093 },

    },

    {

        name: "ワット・プラ・シー・マハータート",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK16",

        coordinate: { latitude: 13.87447087, longitude: 100.5972522 },

    },

    {

        name: "ラムイントラ3",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK17",

        coordinate: { latitude: 13.87082295, longitude: 100.6028642 },

    },

    {

        name: "ラートプラカオ",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK18",

        coordinate: { latitude: 13.86268274, longitude: 100.617954 },

    },

    {

        name: "ラムイントラ・コー・モー4",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK19",

        coordinate: { latitude: 13.85825785, longitude: 100.6261589 },

    },

    {

        name: "マイラープ",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK20",

        coordinate: { latitude: 13.85503112, longitude: 100.6322456 },

    },

    {

        name: "ワチャラポン",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK21",

        coordinate: { latitude: 13.84994098, longitude: 100.6416164 },

    },

    {

        name: "ラムイントラ・コー・モー6",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK22",

        coordinate: { latitude: 13.84519546, longitude: 100.6503373 },

    },

    {

        name: "クーブーン",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK23",

        coordinate: { latitude: 13.84047281, longitude: 100.6590814 },

    },

    {

        name: "ラムイントラ・コー・モー9",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK24",

        coordinate: { latitude: 13.83384417, longitude: 100.6674932 },

    },

    {

        name: "外環道・ラムイントラ",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK25",

        coordinate: { latitude: 13.82462893, longitude: 100.6770457 },

    },

    {

        name: "ノッパラット",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK26",

        coordinate: { latitude: 13.81656568, longitude: 100.685544 },

    },

    {

        name: "バンチャン",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK27",

        coordinate: { latitude: 13.81274187, longitude: 100.7034107 },

    },

    {

        name: "セータブットバムペーン",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK28",

        coordinate: { latitude: 13.8126908, longitude: 100.7131798 },

    },

    {

        name: "ミンブリー市場",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK29",

        coordinate: { latitude: 13.81256467, longitude: 100.7256391 },

    },

    {

        name: "ミンブリー",

        line: "Pink",

        route: "Pink Line",

        stationCode: "PK30",

        coordinate: { latitude: 13.80844328, longitude: 100.7326648 },

    },



    // Pink Line - Muang Thong Thani Extension

    {

        name: "インパクト・ムアントンターニー",

        line: "Pink",

        route: "Pink Line Muang Thong Thani Extension",

        stationCode: "MT01",

        coordinate: { latitude: 13.910445, longitude: 100.5442477 },

    },

    {

        name: "レイク・ムアントンターニー",

        line: "Pink",

        route: "Pink Line Muang Thong Thani Extension",

        stationCode: "MT02",

        coordinate: { latitude: 13.9183, longitude: 100.5457 },

    },



    // =========================================================

    // MRT Yellow Line

    // =========================================================



    {

        name: "ラートプラオ",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL01",

        coordinate: { latitude: 13.80642537, longitude: 100.5750188 },

    },

    {

        name: "パーワナー",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL02",

        coordinate: { latitude: 13.80011847, longitude: 100.5842163 },

    },

    {

        name: "チョークチャイ4",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL03",

        coordinate: { latitude: 13.79442539, longitude: 100.5943619 },

    },

    {

        name: "ラートプラオ71",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL04",

        coordinate: { latitude: 13.78728606, longitude: 100.6071587 },

    },

    {

        name: "ラートプラオ83",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL05",

        coordinate: { latitude: 13.78365274, longitude: 100.6137309 },

    },

    {

        name: "マハートタイ",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL06",

        coordinate: { latitude: 13.7780628, longitude: 100.6237065 },

    },

    {

        name: "ラートプラオ101",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL07",

        coordinate: { latitude: 13.77436537, longitude: 100.6303535 },

    },

    {

        name: "バンカピ",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL08",

        coordinate: { latitude: 13.76910863, longitude: 100.6398086 },

    },

    {

        name: "ヤーク・ラムサーリー",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL09",

        coordinate: { latitude: 13.76136904, longitude: 100.6454823 },

    },

    {

        name: "シークリータ",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL10",

        coordinate: { latitude: 13.75080762, longitude: 100.6449158 },

    },

    {

        name: "フアマーク",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL11",

        coordinate: { latitude: 13.7364372, longitude: 100.641316 },

    },

    {

        name: "カランタン",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL12",

        coordinate: { latitude: 13.7256816, longitude: 100.6417183 },

    },

    {

        name: "シーヌット",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL13",

        coordinate: { latitude: 13.712651, longitude: 100.643577 },

    },

    {

        name: "シーナカリン38",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL14",

        coordinate: { latitude: 13.70063689, longitude: 100.6464554 },

    },

    {

        name: "スワンルワン・ラーマ9",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL15",

        coordinate: { latitude: 13.69072764, longitude: 100.6471035 },

    },

    {

        name: "シーウドム",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL16",

        coordinate: { latitude: 13.67778455, longitude: 100.6460782 },

    },

    {

        name: "シーイアム",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL17",

        coordinate: { latitude: 13.66652118, longitude: 100.6443196 },

    },

    {

        name: "シーラサール",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL18",

        coordinate: { latitude: 13.65600333, longitude: 100.642373 },

    },

    {

        name: "シーベーリング",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL19",

        coordinate: { latitude: 13.64453762, longitude: 100.6368896 },

    },

    {

        name: "シーダン",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL20",

        coordinate: { latitude: 13.63192221, longitude: 100.6294477 },

    },

    {

        name: "シーテパ",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL21",

        coordinate: { latitude: 13.62782906, longitude: 100.6264504 },

    },

    {

        name: "ティッパワン",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL22",

        coordinate: { latitude: 13.63748659, longitude: 100.6086469 },

    },

    {

        name: "サムローン",

        line: "Yellow",

        route: "Yellow Line",

        stationCode: "YL23",

        coordinate: { latitude: 13.64511811, longitude: 100.5964632 },

    },



    // =========================================================

    // SRT Red Line

    // =========================================================



    {

        name: "クルンテープ・アピワット中央駅",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN01",

        coordinate: { latitude: 13.80464389, longitude: 100.5420537 },

    },

    {

        name: "チャトゥチャック",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN02",

        coordinate: { latitude: 13.82652595, longitude: 100.5493932 },

    },

    {

        name: "ワット・サミアン・ナーリー",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN03",

        coordinate: { latitude: 13.84168597, longitude: 100.5575223 },

    },

    {

        name: "バンケーン",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN04",

        coordinate: { latitude: 13.84696561, longitude: 100.5607408 },

    },

    {

        name: "トゥンソンホン",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN05",

        coordinate: { latitude: 13.86020462, longitude: 100.5673919 },

    },

    {

        name: "ラクシー",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN06",

        coordinate: { latitude: 13.88624187, longitude: 100.5818476 },

    },

    {

        name: "カンケーハ",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN07",

        coordinate: { latitude: 13.89861755, longitude: 100.5890021 },

    },

    {

        name: "ドンムアン",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN08",

        coordinate: { latitude: 13.91507215, longitude: 100.5979559 },

    },

    {

        name: "ラクホック",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN09",

        coordinate: { latitude: 13.96583148, longitude: 100.6053144 },

    },

    {

        name: "ランシット",

        line: "Red",

        route: "SRT Dark Red Line",

        stationCode: "RN10",

        coordinate: { latitude: 13.99065039, longitude: 100.602157 },

    },



    {

        name: "クルンテープ・アピワット中央駅",

        line: "Red",

        route: "SRT Light Red Line",

        stationCode: "RW01",

        coordinate: { latitude: 13.80464389, longitude: 100.5420537 },

    },

    {

        name: "バンソーン",

        line: "Red",

        route: "SRT Light Red Line",

        stationCode: "RW02",

        coordinate: { latitude: 13.82205892, longitude: 100.534189 },

    },

    {

        name: "バンバムル",

        line: "Red",

        route: "SRT Light Red Line",

        stationCode: "RW05",

        coordinate: { latitude: 13.79170674, longitude: 100.4776743 },

    },

    {

        name: "タリンチャン",

        line: "Red",

        route: "SRT Light Red Line",

        stationCode: "RW06",

        coordinate: { latitude: 13.78934932, longitude: 100.4400187 },

    },



    // =========================================================

    // =========================================================
    // SRT National Railway Stations
    //
    // Generated from SRT official station data.
    // Missing official coordinates are included only where
    // separately verified by the Phase 4 evidence pipeline.
    // Unresolved stations are intentionally excluded.
    // =========================================================

    {
        name: "กรุงเทพ",
        nameEn: "Bangkok",
        line: "SRT",
        coordinate: { latitude: 13.7393414, longitude: 100.5146067 },
    },

    {
        name: "ยมราช",
        nameEn: "Yommarat",
        line: "SRT",
        coordinate: { latitude: 13.758628, longitude: 100.5214744 },
    },

    {
        name: "โรงพยาบาลรามาธิบดี",
        nameEn: "Ramathibodi Hospital",
        line: "SRT",
        coordinate: { latitude: 13.7685073, longitude: 100.5255047 },
    },

    {
        name: "สามเสน",
        nameEn: "Sam Sen",
        line: "SRT",
        coordinate: { latitude: 13.7797628, longitude: 100.527548 },
    },

    {
        name: "ชุมทางบางซื่อ",
        nameEn: "Bang Sue Junction",
        line: "SRT",
        coordinate: { latitude: 13.804377, longitude: 100.5377544 },
    },

    {
        name: "กลางกรุงเทพอภิวัฒน์",
        nameEn: "Krung Thep Aphiwat Central Terminal",
        line: "SRT",
        coordinate: { latitude: 13.8040304, longitude: 100.5398737 },
    },

    {
        name: "บางเขน",
        nameEn: "Bang Khen",
        line: "SRT",
        coordinate: { latitude: 13.8469619, longitude: 100.5585208 },
    },

    {
        name: "ทุ่งสองห้อง",
        nameEn: "Thung Song Hong",
        line: "SRT",
        coordinate: { latitude: 13.8602057, longitude: 100.5675309 },
    },

    {
        name: "หลักสี่",
        nameEn: "Lak Si",
        line: "SRT",
        coordinate: { latitude: 13.8836598, longitude: 100.5785495 },
    },

    {
        name: "ดอนเมือง",
        nameEn: "Don Muang",
        line: "SRT",
        coordinate: { latitude: 13.9176049, longitude: 100.5974557 },
    },

    {
        name: "รังสิต",
        nameEn: "Rangsit",
        line: "SRT",
        coordinate: { latitude: 13.9827967, longitude: 100.5944552 },
    },

    {
        name: "คลองหนึ่ง",
        nameEn: "Khlong Nueng",
        line: "SRT",
        coordinate: { latitude: 14.0231677, longitude: 100.5980653 },
    },

    {
        name: "เชียงราก",
        nameEn: "Chiang Rak",
        line: "SRT",
        coordinate: { latitude: 14.0553370, longitude: 100.5923849 },
    },

    {
        name: "มหาวิทยาลัยธรรมศาสตร์ (ศูนย์รังสิต)",
        nameEn: "Thammasat University (Rangsit Campus)",
        line: "SRT",
        coordinate: { latitude: 14.0793792, longitude: 100.5885381 },
    },

    {
        name: "นวนคร",
        nameEn: "Nawa Nakhon",
        line: "SRT",
        coordinate: { latitude: 14.1146525, longitude: 100.5840022 },
    },

    {
        name: "เชียงรากน้อย",
        nameEn: "Chiang Rak Noi",
        line: "SRT",
        coordinate: { latitude: 14.1305435, longitude: 100.5820984 },
    },

    {
        name: "คลองพุทรา",
        nameEn: "Khlong Phutsa",
        line: "SRT",
        coordinate: { latitude: 14.1843588, longitude: 100.5761302 },
    },

    {
        name: "บางปะอิน",
        nameEn: "Bang Pa-in",
        line: "SRT",
        coordinate: { latitude: 14.2397383, longitude: 100.5822619 },
    },

    {
        name: "บ้านโพ",
        nameEn: "Ban Pho",
        line: "SRT",
        coordinate: { latitude: 14.2821209, longitude: 100.5863743 },
    },

    {
        name: "อยุธยา",
        nameEn: "Ayutthaya",
        line: "SRT",
        coordinate: { latitude: 14.356673, longitude: 100.5808309 },
    },

    {
        name: "บ้านม้า",
        nameEn: "Ban Ma",
        line: "SRT",
        coordinate: { latitude: 14.3841052, longitude: 100.5948113 },
    },

    {
        name: "มาบพระจันทร์",
        nameEn: "Map Phra Chan",
        line: "SRT",
        coordinate: { latitude: 14.4022844, longitude: 100.6320805 },
    },

    {
        name: "บ้านดอนกลาง",
        nameEn: "Ban Don Klang",
        line: "SRT",
        coordinate: { latitude: 14.4157114, longitude: 100.6596028 },
    },

    {
        name: "พระแก้ว",
        nameEn: "Phra Kaeo",
        line: "SRT",
        coordinate: { latitude: 14.4285788, longitude: 100.6834671 },
    },

    {
        name: "ชุมทางบ้านภาชี",
        nameEn: "Ban Phachi Junction",
        line: "SRT",
        coordinate: { latitude: 14.4505571, longitude: 100.7207717 },
    },

    {
        name: "ดอนหญ้านาง",
        nameEn: "Don Ya Nang",
        line: "SRT",
        coordinate: { latitude: 14.4797237, longitude: 100.728397 },
    },

    {
        name: "หนองวิวัฒน์",
        nameEn: "Nong Wiwat",
        line: "SRT",
        coordinate: { latitude: 14.505331, longitude: 100.7252563 },
    },

    {
        name: "บ้านปลักแรด",
        nameEn: "Ban Plak Raet",
        line: "SRT",
        coordinate: { latitude: 14.530074, longitude: 100.725988 },
    },

    {
        name: "ท่าเรือ",
        nameEn: "Tha Rua",
        line: "SRT",
        coordinate: { latitude: 14.5053303, longitude: 100.7099354 },
    },

    {
        name: "บ้านหมอ",
        nameEn: "Ban Mo",
        line: "SRT",
        coordinate: { latitude: 14.6167607, longitude: 100.7240512 },
    },

    {
        name: "หนองโดน",
        nameEn: "Nong Don",
        line: "SRT",
        coordinate: { latitude: 14.683487, longitude: 100.7039433 },
    },

    {
        name: "บ้านกลับ",
        nameEn: "Ban Klap",
        line: "SRT",
        coordinate: { latitude: 14.7205600, longitude: 100.6783300 },
    },

    {
        name: "บ้านป่าหวาย",
        nameEn: "Ban Pa Wai",
        line: "SRT",
        coordinate: { latitude: 14.7596434, longitude: 100.6412012 },
    },

    {
        name: "ลพบุรี (เดิม)",
        nameEn: "Lop Buri (Old)",
        line: "SRT",
        coordinate: { latitude: 14.7596427, longitude: 100.6258803 },
    },

    {
        name: "ท่าแค",
        nameEn: "Tha Khae",
        line: "SRT",
        coordinate: { latitude: 14.8402564, longitude: 100.6043101 },
    },

    {
        name: "โคกกะเทียม",
        nameEn: "Khok Kathiam",
        line: "SRT",
        coordinate: { latitude: 14.8997851, longitude: 100.5912379 },
    },

    {
        name: "หนองเต่า",
        nameEn: "Nong Tao",
        line: "SRT",
        coordinate: { latitude: 14.9514762, longitude: 100.5800037 },
    },

    {
        name: "หนองทรายขาว",
        nameEn: "Nong Sai Khao",
        line: "SRT",
        coordinate: { latitude: 14.9726895, longitude: 100.5688153 },
    },

    {
        name: "บ้านหมี่",
        nameEn: "Ban Mi",
        line: "SRT",
        coordinate: { latitude: 15.0394125, longitude: 100.5386206 },
    },

    {
        name: "ห้วยแก้ว",
        nameEn: "Huai Kaeo",
        line: "SRT",
        coordinate: { latitude: 15.0690731, longitude: 100.5095552 },
    },

    {
        name: "ไผ่ใหญ่",
        nameEn: "Phai Yai",
        line: "SRT",
        coordinate: { latitude: 15.0978182, longitude: 100.483731 },
    },

    {
        name: "โรงเรียนจันเสน",
        nameEn: "Rongrian Chan Sen",
        line: "SRT",
        coordinate: { latitude: 15.115933, longitude: 100.4659827 },
    },

    {
        name: "จันเสน",
        nameEn: "Chan Sen",
        line: "SRT",
        coordinate: { latitude: 15.122224, longitude: 100.4573573 },
    },

    {
        name: "บ้านกกกว้าว",
        nameEn: "Ban Kok Kwao",
        line: "SRT",
        coordinate: { latitude: 15.1414681, longitude: 100.4420215 },
    },

    {
        name: "ช่องแค",
        nameEn: "Chong Khae",
        line: "SRT",
        coordinate: { latitude: 15.1649528, longitude: 100.4204895 },
    },

    {
        name: "ทะเลหว้า",
        nameEn: "Thale Wa",
        line: "SRT",
        coordinate: { latitude: 15.2122004, longitude: 100.3746735 },
    },

    {
        name: "โพนทอง",
        nameEn: "Phon Thong",
        line: "SRT",
        coordinate: { latitude: 15.2204313, longitude: 100.3666748 },
    },

    {
        name: "บ้านตาคลี",
        nameEn: "Ban Takhli",
        line: "SRT",
        coordinate: { latitude: 15.2563799, longitude: 100.347844 },
    },

    {
        name: "ดงมะกุ",
        nameEn: "Dong Maku",
        line: "SRT",
        coordinate: { latitude: 15.305365, longitude: 100.3291164 },
    },

    {
        name: "หัวหวาย",
        nameEn: "Hua Wai",
        line: "SRT",
        coordinate: { latitude: 15.3487649, longitude: 100.3107015 },
    },

    {
        name: "หนองโพ",
        nameEn: "Nong Pho",
        line: "SRT",
        coordinate: { latitude: 15.393497, longitude: 100.2570573 },
    },

    {
        name: "หัวงิ้ว",
        nameEn: "Hua Ngio",
        line: "SRT",
        coordinate: { latitude: 15.4277402, longitude: 100.2191884 },
    },

    {
        name: "เนินมะกอก",
        nameEn: "Noen Makok",
        line: "SRT",
        coordinate: { latitude: 15.4756294, longitude: 100.170632 },
    },

    {
        name: "เขาทอง",
        nameEn: "Khao Thong",
        line: "SRT",
        coordinate: { latitude: 15.5720107, longitude: 100.174287 },
    },

    {
        name: "นครสวรรค์",
        nameEn: "Nakhon Sawan",
        line: "SRT",
        coordinate: { latitude: 15.6631693, longitude: 100.1541704 },
    },

    {
        name: "ปากน้ำโพ",
        nameEn: "Pak Nam Pho",
        line: "SRT",
        coordinate: { latitude: 15.703409, longitude: 100.1513123 },
    },

    {
        name: "บึงบอระเพ็ด",
        nameEn: "Bueng Boraphet",
        line: "SRT",
        coordinate: { latitude: 15.6962806, longitude: 100.1667593 },
    },

    {
        name: "ทับกฤช",
        nameEn: "Thap Krit",
        line: "SRT",
        coordinate: { latitude: 15.755155, longitude: 100.2553923 },
    },

    {
        name: "คลองปลากด",
        nameEn: "Khlong Pla Kot",
        line: "SRT",
        coordinate: { latitude: 15.7551522, longitude: 100.2225615 },
    },

    {
        name: "ชุมแสง",
        nameEn: "Chum Saeng",
        line: "SRT",
        coordinate: { latitude: 15.889359, longitude: 100.3019961 },
    },

    {
        name: "วังกร่าง",
        nameEn: "Wang Krang",
        line: "SRT",
        coordinate: { latitude: 15.976872, longitude: 100.3435534 },
    },

    {
        name: "บางมูลนาก",
        nameEn: "Bang Mun Nak",
        line: "SRT",
        coordinate: { latitude: 16.028691, longitude: 100.3788773 },
    },

    {
        name: "หอไกร",
        nameEn: "Ho Krai",
        line: "SRT",
        coordinate: { latitude: 16.0820508, longitude: 100.4056695 },
    },

    {
        name: "ดงตะขบ",
        nameEn: "Dong Takhop",
        line: "SRT",
        coordinate: { latitude: 16.1392192, longitude: 100.4115676 },
    },

    {
        name: "ตะพานหิน",
        nameEn: "Taphan Hin",
        line: "SRT",
        coordinate: { latitude: 16.22079, longitude: 100.4160963 },
    },

    {
        name: "ห้วยเกตุ",
        nameEn: "Huai Ket",
        line: "SRT",
        coordinate: { latitude: 16.2733204, longitude: 100.4254080 },
    },

    {
        name: "หัวดง",
        nameEn: "Hua Dong",
        line: "SRT",
        coordinate: { latitude: 16.339309, longitude: 100.4007943 },
    },

    {
        name: "วังกรด",
        nameEn: "Wang Krot",
        line: "SRT",
        coordinate: { latitude: 16.398832, longitude: 100.3874113 },
    },

    {
        name: "พิจิตร",
        nameEn: "Phichit",
        line: "SRT",
        coordinate: { latitude: 16.4478221, longitude: 100.3466191 },
    },

    {
        name: "ท่าฬ่อ",
        nameEn: "Tha Lo",
        line: "SRT",
        coordinate: { latitude: 16.5121499, longitude: 100.3301065 },
    },

    {
        name: "บางกระทุ่ม",
        nameEn: "Bang Krathum",
        line: "SRT",
        coordinate: { latitude: 16.5765836, longitude: 100.2967614 },
    },

    {
        name: "แม่เทียบ",
        nameEn: "Mae Thiap",
        line: "SRT",
        coordinate: { latitude: 16.6097593, longitude: 100.2799609 },
    },

    {
        name: "บ้านใหม่",
        nameEn: "Ban Mai",
        line: "SRT",
        coordinate: { latitude: 16.689525, longitude: 100.2707503 },
    },

    {
        name: "บึงพระ",
        nameEn: "Bueng Phra",
        line: "SRT",
        coordinate: { latitude: 16.7489839, longitude: 100.2474165 },
    },

    {
        name: "พิษณุโลก",
        nameEn: "Phitsanulok",
        line: "SRT",
        coordinate: { latitude: 16.8149757, longitude: 100.2657009 },
    },

    {
        name: "บ้านเต็งหนาม",
        nameEn: "Ban Teng Nam",
        line: "SRT",
        coordinate: { latitude: 16.855466, longitude: 100.2642867 },
    },

    {
        name: "บ้านตูม",
        nameEn: "Ban Tum",
        line: "SRT",
        coordinate: { latitude: 16.9090145, longitude: 100.246232 },
    },

    {
        name: "แควน้อย",
        nameEn: "Khwae Noi",
        line: "SRT",
        coordinate: { latitude: 16.9535884, longitude: 100.2281212 },
    },

    {
        name: "พรหมพิราม",
        nameEn: "Phrom Phiram",
        line: "SRT",
        coordinate: { latitude: 17.0310607, longitude: 100.1968284 },
    },

    {
        name: "หนองตม",
        nameEn: "Nong Tom",
        line: "SRT",
        coordinate: { latitude: 17.1007635, longitude: 100.1608769 },
    },

    {
        name: "บ้านบุ่ง",
        nameEn: "Ban Bung",
        line: "SRT",
        coordinate: { latitude: 17.1690488, longitude: 100.1072627 },
    },

    {
        name: "บ้านโคน",
        nameEn: "Ban Khon",
        line: "SRT",
        coordinate: { latitude: 17.1994815, longitude: 100.0750577 },
    },

    {
        name: "พิชัย",
        nameEn: "Phichai",
        line: "SRT",
        coordinate: { latitude: 17.2889496, longitude: 100.0839999 },
    },

    {
        name: "ไร่อ้อย",
        nameEn: "Rai Oi",
        line: "SRT",
        coordinate: { latitude: 17.3456985, longitude: 100.0467738 },
    },

    {
        name: "ชุมทางบ้านดารา",
        nameEn: "Ban Dara Junction",
        line: "SRT",
        coordinate: { latitude: 17.3832437, longitude: 100.0808586 },
    },

    {
        name: "ท่าสัก",
        nameEn: "Tha Sak",
        line: "SRT",
        coordinate: { latitude: 17.3832429, longitude: 100.0655377 },
    },

    {
        name: "ตรอน",
        nameEn: "Tron",
        line: "SRT",
        coordinate: { latitude: 17.4832509, longitude: 100.1073284 },
    },

    {
        name: "วังกะพี้",
        nameEn: "Wang Kaphi",
        line: "SRT",
        coordinate: { latitude: 17.5444627, longitude: 100.1001621 },
    },

    {
        name: "อุตรดิตถ์",
        nameEn: "Uttaradit",
        line: "SRT",
        coordinate: { latitude: 17.6203598, longitude: 100.0972647 },
    },

    {
        name: "ศิลาอาสน์",
        nameEn: "Sila At",
        line: "SRT",
        coordinate: { latitude: 17.6394256, longitude: 100.0966823 },
    },

    {
        name: "ท่าเสา",
        nameEn: "Tha Sao",
        line: "SRT",
        coordinate: { latitude: 17.6465119, longitude: 100.1189096 },
    },

    {
        name: "บ้านด่าน",
        nameEn: "Ban Dan",
        line: "SRT",
        coordinate: { latitude: 17.7184486, longitude: 100.1277406 },
    },

    {
        name: "ปางต้นผึ้ง",
        nameEn: "Pang Ton Phueng",
        line: "SRT",
        coordinate: { latitude: 17.799823, longitude: 100.0740893 },
    },

    {
        name: "เขาพลึง",
        nameEn: "Khao Phlueng",
        line: "SRT",
        coordinate: { latitude: 17.8501421, longitude: 100.0431232 },
    },

    {
        name: "ห้วยไร่",
        nameEn: "Huai Rai",
        line: "SRT",
        coordinate: { latitude: 17.8860118, longitude: 100.0404497 },
    },

    {
        name: "ไร่เกล็ดดาว",
        nameEn: "Rai Klet Dao",
        line: "SRT",
        coordinate: { latitude: 17.9111902, longitude: 100.0631376 },
    },

    {
        name: "แม่พวก",
        nameEn: "Mae Phuak",
        line: "SRT",
        coordinate: { latitude: 17.9359413, longitude: 100.0576619 },
    },

    {
        name: "เด่นชัย",
        nameEn: "Den Chai",
        line: "SRT",
        coordinate: { latitude: 17.9805247, longitude: 100.0462183 },
    },

    {
        name: "ปากปาน",
        nameEn: "Pak Pan",
        line: "SRT",
        coordinate: { latitude: 17.994693, longitude: 100.0043403 },
    },

    {
        name: "แก่งหลวง",
        nameEn: "Kaeng Luang",
        line: "SRT",
        coordinate: { latitude: 18.0247871, longitude: 99.9468702 },
    },

    {
        name: "ห้วยแม่ต้า",
        nameEn: "Huai Mae Ta",
        line: "SRT",
        coordinate: { latitude: 18.0662278, longitude: 99.9211534 },
    },

    {
        name: "บ้านปิน",
        nameEn: "Ban Pin",
        line: "SRT",
        coordinate: { latitude: 18.0960459, longitude: 99.864859 },
    },

    {
        name: "ผาคัน",
        nameEn: "Pha Khan",
        line: "SRT",
        coordinate: { latitude: 18.2072448, longitude: 99.8685684 },
    },

    {
        name: "ผาคอ",
        nameEn: "Pha Kho",
        line: "SRT",
        coordinate: { latitude: 18.2277432, longitude: 99.8767611 },
    },

    {
        name: "ปางป๋วย",
        nameEn: "Pang Puai",
        line: "SRT",
        coordinate: { latitude: 18.2992195, longitude: 99.8525638 },
    },

    {
        name: "แม่จาง",
        nameEn: "Mae Chang",
        line: "SRT",
        coordinate: { latitude: 18.272489, longitude: 99.7840239 },
    },

    {
        name: "แม่เมาะ",
        nameEn: "Mae Mo",
        line: "SRT",
        coordinate: { latitude: 18.272489, longitude: 99.7202946 },
    },

    {
        name: "ห้วยรากไม้",
        nameEn: "Huai Rak Mai",
        line: "SRT",
        coordinate: { latitude: 18.2558995, longitude: 99.657472 },
    },

    {
        name: "ศาลาผาลาด",
        nameEn: "Sala Pha Lat",
        line: "SRT",
        coordinate: { latitude: 18.2385438, longitude: 99.5936245 },
    },

    {
        name: "แม่ทะ",
        nameEn: "Mae Tha",
        line: "SRT",
        coordinate: { latitude: 18.1999812, longitude: 99.5543157 },
    },

    {
        name: "หนองวัวเฒ่า",
        nameEn: "Nong Wua Thao",
        line: "SRT",
        coordinate: { latitude: 18.2443083, longitude: 99.4980347 },
    },

    {
        name: "นครลำปาง",
        nameEn: "Nakhon Lampang",
        line: "SRT",
        coordinate: { latitude: 18.2797875, longitude: 99.470766 },
    },

    {
        name: "ห้างฉัตร",
        nameEn: "Hang Chat",
        line: "SRT",
        coordinate: { latitude: 18.3361690, longitude: 99.3695614 },
    },

    {
        name: "ปางม่วง",
        nameEn: "Pang Muang",
        line: "SRT",
        coordinate: { latitude: 18.369965, longitude: 99.3208821 },
    },

    {
        name: "ห้วยเรียน",
        nameEn: "Huai Rian",
        line: "SRT",
        coordinate: { latitude: 18.3707941, longitude: 99.2954971 },
    },

    {
        name: "แม่ตานน้อย",
        nameEn: "Mae Tan Noi",
        line: "SRT",
        coordinate: { latitude: 18.404096, longitude: 99.2608003 },
    },

    {
        name: "ขุนตาน",
        nameEn: "Khun Tan",
        line: "SRT",
        coordinate: { latitude: 18.5005161, longitude: 99.2653484 },
    },

    {
        name: "ทาชมภู",
        nameEn: "Tha Chomphu",
        line: "SRT",
        coordinate: { latitude: 18.5066516, longitude: 99.2034228 },
    },

    {
        name: "ศาลาแม่ทา",
        nameEn: "Sala Mae Tha",
        line: "SRT",
        coordinate: { latitude: 18.4617504, longitude: 99.1349664 },
    },

    {
        name: "หนองหล่ม",
        nameEn: "Nong Lom",
        line: "SRT",
        coordinate: { latitude: 18.4621851, longitude: 99.0487612 },
    },

    {
        name: "ลำพูน",
        nameEn: "Lamphun",
        line: "SRT",
        coordinate: { latitude: 18.5937573, longitude: 99.0210889 },
    },

    {
        name: "ป่าเส้า",
        nameEn: "Pa Sao",
        line: "SRT",
        coordinate: { latitude: 18.6375904, longitude: 99.0399556 },
    },

    {
        name: "สารภี",
        nameEn: "Saraphi",
        line: "SRT",
        coordinate: { latitude: 18.7101912, longitude: 99.0418030 },
    },

    {
        name: "เชียงใหม่",
        nameEn: "Chiang Mai",
        line: "SRT",
        coordinate: { latitude: 18.7835223, longitude: 99.0168234 },
    },

    {
        name: "คลองมะพลับ",
        nameEn: "Khlong Maphlap",
        line: "SRT",
        coordinate: { latitude: 17.3475146, longitude: 99.9811078 },
    },

    {
        name: "สวรรคโลก",
        nameEn: "Sawankhalok",
        line: "SRT",
        coordinate: { latitude: 17.3147601, longitude: 99.8299703 },
    },

    {
        name: "หนองกวย",
        nameEn: "Nong Kuai",
        line: "SRT",
        coordinate: { latitude: 14.473977, longitude: 100.7529591 },
    },

    {
        name: "หนองแซง",
        nameEn: "Nong Saeng",
        line: "SRT",
        coordinate: { latitude: 14.4907277, longitude: 100.782348 },
    },

    {
        name: "หนองสีดา",
        nameEn: "Nong Sida",
        line: "SRT",
        coordinate: { latitude: 14.4907251, longitude: 100.7495172 },
    },

    {
        name: "บ้านป๊อกแป๊ก",
        nameEn: "Ban Pok Paek",
        line: "SRT",
        coordinate: { latitude: 14.5222335, longitude: 100.8621322 },
    },

    {
        name: "สระบุรี",
        nameEn: "Saraburi",
        line: "SRT",
        coordinate: { latitude: 14.52744, longitude: 100.914324 },
    },

    {
        name: "หนองบัว",
        nameEn: "Nong Bua",
        line: "SRT",
        coordinate: { latitude: 14.5557000, longitude: 100.9629000 },
    },

    {
        name: "ชุมทางแก่งคอย",
        nameEn: "Kaeng Khoi Junction",
        line: "SRT",
        coordinate: { latitude: 14.5877576, longitude: 101.0029997 },
    },

    {
        name: "มาบกะเบา",
        nameEn: "Map Kabao",
        line: "SRT",
        coordinate: { latitude: 14.6188938, longitude: 101.0815779 },
    },

    {
        name: "ผาเสด็จ",
        nameEn: "Pha Sadet",
        line: "SRT",
        coordinate: { latitude: 14.6445418, longitude: 101.0984995 },
    },

    {
        name: "หินลับ",
        nameEn: "Hin Lap",
        line: "SRT",
        coordinate: { latitude: 14.6445391, longitude: 101.0655775 },
    },

    {
        name: "มวกเหล็ก",
        nameEn: "Muak Lek",
        line: "SRT",
        coordinate: { latitude: 14.660122, longitude: 101.1164394 },
    },

    {
        name: "กลางดง",
        nameEn: "Klang Dong",
        line: "SRT",
        coordinate: { latitude: 14.648, longitude: 101.249806 },
    },

    {
        name: "ปางอโศก",
        nameEn: "Pang Asok",
        line: "SRT",
        coordinate: { latitude: 14.6479895, longitude: 101.1817775 },
    },

    {
        name: "บันไดม้า",
        nameEn: "Bandai Ma",
        line: "SRT",
        coordinate: { latitude: 14.6729, longitude: 101.366806 },
    },

    {
        name: "ปากช่อง",
        nameEn: "Pak Chong",
        line: "SRT",
        coordinate: { latitude: 14.6728973, longitude: 101.333884 },
    },

    {
        name: "ซับม่วง",
        nameEn: "Sap Muang",
        line: "SRT",
        coordinate: { latitude: 14.7616, longitude: 101.4508801 },
    },

    {
        name: "จันทึก",
        nameEn: "Chanthuek",
        line: "SRT",
        coordinate: { latitude: 14.8145364, longitude: 101.4890696 },
    },

    {
        name: "คลองขนานจิตร",
        nameEn: "Khlong Khanan Chit",
        line: "SRT",
        coordinate: { latitude: 14.8424854, longitude: 101.5398785 },
    },

    {
        name: "คลองไผ่",
        nameEn: "Khlong Phai",
        line: "SRT",
        coordinate: { latitude: 14.8742175, longitude: 101.5380289 },
    },

    {
        name: "ลาดบัวขาว",
        nameEn: "Lat Bua Khao",
        line: "SRT",
        coordinate: { latitude: 14.8613312, longitude: 101.5961409 },
    },

    {
        name: "บ้านใหม่สำโรง",
        nameEn: "Ban Mai Samrong",
        line: "SRT",
        coordinate: { latitude: 14.8683, longitude: 101.641806 },
    },

    {
        name: "หนองน้ำขุ่น",
        nameEn: "Nong Nam Khun",
        line: "SRT",
        coordinate: { latitude: 14.881828, longitude: 101.6677282 },
    },

    {
        name: "สีคิ้ว",
        nameEn: "Sikhio",
        line: "SRT",
        coordinate: { latitude: 14.8818253, longitude: 101.6348062 },
    },

    {
        name: "โคกสะอาด",
        nameEn: "Khok Sa-at",
        line: "SRT",
        coordinate: { latitude: 14.8973861, longitude: 101.7695422 },
    },

    {
        name: "สูงเนิน",
        nameEn: "Sung Noen",
        line: "SRT",
        coordinate: { latitude: 14.8998215, longitude: 101.8065043 },
    },

    {
        name: "กุดจิก",
        nameEn: "Kut Chik",
        line: "SRT",
        coordinate: { latitude: 14.8998108, longitude: 101.7406592 },
    },

    {
        name: "โคกกรวด",
        nameEn: "Khok Kruat",
        line: "SRT",
        coordinate: { latitude: 14.9310995, longitude: 101.9567632 },
    },

    {
        name: "ภูเขาลาด",
        nameEn: "Phukhao Lat",
        line: "SRT",
        coordinate: { latitude: 14.9559, longitude: 102.020806 },
    },

    {
        name: "นครราชสีมา",
        nameEn: "Nakhon Ratchasima",
        line: "SRT",
        coordinate: { latitude: 14.9558893, longitude: 101.9527775 },
    },

    {
        name: "ชุมทางถนนจิระ",
        nameEn: "Thanon Chira Junction",
        line: "SRT",
        coordinate: { latitude: 14.9674293, longitude: 102.0995122 },
    },

    {
        name: "บ้านพะเนา",
        nameEn: "Ban Phanao",
        line: "SRT",
        coordinate: { latitude: 14.9859582, longitude: 102.1907203 },
    },

    {
        name: "บ้านพระพุทธ",
        nameEn: "Ban Phra Phut",
        line: "SRT",
        coordinate: { latitude: 14.9956633, longitude: 102.2262286 },
    },

    {
        name: "ท่าช้าง",
        nameEn: "Tha Chang",
        line: "SRT",
        coordinate: { latitude: 15.002064, longitude: 102.272295 },
    },

    {
        name: "หนองมโนรมย์",
        nameEn: "Nong Manorom",
        line: "SRT",
        coordinate: { latitude: 15.0133, longitude: 102.346806 },
    },

    {
        name: "จักราช",
        nameEn: "Chakkarat",
        line: "SRT",
        coordinate: { latitude: 15.0128546, longitude: 102.4082718 },
    },

    {
        name: "บ้านหินโคน",
        nameEn: "Ban Hin Khon",
        line: "SRT",
        coordinate: { latitude: 15.0037767, longitude: 102.496955 },
    },

    {
        name: "หินดาษ",
        nameEn: "Hin Dat",
        line: "SRT",
        coordinate: { latitude: 15.0029037, longitude: 102.5634844 },
    },

    {
        name: "ห้วยแถลง",
        nameEn: "Huai Thalaeng",
        line: "SRT",
        coordinate: { latitude: 14.9994333, longitude: 102.6445985 },
    },

    {
        name: "หนองกระทิง",
        nameEn: "Nong Krathing",
        line: "SRT",
        coordinate: { latitude: 15.0059662, longitude: 102.7517929 },
    },

    {
        name: "ลำปลายมาศ",
        nameEn: "Lam Plai Mat",
        line: "SRT",
        coordinate: { latitude: 15.0246252, longitude: 102.82745 },
    },

    {
        name: "ทะเมนชัย",
        nameEn: "Thamenchai",
        line: "SRT",
        coordinate: { latitude: 15.0246144, longitude: 102.7594215 },
    },

    {
        name: "บ้านแสลงพัน",
        nameEn: "Ban Salaeng Phan",
        line: "SRT",
        coordinate: { latitude: 15.027, longitude: 102.9837603 },
    },

    {
        name: "บ้านหนองตาด",
        nameEn: "Ban Nong Tat",
        line: "SRT",
        coordinate: { latitude: 15.0211, longitude: 103.0189401 },
    },

    {
        name: "บุรีรัมย์",
        nameEn: "Buri Ram",
        line: "SRT",
        coordinate: { latitude: 15.0032189, longitude: 102.9761771 },
    },

    {
        name: "บ้านตะโก",
        nameEn: "Ban Tako",
        line: "SRT",
        coordinate: { latitude: 14.9907404, longitude: 103.145723 },
    },

    {
        name: "ห้วยราช",
        nameEn: "Huai Rat",
        line: "SRT",
        coordinate: { latitude: 14.9728339, longitude: 103.1878411 },
    },

    {
        name: "กระสัง",
        nameEn: "Krasang",
        line: "SRT",
        coordinate: { latitude: 14.9270169, longitude: 103.3005143 },
    },

    {
        name: "หนองเต็ง",
        nameEn: "Nong Teng",
        line: "SRT",
        coordinate: { latitude: 14.9088665, longitude: 103.3608442 },
    },

    {
        name: "ลำชี",
        nameEn: "Lam Chi",
        line: "SRT",
        coordinate: { latitude: 14.899756, longitude: 103.420493 },
    },

    {
        name: "สุรินทร์",
        nameEn: "Surin",
        line: "SRT",
        coordinate: { latitude: 14.8914546, longitude: 103.4775051 },
    },

    {
        name: "บุฤาษี",
        nameEn: "Bu Ruesi",
        line: "SRT",
        coordinate: { latitude: 14.8898973, longitude: 103.572113 },
    },

    {
        name: "เมืองที",
        nameEn: "Mueang Thi",
        line: "SRT",
        coordinate: { latitude: 14.8936885, longitude: 103.65096 },
    },

    {
        name: "กะโดนค้อ",
        nameEn: "Kadon Kho",
        line: "SRT",
        coordinate: { latitude: 14.925243, longitude: 103.719656 },
    },

    {
        name: "ศีขรภูมิ",
        nameEn: "Sikhoraphum",
        line: "SRT",
        coordinate: { latitude: 14.9451579, longitude: 103.7842216 },
    },

    {
        name: "บ้านกะลัน",
        nameEn: "Ban Kalan",
        line: "SRT",
        coordinate: { latitude: 14.9736948, longitude: 103.8490677 },
    },

    {
        name: "สำโรงทาบ",
        nameEn: "Samrong Thap",
        line: "SRT",
        coordinate: { latitude: 15.0222738, longitude: 103.9360741 },
    },

    {
        name: "ห้วยทับทัน",
        nameEn: "Huai Thap Than",
        line: "SRT",
        coordinate: { latitude: 15.0590356, longitude: 104.027925 },
    },

    {
        name: "อุทุมพรพิสัย",
        nameEn: "Uthumphon Phisai",
        line: "SRT",
        coordinate: { latitude: 15.1060225, longitude: 104.136154 },
    },

    {
        name: "บ้านเนียม",
        nameEn: "Ban Niam",
        line: "SRT",
        coordinate: { latitude: 15.1258783, longitude: 104.2205887 },
    },

    {
        name: "ศรีสะเกษ",
        nameEn: "Si Sa Ket",
        line: "SRT",
        coordinate: { latitude: 15.116423, longitude: 104.3232066 },
    },

    {
        name: "เฉลิมกาญจนา",
        nameEn: "Chaloem Kanchana",
        line: "SRT",
        coordinate: { latitude: 15.1069135, longitude: 104.3933431 },
    },

    {
        name: "หนองแวง",
        nameEn: "Nong Waeng",
        line: "SRT",
        coordinate: { latitude: 15.1070874, longitude: 104.1752644 },
    },

    {
        name: "บ้านคล้อ",
        nameEn: "Ban Khlo",
        line: "SRT",
        coordinate: { latitude: 15.1072357, longitude: 104.5001272 },
    },

    {
        name: "กันทรารมย์",
        nameEn: "Kanthararom",
        line: "SRT",
        coordinate: { latitude: 15.1071854, longitude: 104.5761572 },
    },

    {
        name: "บ้านโนนผึ้ง",
        nameEn: "Ban Non Phueng",
        line: "SRT",
        coordinate: { latitude: 15.1073105, longitude: 104.6219342 },
    },

    {
        name: "ห้วยขยุง",
        nameEn: "Huai Khayung",
        line: "SRT",
        coordinate: { latitude: 15.1097253, longitude: 104.6840241 },
    },

    {
        name: "บ้านถ่อน",
        nameEn: "Ban Thon",
        line: "SRT",
        coordinate: { latitude: 15.1182462, longitude: 104.7213763 },
    },

    {
        name: "บุ่งหวาย",
        nameEn: "Bung Wai",
        line: "SRT",
        coordinate: { latitude: 15.1563538, longitude: 104.7873853 },
    },

    {
        name: "อุบลราชธานี",
        nameEn: "Ubon Ratchathani",
        line: "SRT",
        coordinate: { latitude: 15.2006718, longitude: 104.8585546 },
    },

    {
        name: "บ้านเกาะ",
        nameEn: "Ban Ko",
        line: "SRT",
        coordinate: { latitude: 15.0046671, longitude: 102.1344346 },
    },

    {
        name: "บ้านกระโดน",
        nameEn: "Ban Kradon",
        line: "SRT",
        coordinate: { latitude: 15.1041594, longitude: 102.1828808 },
    },

    {
        name: "บ้านหนองกันงา",
        nameEn: "Ban Nong Kan Nga",
        line: "SRT",
        coordinate: { latitude: 15.1290891, longitude: 102.2060051 },
    },

    {
        name: "หนองแมว",
        nameEn: "Nong Maeo",
        line: "SRT",
        coordinate: { latitude: 15.1405652, longitude: 102.2138967 },
    },

    {
        name: "โนนสูง",
        nameEn: "Non Sung",
        line: "SRT",
        coordinate: { latitude: 15.1766658, longitude: 102.2460522 },
    },

    {
        name: "บ้านดงพลอง",
        nameEn: "Ban Dong Phlong",
        line: "SRT",
        coordinate: { latitude: 15.2268391, longitude: 102.287044 },
    },

    {
        name: "บ้านมะค่า",
        nameEn: "Ban Makha",
        line: "SRT",
        coordinate: { latitude: 15.281325, longitude: 102.2912411 },
    },

    {
        name: "เนินถั่วแปบ",
        nameEn: "Noen Thua Paep",
        line: "SRT",
        coordinate: { latitude: 15.3094272, longitude: 102.2983694 },
    },

    {
        name: "พลสงคราม",
        nameEn: "Phon Songkhram",
        line: "SRT",
        coordinate: { latitude: 15.3483115, longitude: 102.3013661 },
    },

    {
        name: "บ้านดอนใหญ่",
        nameEn: "Ban Don Yai",
        line: "SRT",
        coordinate: { latitude: 15.3892418, longitude: 102.3087987 },
    },

    {
        name: "เมืองคง",
        nameEn: "Mueang Khong",
        line: "SRT",
        coordinate: { latitude: 15.445043, longitude: 102.32927 },
    },

    {
        name: "บ้านไร่",
        nameEn: "Ban Rai",
        line: "SRT",
        coordinate: { latitude: 15.4974892, longitude: 102.3646764 },
    },

    {
        name: "โนนทองหลาง",
        nameEn: "Non Thonglang",
        line: "SRT",
        coordinate: { latitude: 15.5128010, longitude: 102.3757797 },
    },

    {
        name: "ห้วยระหัด",
        nameEn: "Huai Rahat",
        line: "SRT",
        coordinate: { latitude: 15.5627436, longitude: 102.4114143 },
    },

    {
        name: "ชุมทางบัวใหญ่",
        nameEn: "Bua Yai Junction",
        line: "SRT",
        coordinate: { latitude: 15.586083, longitude: 102.424715 },
    },

    {
        name: "เนินสวัสดิ์",
        nameEn: "Noen Sawat",
        line: "SRT",
        coordinate: { latitude: 15.6241753, longitude: 102.4595207 },
    },

    {
        name: "หนองบัวลาย",
        nameEn: "Nong Bua Lai",
        line: "SRT",
        coordinate: { latitude: 15.668634, longitude: 102.494864 },
    },

    {
        name: "ศาลาดิน",
        nameEn: "Sala Din",
        line: "SRT",
        coordinate: { latitude: 15.7062265, longitude: 102.5231332 },
    },

    {
        name: "หนองมะเขือ",
        nameEn: "Nong Makhuea",
        line: "SRT",
        coordinate: { latitude: 15.7584027, longitude: 102.5671728 },
    },

    {
        name: "เมืองพล",
        nameEn: "Mueang Phon",
        line: "SRT",
        coordinate: { latitude: 15.8196734, longitude: 102.6005195 },
    },

    {
        name: "บ้านหัน",
        nameEn: "Ban Han",
        line: "SRT",
        coordinate: { latitude: 15.9659606, longitude: 102.6936676 },
    },

    {
        name: "บ้านไผ่",
        nameEn: "Ban Phai",
        line: "SRT",
        coordinate: { latitude: 16.0587225, longitude: 102.7225641 },
    },

    {
        name: "บ้านแฮด",
        nameEn: "Ban Haet",
        line: "SRT",
        coordinate: { latitude: 16.1977256, longitude: 102.7662870 },
    },

    {
        name: "ท่าพระ",
        nameEn: "Tha Phra",
        line: "SRT",
        coordinate: { latitude: 16.3399, longitude: 102.802806 },
    },

    {
        name: "ขอนแก่น",
        nameEn: "Khon Kaen",
        line: "SRT",
        coordinate: { latitude: 16.4268083, longitude: 102.8256655 },
    },

    {
        name: "สำราญ",
        nameEn: "Samran",
        line: "SRT",
        coordinate: { latitude: 16.5171529, longitude: 102.8390038 },
    },

    {
        name: "โนนพะยอม",
        nameEn: "Non Phayom",
        line: "SRT",
        coordinate: { latitude: 16.6432600, longitude: 102.8186100 },
    },

    {
        name: "บ้านวังชัย",
        nameEn: "Ban Wang Chai",
        line: "SRT",
        coordinate: { latitude: 16.6787527, longitude: 102.8460197 },
    },

    {
        name: "น้ำพอง",
        nameEn: "Nam Phong",
        line: "SRT",
        coordinate: { latitude: 16.7093703, longitude: 102.8589614 },
    },

    {
        name: "ห้วยเสียว",
        nameEn: "Huai Siao",
        line: "SRT",
        coordinate: { latitude: 16.7569614, longitude: 102.8708395 },
    },

    {
        name: "เขาสวนกวาง",
        nameEn: "Khao Suan Kwang",
        line: "SRT",
        coordinate: { latitude: 16.8500684, longitude: 102.8765124 },
    },

    {
        name: "โนนสะอาด",
        nameEn: "Non Sa-at",
        line: "SRT",
        coordinate: { latitude: 16.967191, longitude: 102.89514 },
    },

    {
        name: "ห้วยเกิ้ง",
        nameEn: "Huai Koeng",
        line: "SRT",
        coordinate: { latitude: 17.042485, longitude: 102.9237871 },
    },

    {
        name: "กุมภวาปี",
        nameEn: "Kumphawapi",
        line: "SRT",
        coordinate: { latitude: 17.1220166, longitude: 102.9459798 },
    },

    {
        name: "ห้วยสามพาด",
        nameEn: "Huai Sam Phat",
        line: "SRT",
        coordinate: { latitude: 17.209322, longitude: 102.93401 },
    },

    {
        name: "หนองตะไก้",
        nameEn: "Nong Takai",
        line: "SRT",
        coordinate: { latitude: 17.2672593, longitude: 102.8903462 },
    },

    {
        name: "คำกลิ้ง",
        nameEn: "Kham Kling",
        line: "SRT",
        coordinate: { latitude: 17.3506559, longitude: 102.8315646 },
    },

    {
        name: "หนองขอนกว้าง",
        nameEn: "Nong Khon Kwang",
        line: "SRT",
        coordinate: { latitude: 17.3752209, longitude: 102.8089102 },
    },

    {
        name: "อุดรธานี",
        nameEn: "Udon Thani",
        line: "SRT",
        coordinate: { latitude: 17.4042207, longitude: 102.8031704 },
    },

    {
        name: "นาพู่",
        nameEn: "Na Phu",
        line: "SRT",
        coordinate: { latitude: 17.6206034, longitude: 102.7685578 },
    },

    {
        name: "นาทา",
        nameEn: "Na Tha",
        line: "SRT",
        coordinate: { latitude: 17.8420164, longitude: 102.746004 },
    },

    {
        name: "หนองคาย",
        nameEn: "Nong Khai",
        line: "SRT",
        coordinate: { latitude: 17.8645794, longitude: 102.729188 },
    },

    {
        name: "บ้านช่องใต้",
        nameEn: "Ban Chong Tai",
        line: "SRT",
        coordinate: { latitude: 14.6151602, longitude: 101.0159696 },
    },

    {
        name: "เขาคอก",
        nameEn: "Khao Khok",
        line: "SRT",
        coordinate: { latitude: 14.6629167, longitude: 101.0170703 },
    },

    {
        name: "เขาหินดาด",
        nameEn: "Khao Hin Dat",
        line: "SRT",
        coordinate: { latitude: 14.7155333, longitude: 101.0089976 },
    },

    {
        name: "หินซ้อน",
        nameEn: "Hin Son",
        line: "SRT",
        coordinate: { latitude: 14.7412602, longitude: 101.049172 },
    },

    {
        name: "เขาสูง",
        nameEn: "Khao Sung",
        line: "SRT",
        coordinate: { latitude: 14.7800392, longitude: 101.0544809 },
    },

    {
        name: "แก่งเสือเต้น",
        nameEn: "Kaeng Suea Ten",
        line: "SRT",
        coordinate: { latitude: 14.842427, longitude: 101.0598239 },
    },

    {
        name: "เขื่อนป่าสักชลสิทธิ์",
        nameEn: "Pasak Jolasid Dam",
        line: "SRT",
        coordinate: { latitude: 14.8668986, longitude: 101.0620622 },
    },

    {
        name: "บ้านหนองบัว",
        nameEn: "Ban Nong Bua",
        line: "SRT",
        coordinate: { latitude: 14.8976816, longitude: 101.0519994 },
    },

    {
        name: "โคกสลุง",
        nameEn: "Khok Salung",
        line: "SRT",
        coordinate: { latitude: 14.9868509, longitude: 101.0187406 },
    },

    {
        name: "สุรนารายณ์",
        nameEn: "Suranarai",
        line: "SRT",
        coordinate: { latitude: 15.0698103, longitude: 101.0148873 },
    },

    {
        name: "โรงเรียนอัสสัมชัญคอนแวนต์",
        nameEn: "Assumption Convent School",
        line: "SRT",
        coordinate: { latitude: 15.1356396, longitude: 101.0436172 },
    },

    {
        name: "เขายายกะตา",
        nameEn: "Khao Yai Ka Ta",
        line: "SRT",
        coordinate: { latitude: 15.1737744, longitude: 101.0689048 },
    },

    {
        name: "ตลาดลำนารายณ์",
        nameEn: "Talat Lam Narai",
        line: "SRT",
        coordinate: { latitude: 15.2104969, longitude: 101.130776 },
    },

    {
        name: "ลำนารายณ์",
        nameEn: "Lam Narai",
        line: "SRT",
        coordinate: { latitude: 15.215253, longitude: 101.1308504 },
    },

    {
        name: "บ้านเกาะรัง",
        nameEn: "Ban Ko Rang",
        line: "SRT",
        coordinate: { latitude: 15.2790836, longitude: 101.220711 },
    },

    {
        name: "แผ่นดินทอง",
        nameEn: "Phaendin Thong",
        line: "SRT",
        coordinate: { latitude: 15.2503052, longitude: 101.2565078 },
    },

    {
        name: "บ้านจงโก",
        nameEn: "Ban Chongko",
        line: "SRT",
        coordinate: { latitude: 15.2626301, longitude: 101.3363414 },
    },

    {
        name: "โคกคลี",
        nameEn: "Khok Khli",
        line: "SRT",
        coordinate: { latitude: 15.2746073, longitude: 101.3671196 },
    },

    {
        name: "ช่องสำราญ",
        nameEn: "Chong Samran",
        line: "SRT",
        coordinate: { latitude: 15.3520956, longitude: 101.3827743 },
    },

    {
        name: "บ้านวะตะแบก (เทพสถิต)",
        nameEn: "Ban Wa Tabaek (Thep Sathit)",
        line: "SRT",
        coordinate: { latitude: 15.3971539, longitude: 101.4536304 },
    },

    {
        name: "ห้วยยายจิ๋ว",
        nameEn: "Huai Yai Chio",
        line: "SRT",
        coordinate: { latitude: 15.4245, longitude: 101.528806 },
    },

    {
        name: "บ้านปากจาบ",
        nameEn: "Ban Pak Chap",
        line: "SRT",
        coordinate: { latitude: 15.435778, longitude: 101.5936993 },
    },

    {
        name: "บำเหน็จณรงค์",
        nameEn: "Bamnet Narong",
        line: "SRT",
        coordinate: { latitude: 15.468585, longitude: 101.6812011 },
    },

    {
        name: "บ้านกลอย",
        nameEn: "Ban Kloi",
        line: "SRT",
        coordinate: { latitude: 15.479546, longitude: 101.7081364 },
    },

    {
        name: "วังกะอาม",
        nameEn: "Wang Ka-am",
        line: "SRT",
        coordinate: { latitude: 15.4984072, longitude: 101.7401798 },
    },

    {
        name: "โนนคร้อ",
        nameEn: "Non Khro",
        line: "SRT",
        coordinate: { latitude: 15.52269, longitude: 101.7720646 },
    },

    {
        name: "จัตุรัส",
        nameEn: "Chatturat",
        line: "SRT",
        coordinate: { latitude: 15.5557238, longitude: 101.8377192 },
    },

    {
        name: "หนองฉิม",
        nameEn: "Nong Chim",
        line: "SRT",
        coordinate: { latitude: 15.5717, longitude: 101.950806 },
    },

    {
        name: "บ้านตาเนิน",
        nameEn: "Ban Ta Noen",
        line: "SRT",
        coordinate: { latitude: 15.5772825, longitude: 102.0207498 },
    },

    {
        name: "บ้านหนองขาม",
        nameEn: "Ban Nong Kham",
        line: "SRT",
        coordinate: { latitude: 15.5830984, longitude: 102.0560986 },
    },

    {
        name: "บ้านเหลื่อม",
        nameEn: "Ban Lueam",
        line: "SRT",
        coordinate: { latitude: 15.6001691, longitude: 102.1199677 },
    },

    {
        name: "บ้านโคกกระเบื้อง",
        nameEn: "Ban Khok Krabueang",
        line: "SRT",
        coordinate: { latitude: 15.6070156, longitude: 102.1646688 },
    },

    {
        name: "บ้านหนองปรือโป่ง",
        nameEn: "Ban Nong Prue Pong",
        line: "SRT",
        coordinate: { latitude: 15.6019414, longitude: 102.2173739 },
    },

    {
        name: "หนองพลวง",
        nameEn: "Nong Phluang",
        line: "SRT",
        coordinate: { latitude: 15.599, longitude: 102.2448801 },
    },

    {
        name: "บ้านกระพี้",
        nameEn: "Ban Kraphi",
        line: "SRT",
        coordinate: { latitude: 15.6018122, longitude: 102.2761209 },
    },

    {
        name: "บ้านเก่างิ้ว",
        nameEn: "Ban Kao Ngio",
        line: "SRT",
        coordinate: { latitude: 15.6054333, longitude: 102.2941322 },
    },

    {
        name: "บ้านสระครก",
        nameEn: "Ban Sa Khrok",
        line: "SRT",
        coordinate: { latitude: 15.6044548, longitude: 102.3117991 },
    },

    {
        name: "บ้านโสกรัง",
        nameEn: "Ban Sok Rang",
        line: "SRT",
        coordinate: { latitude: 15.5984539, longitude: 102.3513598 },
    },

    {
        name: "อุรุพงษ์",
        nameEn: "Uruphong",
        line: "SRT",
        coordinate: { latitude: 13.7585749, longitude: 100.5263062 },
    },

    {
        name: "พญาไท",
        nameEn: "Phaya Thai",
        line: "SRT",
        coordinate: { latitude: 13.7570106, longitude: 100.5331942 },
    },

    {
        name: "ราชปรารภ",
        nameEn: "Ratchaprarop",
        line: "SRT",
        coordinate: { latitude: 13.7550849, longitude: 100.541873 },
    },

    {
        name: "มักกะสัน",
        nameEn: "Makkasan",
        line: "SRT",
        coordinate: { latitude: 13.7538606, longitude: 100.5473663 },
    },

    {
        name: "อโศก",
        nameEn: "Asok",
        line: "SRT",
        coordinate: { latitude: 13.7500289, longitude: 100.5641274 },
    },

    {
        name: "คลองตัน",
        nameEn: "Khlong Tan",
        line: "SRT",
        coordinate: { latitude: 13.744097, longitude: 100.5874905 },
    },

    {
        name: "หัวหมาก",
        nameEn: "Hua Mak",
        line: "SRT",
        coordinate: { latitude: 13.7381496, longitude: 100.6360654 },
    },

    {
        name: "บ้านทับช้าง",
        nameEn: "Ban Thap Chang",
        line: "SRT",
        coordinate: { latitude: 13.7331092, longitude: 100.6846004 },
    },

    {
        name: "ลาดกระบัง",
        nameEn: "Lat Krabang",
        line: "SRT",
        coordinate: { latitude: 13.7276159, longitude: 100.7464359 },
    },

    {
        name: "พระจอมเกล้า",
        nameEn: "Phra Chom Klao",
        line: "SRT",
        coordinate: { latitude: 13.7281797, longitude: 100.7754678 },
    },

    {
        name: "หัวตะเข้",
        nameEn: "Hua Takhe",
        line: "SRT",
        coordinate: { latitude: 13.7282555, longitude: 100.7806738 },
    },

    {
        name: "คลองหลวงแพ่ง",
        nameEn: "Khlong Luang Phaeng",
        line: "SRT",
        coordinate: { latitude: 13.7202137, longitude: 100.8609417 },
    },

    {
        name: "คลองอุดมชลจร",
        nameEn: "Khlong Udom Chonlajorn",
        line: "SRT",
        coordinate: { latitude: 13.715861, longitude: 100.8969339 },
    },

    {
        name: "คลองเปรง",
        nameEn: "Khlong Preng",
        line: "SRT",
        coordinate: { latitude: 13.7125116, longitude: 100.9227899 },
    },

    {
        name: "คลองแขวงกลั่น",
        nameEn: "Khlong Kwaeng Klan",
        line: "SRT",
        coordinate: { latitude: 13.7071179, longitude: 100.9665439 },
    },

    {
        name: "คลองบางพระ",
        nameEn: "Khlong Bang Phra",
        line: "SRT",
        coordinate: { latitude: 13.7041805, longitude: 100.9892134 },
    },

    {
        name: "บางเตย",
        nameEn: "Bang Toey",
        line: "SRT",
        coordinate: { latitude: 13.7006141, longitude: 101.0186541 },
    },

    {
        name: "ชุมทางฉะเชิงเทรา",
        nameEn: "Chachoengsao Junction",
        line: "SRT",
        coordinate: { latitude: 13.6954084, longitude: 101.0550477 },
    },

    {
        name: "โพรงอากาศ",
        nameEn: "Phrong Akat",
        line: "SRT",
        coordinate: { latitude: 13.8089152, longitude: 101.094369 },
    },

    {
        name: "บางน้ำเปรี้ยว",
        nameEn: "Bang Nam Priao",
        line: "SRT",
        coordinate: { latitude: 13.8506235, longitude: 101.0995717 },
    },

    {
        name: "ชุมทางคลองสิบเก้า",
        nameEn: "Khlong Sip Kao Junction",
        line: "SRT",
        coordinate: { latitude: 13.9075082, longitude: 101.1118192 },
    },

    {
        name: "คลองยี่สิบเอ็ด",
        nameEn: "Klong Yi Sib Et",
        line: "SRT",
        coordinate: { latitude: 13.9386245, longitude: 101.1271106 },
    },

    {
        name: "โยทะกา",
        nameEn: "Yothaka",
        line: "SRT",
        coordinate: { latitude: 13.9708418, longitude: 101.1453522 },
    },

    {
        name: "บ้านสร้าง",
        nameEn: "Ban Sang",
        line: "SRT",
        coordinate: { latitude: 14.0151311, longitude: 101.2007004 },
    },

    {
        name: "หนองน้ำขาว",
        nameEn: "Nong Nam Khao",
        line: "SRT",
        coordinate: { latitude: 14.0495091, longitude: 101.2683341 },
    },

    {
        name: "บ้านปากพลี",
        nameEn: "Ban Pak Phli",
        line: "SRT",
        coordinate: { latitude: 14.074349, longitude: 101.3130604 },
    },

    {
        name: "ปราจีนบุรี",
        nameEn: "Prachin Buri",
        line: "SRT",
        coordinate: { latitude: 14.0709368, longitude: 101.3736795 },
    },

    {
        name: "หนองกระจับ",
        nameEn: "Nong Krachap",
        line: "SRT",
        coordinate: { latitude: 14.0631131, longitude: 101.4143568 },
    },

    {
        name: "โคกมะกอก",
        nameEn: "Khok Makok",
        line: "SRT",
        coordinate: { latitude: 14.0647548, longitude: 101.4553677 },
    },

    {
        name: "ประจันตคาม",
        nameEn: "Prachantakham",
        line: "SRT",
        coordinate: { latitude: 14.0631418, longitude: 101.5164531 },
    },

    {
        name: "หนองแสง",
        nameEn: "Nong Seang",
        line: "SRT",
        coordinate: { latitude: 14.0521964, longitude: 101.5704863 },
    },

    {
        name: "บ้านดงบัง",
        nameEn: "Ban Dong Bang",
        line: "SRT",
        coordinate: { latitude: 14.040424, longitude: 101.5966179 },
    },

    {
        name: "หนองศรีวิชัย",
        nameEn: "Nong Si Wichai",
        line: "SRT",
        coordinate: { latitude: 14.0326716, longitude: 101.617804 },
    },

    {
        name: "บ้านพรมแสง",
        nameEn: "Ban Phrom Saeng",
        line: "SRT",
        coordinate: { latitude: 14.0224971, longitude: 101.6423802 },
    },

    {
        name: "บ้านเกาะแดง",
        nameEn: "Ban Ko Deang",
        line: "SRT",
        coordinate: { latitude: 14.0073655, longitude: 101.6790675 },
    },

    {
        name: "กบินทร์บุรี",
        nameEn: "Kabin Buri",
        line: "SRT",
        coordinate: { latitude: 13.9896447, longitude: 101.6897654 },
    },

    {
        name: "กบินทร์เก่า",
        nameEn: "Kabin Kao",
        line: "SRT",
        coordinate: { latitude: 13.9968406, longitude: 101.7611728 },
    },

    {
        name: "หนองสัง",
        nameEn: "Nong Sang",
        line: "SRT",
        coordinate: { latitude: 13.9807138, longitude: 101.8212712 },
    },

    {
        name: "พระปรง",
        nameEn: "Phra Prong",
        line: "SRT",
        coordinate: { latitude: 13.9524985, longitude: 101.9235056 },
    },

    {
        name: "บ้านแก้ง",
        nameEn: "Ban Kaeng",
        line: "SRT",
        coordinate: { latitude: 13.917292, longitude: 101.9649201 },
    },

    {
        name: "ศาลาลำดวน",
        nameEn: "Sala Lamduan",
        line: "SRT",
        coordinate: { latitude: 13.8828519, longitude: 102.0096136 },
    },

    {
        name: "สระแก้ว",
        nameEn: "Sa Kaeo",
        line: "SRT",
        coordinate: { latitude: 13.8271516, longitude: 102.0729008 },
    },

    {
        name: "ศูนย์ราชการจังหวัดสระแก้ว",
        nameEn: "Sa Kaeo Provincial Office",
        line: "SRT",
        coordinate: { latitude: 13.7996319, longitude: 102.1392566 },
    },

    {
        name: "ท่าเกษม",
        nameEn: "Tha Kasem",
        line: "SRT",
        coordinate: { latitude: 13.7903475, longitude: 102.1685781 },
    },

    {
        name: "ห้วยโจด",
        nameEn: "Huai Chot",
        line: "SRT",
        coordinate: { latitude: 13.770513, longitude: 102.2312053 },
    },

    {
        name: "วัฒนานคร",
        nameEn: "Watthana Nakhon",
        line: "SRT",
        coordinate: { latitude: 13.74114, longitude: 102.3216007 },
    },

    {
        name: "บ้านโป่งคอม",
        nameEn: "Ban Pong Khom",
        line: "SRT",
        coordinate: { latitude: 13.7246802, longitude: 102.3805079 },
    },

    {
        name: "ห้วยเดื่อ",
        nameEn: "Huai Duea",
        line: "SRT",
        coordinate: { latitude: 13.7129193, longitude: 102.4223798 },
    },

    {
        name: "อรัญประเทศ",
        nameEn: "Aranyaprathet",
        line: "SRT",
        coordinate: { latitude: 13.6927071, longitude: 102.5052012 },
    },

    {
        name: "ด่านพรมแดนบ้านคลองลึก",
        nameEn: "Ban Klong Luk Border",
        line: "SRT",
        coordinate: { latitude: 13.6627492, longitude: 102.5464782 },
    },

    {
        name: "องครักษ์",
        nameEn: "Ongkharak",
        line: "SRT",
        coordinate: { latitude: 14.1344969, longitude: 100.9839377 },
    },

    {
        name: "วิหารแดง",
        nameEn: "Wihan Daeng",
        line: "SRT",
        coordinate: { latitude: 14.3394455, longitude: 100.9784401 },
    },

    {
        name: "บุใหญ่",
        nameEn: "Bu Yai",
        line: "SRT",
        coordinate: { latitude: 14.4285047, longitude: 101.0041166 },
    },

    {
        name: "ชุมทางบ้านไผ่นาบุญ",
        nameEn: "Ban Phai Na Bun Junction",
        line: "SRT",
        coordinate: { latitude: 14.5487424, longitude: 100.9830144 },
    },

    {
        name: "แปดริ้ว",
        nameEn: "Paet Rio",
        line: "SRT",
        coordinate: { latitude: 13.6933234, longitude: 101.0768337 },
    },

    {
        name: "ดอนสีนนท์",
        nameEn: "Don Si Non",
        line: "SRT",
        coordinate: { latitude: 13.6011, longitude: 101.106806 },
    },

    {
        name: "พานทอง",
        nameEn: "Phan Thong",
        line: "SRT",
        coordinate: { latitude: 13.4629483, longitude: 101.0791165 },
    },

    {
        name: "ชลบุรี",
        nameEn: "Chon Buri",
        line: "SRT",
        coordinate: { latitude: 13.3423084, longitude: 100.9959791 },
    },

    {
        name: "บางพระ",
        nameEn: "Bang Phra",
        line: "SRT",
        coordinate: { latitude: 13.2357459, longitude: 100.949314 },
    },

    {
        name: "เขาพระบาท",
        nameEn: "Khao Phra Bat",
        line: "SRT",
        coordinate: { latitude: 13.2024409, longitude: 100.9416248 },
    },

    {
        name: "ชุมทางศรีราชา",
        nameEn: "Si Racha Junction",
        line: "SRT",
        coordinate: { latitude: 13.1562459, longitude: 100.9435882 },
    },

    {
        name: "แหลมฉบัง",
        nameEn: "Laem Chabang",
        line: "SRT",
        coordinate: { latitude: 13.0989023, longitude: 100.8962775 },
    },

    {
        name: "บางละมุง",
        nameEn: "Bang Lamung",
        line: "SRT",
        coordinate: { latitude: 13.0344892, longitude: 100.9400616 },
    },

    {
        name: "พัทยา",
        nameEn: "Pattaya",
        line: "SRT",
        coordinate: { latitude: 12.9402010, longitude: 100.9094181 },
    },

    {
        name: "พัทยาใต้",
        nameEn: "Pattaya Tai",
        line: "SRT",
        coordinate: { latitude: 12.9084474, longitude: 100.9012331 },
    },

    {
        name: "ตลาดน้ำ ๔ ภาค",
        nameEn: "Four Regions Floating Market",
        line: "SRT",
        coordinate: { latitude: 12.8696752, longitude: 100.909609 },
    },

    {
        name: "บ้านห้วยขวาง",
        nameEn: "Ban Huai Khwang",
        line: "SRT",
        coordinate: { latitude: 12.8262866, longitude: 100.9172092 },
    },

    {
        name: "ญาณสังวราราม",
        nameEn: "Yanasangwararam",
        line: "SRT",
        coordinate: { latitude: 12.8014017, longitude: 100.9203033 },
    },

    {
        name: "สวนนงนุช",
        nameEn: "Suan Nong Nuch",
        line: "SRT",
        coordinate: { latitude: 12.7746754, longitude: 100.9242303 },
    },

    {
        name: "ชุมทางเขาชีจรรย์",
        nameEn: "Khao Chi Chan Junction",
        line: "SRT",
        coordinate: { latitude: 12.7335388, longitude: 100.9523097 },
    },

    {
        name: "บ้านพลูตาหลวง",
        nameEn: "Ban Phlu Ta Luang",
        line: "SRT",
        coordinate: { latitude: 12.704566, longitude: 100.9702802 },
    },

    {
        name: "บ้านฉาง",
        nameEn: "Ban Chang",
        line: "SRT",
        coordinate: { latitude: 12.7065161, longitude: 101.0531822 },
    },

    {
        name: "มาบตาพุด",
        nameEn: "Map Ta Phut",
        line: "SRT",
        coordinate: { latitude: 12.691355, longitude: 101.126141 },
    },

    {
        name: "แม่น้ำ",
        nameEn: "Mae Nam",
        line: "SRT",
        coordinate: { latitude: 13.7139353, longitude: 100.5514228 },
    },

    {
        name: "บางซ่อน",
        nameEn: "Bang Son",
        line: "SRT",
        coordinate: { latitude: 13.8220408, longitude: 100.4023692 },
    },

    {
        name: "บางบำหรุ",
        nameEn: "Bang Bamru",
        line: "SRT",
        coordinate: { latitude: 13.791703, longitude: 100.4754636 },
    },

    {
        name: "ชุมทางตลิ่งชัน",
        nameEn: "Taling Chan Junction",
        line: "SRT",
        coordinate: { latitude: 13.789372, longitude: 100.4371606 },
    },

    {
        name: "ธนบุรี",
        nameEn: "Thonburi",
        line: "SRT",
        coordinate: { latitude: 13.7605789, longitude: 100.4766749 },
    },

    {
        name: "จรัลสนิทวงศ์",
        nameEn: "Charan Sanitwong",
        line: "SRT",
        coordinate: { latitude: 13.7631788, longitude: 100.4725817 },
    },

    {
        name: "บางระมาด",
        nameEn: "Bang Ramat",
        line: "SRT",
        coordinate: { latitude: 13.7784563, longitude: 100.4535109 },
    },

    {
        name: "บ้านฉิมพลี",
        nameEn: "Ban Chimphli",
        line: "SRT",
        coordinate: { latitude: 13.7991608, longitude: 100.4205975 },
    },

    {
        name: "พุทธมณฑล สาย 2",
        nameEn: "Phutthamonthon Sai 2",
        line: "SRT",
        coordinate: { latitude: 13.8000368, longitude: 100.3950605 },
    },

    {
        name: "ศาลาธรรมสพน์",
        nameEn: "Sala Thammasop",
        line: "SRT",
        coordinate: { latitude: 13.8010245, longitude: 100.3685951 },
    },

    {
        name: "ศาลายา",
        nameEn: "Sala Ya",
        line: "SRT",
        coordinate: { latitude: 13.8025755, longitude: 100.2584291 },
    },

    {
        name: "วัดสุวรรณ",
        nameEn: "Wat Suwan",
        line: "SRT",
        coordinate: { latitude: 13.8057625, longitude: 100.281536 },
    },

    {
        name: "คลองมหาสวัสดิ์",
        nameEn: "Khlong Maha Sawat",
        line: "SRT",
        coordinate: { latitude: 13.8088548, longitude: 100.2507309 },
    },

    {
        name: "วัดงิ้วราย",
        nameEn: "Wat Ngio Rai",
        line: "SRT",
        coordinate: { latitude: 13.8080247, longitude: 100.2138758 },
    },

    {
        name: "นครชัยศรี",
        nameEn: "Nakhon Chai Si",
        line: "SRT",
        coordinate: { latitude: 13.8063448, longitude: 100.1739678 },
    },

    {
        name: "ท่าแฉลบ",
        nameEn: "Tha Chalaep",
        line: "SRT",
        coordinate: { latitude: 13.8123359, longitude: 100.1295536 },
    },

    {
        name: "ต้นสำโรง",
        nameEn: "Ton Samrong",
        line: "SRT",
        coordinate: { latitude: 13.8255569, longitude: 100.0891147 },
    },

    {
        name: "นครปฐม",
        nameEn: "Nakhon Pathom",
        line: "SRT",
        coordinate: { latitude: 13.824375, longitude: 100.0572259 },
    },

    {
        name: "พระราชวังสนามจันทร์",
        nameEn: "Sanam Chandra Palace",
        line: "SRT",
        coordinate: { latitude: 13.8238866, longitude: 100.0413206 },
    },

    {
        name: "โพรงมะเดื่อ",
        nameEn: "Prong Maduea",
        line: "SRT",
        coordinate: { latitude: 13.822378, longitude: 99.9903015 },
    },

    {
        name: "คลองบางตาล",
        nameEn: "Khlong Bang Tan",
        line: "SRT",
        coordinate: { latitude: 13.8211447, longitude: 99.9549602 },
    },

    {
        name: "ชุมทางหนองปลาดุก",
        nameEn: "Nong Pla Duk Junction",
        line: "SRT",
        coordinate: { latitude: 13.8182546, longitude: 99.9100346 },
    },

    {
        name: "บ้านโป่ง",
        nameEn: "Ban Pong",
        line: "SRT",
        coordinate: { latitude: 13.8108592, longitude: 99.8734537 },
    },

    {
        name: "นครชุมน์",
        nameEn: "Nakhon Chum",
        line: "SRT",
        coordinate: { latitude: 13.7659539, longitude: 99.8531579 },
    },

    {
        name: "คลองตาคด",
        nameEn: "Khlong Ta Khot",
        line: "SRT",
        coordinate: { latitude: 13.7339612, longitude: 99.8476011 },
    },

    {
        name: "โพธาราม",
        nameEn: "Photharam",
        line: "SRT",
        coordinate: { latitude: 13.6932802, longitude: 99.8505837 },
    },

    {
        name: "เจ็ดเสมียน",
        nameEn: "Chet Samian",
        line: "SRT",
        coordinate: { latitude: 13.6362661, longitude: 99.8169395 },
    },

    {
        name: "บ้านกล้วย",
        nameEn: "Ban Kluai",
        line: "SRT",
        coordinate: { latitude: 13.588612, longitude: 99.8132092 },
    },

    {
        name: "ราชบุรี",
        nameEn: "Ratchaburi",
        line: "SRT",
        coordinate: { latitude: 13.5305721, longitude: 99.8216697 },
    },

    {
        name: "บ้านคูบัว",
        nameEn: "Ban Khu Bua",
        line: "SRT",
        coordinate: { latitude: 13.4931159, longitude: 99.826146 },
    },

    {
        name: "บ่อตะคร้อ",
        nameEn: "Bo Takhro",
        line: "SRT",
        coordinate: { latitude: 13.4414631, longitude: 99.832577 },
    },

    {
        name: "บ้านป่าไก่",
        nameEn: "Ban Pa Kai",
        line: "SRT",
        coordinate: { latitude: 13.4118109, longitude: 99.8388019 },
    },

    {
        name: "ปากท่อ",
        nameEn: "Pak Tho",
        line: "SRT",
        coordinate: { latitude: 13.374766, longitude: 99.8416031 },
    },

    {
        name: "บางเค็ม",
        nameEn: "Bang Khem",
        line: "SRT",
        coordinate: { latitude: 13.2979208, longitude: 99.8534803 },
    },

    {
        name: "เขาย้อย",
        nameEn: "Khao Yoi",
        line: "SRT",
        coordinate: { latitude: 13.2380414, longitude: 99.8588729 },
    },

    {
        name: "หนองปลาไหล",
        nameEn: "Nong Pla Lai",
        line: "SRT",
        coordinate: { latitude: 13.1896162, longitude: 99.869267 },
    },

    {
        name: "บางจาก",
        nameEn: "Bang Chak",
        line: "SRT",
        coordinate: { latitude: 13.1599264, longitude: 99.8996263 },
    },

    {
        name: "เพชรบุรี",
        nameEn: "Phetchaburi",
        line: "SRT",
        coordinate: { latitude: 13.116271, longitude: 99.938958 },
    },

    {
        name: "เขาทโมน",
        nameEn: "Khao Thamon",
        line: "SRT",
        coordinate: { latitude: 13.039675, longitude: 99.9555541 },
    },

    {
        name: "หนองไม้เหลือง",
        nameEn: "Nong Mai Lueang",
        line: "SRT",
        coordinate: { latitude: 13.0036962, longitude: 99.9579315 },
    },

    {
        name: "หนองจอก",
        nameEn: "Nong Chok",
        line: "SRT",
        coordinate: { latitude: 12.9537946, longitude: 99.9641805 },
    },

    {
        name: "หนองศาลา",
        nameEn: "Nong Sala",
        line: "SRT",
        coordinate: { latitude: 12.9036526, longitude: 99.968421 },
    },

    {
        name: "ชะอำ",
        nameEn: "Cha-am",
        line: "SRT",
        coordinate: { latitude: 12.7992155, longitude: 99.9634952 },
    },

    {
        name: "ห้วยทรายเหนือ",
        nameEn: "Huai Sai Nuea",
        line: "SRT",
        coordinate: { latitude: 12.7035640, longitude: 99.9502306 },
    },

    {
        name: "ห้วยทรายใต้",
        nameEn: "Huai Sai Tai",
        line: "SRT",
        coordinate: { latitude: 12.6688568, longitude: 99.9464966 },
    },

    {
        name: "หัวหิน",
        nameEn: "Hua Hin",
        line: "SRT",
        coordinate: { latitude: 12.5673417, longitude: 99.9525161 },
    },

    {
        name: "หนองแก",
        nameEn: "Nong Kae",
        line: "SRT",
        coordinate: { latitude: 12.5327549, longitude: 99.9622414 },
    },

    {
        name: "สวนสนประดิพัทธ์",
        nameEn: "Suan Son Pradiphat",
        line: "SRT",
        coordinate: { latitude: 12.4999283, longitude: 99.9722806 },
    },

    {
        name: "เขาเต่า",
        nameEn: "Khao Tao",
        line: "SRT",
        coordinate: { latitude: 12.4590773, longitude: 99.9676389 },
    },

    {
        name: "วังก์พง",
        nameEn: "Wang Phong",
        line: "SRT",
        coordinate: { latitude: 12.4022861, longitude: 99.9307152 },
    },

    {
        name: "ปราณบุรี",
        nameEn: "Pran Buri",
        line: "SRT",
        coordinate: { latitude: 12.3765821, longitude: 99.9218489 },
    },

    {
        name: "ห้วยขวาง",
        nameEn: "Huai Khwang",
        line: "SRT",
        coordinate: { latitude: 12.3244885, longitude: 99.9110406 },
    },

    {
        name: "หนองคาง",
        nameEn: "Nong Khang",
        line: "SRT",
        coordinate: { latitude: 12.2840163, longitude: 99.888584 },
    },

    {
        name: "สามร้อยยอด",
        nameEn: "Sam Roi Yot",
        line: "SRT",
        coordinate: { latitude: 12.2126695, longitude: 99.8724037 },
    },

    {
        name: "สามกระทาย",
        nameEn: "Sam Krathai",
        line: "SRT",
        coordinate: { latitude: 12.1605798, longitude: 99.8607101 },
    },

    {
        name: "กุยบุรี",
        nameEn: "Kui Buri",
        line: "SRT",
        coordinate: { latitude: 12.0688095, longitude: 99.8690358 },
    },

    {
        name: "บ่อนอก",
        nameEn: "Bo Nok",
        line: "SRT",
        coordinate: { latitude: 12.0039889, longitude: 99.8563904 },
    },

    {
        name: "ทุ่งมะเม่า",
        nameEn: "Thung Mamao",
        line: "SRT",
        coordinate: { latitude: 11.9211908, longitude: 99.8166857 },
    },

    {
        name: "คั่นกระได",
        nameEn: "Khan Kradai",
        line: "SRT",
        coordinate: { latitude: 11.869587, longitude: 99.8084251 },
    },

    {
        name: "ประจวบคีรีขันธ์",
        nameEn: "Prachuap Khiri Khan",
        line: "SRT",
        coordinate: { latitude: 11.8077762, longitude: 99.7937417 },
    },

    {
        name: "หนองหิน",
        nameEn: "Nong Hin",
        line: "SRT",
        coordinate: { latitude: 11.7421762, longitude: 99.7675179 },
    },

    {
        name: "หว้ากอ",
        nameEn: "Wa Ko",
        line: "SRT",
        coordinate: { latitude: 11.7157664, longitude: 99.7499113 },
    },

    {
        name: "วังด้วน",
        nameEn: "Wang Duan",
        line: "SRT",
        coordinate: { latitude: 11.6888737, longitude: 99.7208011 },
    },

    {
        name: "ห้วยยาง",
        nameEn: "Huai Yang",
        line: "SRT",
        coordinate: { latitude: 11.60468, longitude: 99.669336 },
    },

    {
        name: "ทุ่งประดู่",
        nameEn: "Thung Pradu",
        line: "SRT",
        coordinate: { latitude: 11.5266045, longitude: 99.6358286 },
    },

    {
        name: "ทับสะแก",
        nameEn: "Thap Sakae",
        line: "SRT",
        coordinate: { latitude: 11.4987, longitude: 99.620446 },
    },

    {
        name: "ดอนทราย",
        nameEn: "Don Sai",
        line: "SRT",
        coordinate: { latitude: 11.4569016, longitude: 99.6063103 },
    },

    {
        name: "โคกตาหอม",
        nameEn: "Khok Ta Hom",
        line: "SRT",
        coordinate: { latitude: 11.4060802, longitude: 99.5944197 },
    },

    {
        name: "บ้านกรูด",
        nameEn: "Ban Krut",
        line: "SRT",
        coordinate: { latitude: 11.3490317, longitude: 99.5539953 },
    },

    {
        name: "หนองมงคล",
        nameEn: "Nong Mongkhon",
        line: "SRT",
        coordinate: { latitude: 11.3042356, longitude: 99.5452462 },
    },

    {
        name: "นาผักขวง",
        nameEn: "Na Phak Khuang",
        line: "SRT",
        coordinate: { latitude: 11.2588976, longitude: 99.5310888 },
    },

    {
        name: "บางสะพานใหญ่",
        nameEn: "Bang Saphan Yai",
        line: "SRT",
        coordinate: { latitude: 11.2142762, longitude: 99.5075517 },
    },

    {
        name: "หินกอง",
        nameEn: "Hin Kong",
        line: "SRT",
        coordinate: { latitude: 11.1623143, longitude: 99.4751456 },
    },

    {
        name: "ชะม่วง",
        nameEn: "Cha Muang",
        line: "SRT",
        coordinate: { latitude: 11.1409967, longitude: 99.4731886 },
    },

    {
        name: "บางสะพานน้อย",
        nameEn: "Bang Saphan Noi",
        line: "SRT",
        coordinate: { latitude: 11.0855996, longitude: 99.4463492 },
    },

    {
        name: "ห้วยสัก",
        nameEn: "Huai Sak",
        line: "SRT",
        coordinate: { latitude: 11.0304938, longitude: 99.4105789 },
    },

    {
        name: "บ้านทรายทอง",
        nameEn: "Ban Sai Thong",
        line: "SRT",
        coordinate: { latitude: 10.9988459, longitude: 99.3904498 },
    },

    {
        name: "เขาไชยราช",
        nameEn: "Khao Chai Rat",
        line: "SRT",
        coordinate: { latitude: 10.9583753, longitude: 99.3620528 },
    },

    {
        name: "มาบอำมฤต",
        nameEn: "Map Ammarit",
        line: "SRT",
        coordinate: { latitude: 10.867844, longitude: 99.3410184 },
    },

    {
        name: "บ้านทรัพย์สมบูรณ์",
        nameEn: "Ban Sap Sombun",
        line: "SRT",
        coordinate: { latitude: 10.8081752, longitude: 99.348515 },
    },

    {
        name: "คลองวังช้าง",
        nameEn: "Khlong Wang Chang",
        line: "SRT",
        coordinate: { latitude: 10.752414, longitude: 99.3305381 },
    },

    {
        name: "ปะทิว",
        nameEn: "Pathio",
        line: "SRT",
        coordinate: { latitude: 10.7112273, longitude: 99.3140303 },
    },

    {
        name: "บ้านคอกม้า",
        nameEn: "Ban Khok Ma",
        line: "SRT",
        coordinate: { latitude: 10.6525679, longitude: 99.2740705 },
    },

    {
        name: "สะพลี",
        nameEn: "Sa Phli",
        line: "SRT",
        coordinate: { latitude: 10.6095689, longitude: 99.234881 },
    },

    {
        name: "หนองเนียน",
        nameEn: "Nong Nian",
        line: "SRT",
        coordinate: { latitude: 10.5753782, longitude: 99.2163731 },
    },

    {
        name: "นาชะอัง",
        nameEn: "Na Cha-ang",
        line: "SRT",
        coordinate: { latitude: 10.5366648, longitude: 99.2037712 },
    },

    {
        name: "ชุมพร",
        nameEn: "Chumphon",
        line: "SRT",
        coordinate: { latitude: 10.502997, longitude: 99.173755 },
    },

    {
        name: "แสงแดด",
        nameEn: "Saeng Daet",
        line: "SRT",
        coordinate: { latitude: 10.4737252, longitude: 99.1529506 },
    },

    {
        name: "ทุ่งคา",
        nameEn: "Thung Kha",
        line: "SRT",
        coordinate: { latitude: 10.4025, longitude: 99.135506 },
    },

    {
        name: "วิสัย",
        nameEn: "Wisai",
        line: "SRT",
        coordinate: { latitude: 10.3281558, longitude: 99.1095131 },
    },

    {
        name: "บ้านครน",
        nameEn: "Ban Khron",
        line: "SRT",
        coordinate: { latitude: 10.2804319, longitude: 99.0964616 },
    },

    {
        name: "สวี",
        nameEn: "Sawi",
        line: "SRT",
        coordinate: { latitude: 10.2363, longitude: 99.102606 },
    },

    {
        name: "เขาสวนทุเรียน",
        nameEn: "Khao Suan Thurian",
        line: "SRT",
        coordinate: { latitude: 10.1668222, longitude: 99.1057626 },
    },

    {
        name: "เขาปีบ",
        nameEn: "Khao Pip",
        line: "SRT",
        coordinate: { latitude: 10.1351599, longitude: 99.1040921 },
    },

    {
        name: "ปากตะโก",
        nameEn: "Pak Tako",
        line: "SRT",
        coordinate: { latitude: 10.0919101, longitude: 99.0982331 },
    },

    {
        name: "ท่าทอง",
        nameEn: "Tha Thong",
        line: "SRT",
        coordinate: { latitude: 10.0438934, longitude: 99.0932623 },
    },

    {
        name: "ควนหินมุ้ย",
        nameEn: "Khuan Hin Mui",
        line: "SRT",
        coordinate: { latitude: 10.0098935, longitude: 99.0890329 },
    },

    {
        name: "หลังสวน",
        nameEn: "Lang Suan",
        line: "SRT",
        coordinate: { latitude: 9.9492353, longitude: 99.0742842 },
    },

    {
        name: "คลองขนาน",
        nameEn: "Khlong Khanan",
        line: "SRT",
        coordinate: { latitude: 9.8807576, longitude: 99.0701368 },
    },

    {
        name: "หัวมาด",
        nameEn: "Hua Mat",
        line: "SRT",
        coordinate: { latitude: 9.8321709, longitude: 99.0839583 },
    },

    {
        name: "ละแม",
        nameEn: "Lamae",
        line: "SRT",
        coordinate: { latitude: 9.7747739, longitude: 99.1079077 },
    },

    {
        name: "บ้านดวด",
        nameEn: "Ban Duat",
        line: "SRT",
        coordinate: { latitude: 9.7186172, longitude: 99.121598 },
    },

    {
        name: "คันธุลี",
        nameEn: "Kan Thuli",
        line: "SRT",
        coordinate: { latitude: 9.66661, longitude: 99.143706 },
    },

    {
        name: "ดอนธูป",
        nameEn: "Don Thup",
        line: "SRT",
        coordinate: { latitude: 9.634836, longitude: 99.1509841 },
    },

    {
        name: "ท่าชนะ",
        nameEn: "Tha Chana",
        line: "SRT",
        coordinate: { latitude: 9.5657137, longitude: 99.1629016 },
    },

    {
        name: "บ้านเกาะมุกข์",
        nameEn: "Ban Ko Muk",
        line: "SRT",
        coordinate: { latitude: 9.5095174, longitude: 99.173338 },
    },

    {
        name: "เขาพนมแบก",
        nameEn: "Khao Phanom Baek",
        line: "SRT",
        coordinate: { latitude: 9.4706842, longitude: 99.1793408 },
    },

    {
        name: "ไชยา",
        nameEn: "Chaiya",
        line: "SRT",
        coordinate: { latitude: 9.38851, longitude: 99.193106 },
    },

    {
        name: "ท่าฉาง",
        nameEn: "Tha Chang",
        line: "SRT",
        coordinate: { latitude: 9.2753807, longitude: 99.1993619 },
    },

    {
        name: "คลองขุด",
        nameEn: "Khlong Kut",
        line: "SRT",
        coordinate: { latitude: 9.2469629, longitude: 99.1869023 },
    },

    {
        name: "คลองไทร",
        nameEn: "Khlong Sai",
        line: "SRT",
        coordinate: { latitude: 9.2087730, longitude: 99.1646422 },
    },

    {
        name: "มะลวน",
        nameEn: "Maluan",
        line: "SRT",
        coordinate: { latitude: 9.1654098, longitude: 99.1568739 },
    },

    {
        name: "ชุมทางบ้านทุ่งโพธิ์",
        nameEn: "Ban Thung Pho Junction",
        line: "SRT",
        coordinate: { latitude: 9.1211083, longitude: 99.1994546 },
    },

    {
        name: "สุราษฎร์ธานี",
        nameEn: "Surat Thani",
        line: "SRT",
        coordinate: { latitude: 9.104137, longitude: 99.228286 },
    },

    {
        name: "เขาหัวควาย",
        nameEn: "Khao Hua Khwai",
        line: "SRT",
        coordinate: { latitude: 9.0558382, longitude: 99.2536872 },
    },

    {
        name: "บ่อกรัง",
        nameEn: "Bo Krang",
        line: "SRT",
        coordinate: { latitude: 9.0102709, longitude: 99.2696409 },
    },

    {
        name: "เขาพลู",
        nameEn: "Khao Phlu",
        line: "SRT",
        coordinate: { latitude: 8.973484, longitude: 99.2897851 },
    },

    {
        name: "คลองยา",
        nameEn: "Khlong Ya",
        line: "SRT",
        coordinate: { latitude: 8.9262458, longitude: 99.3012301 },
    },

    {
        name: "บ้านนา",
        nameEn: "Ban Na",
        line: "SRT",
        coordinate: { latitude: 8.8866227, longitude: 99.3104883 },
    },

    {
        name: "ห้วยมุด",
        nameEn: "Huai Mut",
        line: "SRT",
        coordinate: { latitude: 8.83529, longitude: 99.3416603 },
    },

    {
        name: "นาสาร",
        nameEn: "Na San",
        line: "SRT",
        coordinate: { latitude: 8.8352896, longitude: 99.3284744 },
    },

    {
        name: "คลองปราบ",
        nameEn: "Klong Prap",
        line: "SRT",
        coordinate: { latitude: 8.7455991, longitude: 99.3575691 },
    },

    {
        name: "พรุพี",
        nameEn: "Phru Phi",
        line: "SRT",
        coordinate: { latitude: 8.7084466, longitude: 99.351306 },
    },

    {
        name: "คลองสูญ",
        nameEn: "Khlong Sun",
        line: "SRT",
        coordinate: { latitude: 8.6752867, longitude: 99.3555534 },
    },

    {
        name: "บ้านส้อง",
        nameEn: "Ban Song",
        line: "SRT",
        coordinate: { latitude: 8.63367, longitude: 99.370106 },
    },

    {
        name: "บ้านพรุกระแชง",
        nameEn: "Ban Phru Krachaeng",
        line: "SRT",
        coordinate: { latitude: 8.5933688, longitude: 99.4191761 },
    },

    {
        name: "ห้วยปริก",
        nameEn: "Huai Prik",
        line: "SRT",
        coordinate: { latitude: 8.56871, longitude: 99.454406 },
    },

    {
        name: "กระเบียด",
        nameEn: "Krabiat",
        line: "SRT",
        coordinate: { latitude: 8.5251991, longitude: 99.4710183 },
    },

    {
        name: "ทานพอ",
        nameEn: "Than Pho",
        line: "SRT",
        coordinate: { latitude: 8.4671538, longitude: 99.4895773 },
    },

    {
        name: "ฉวาง",
        nameEn: "Chawang",
        line: "SRT",
        coordinate: { latitude: 8.42065, longitude: 99.506206 },
    },

    {
        name: "คลองจันดี",
        nameEn: "Khlong Chan Di",
        line: "SRT",
        coordinate: { latitude: 8.3821501, longitude: 99.5401901 },
    },

    {
        name: "พ่อท่านคล้ายวาจาสิทธิ์",
        nameEn: "Pho Than Khlai Wachasit",
        line: "SRT",
        coordinate: { latitude: 8.3733916, longitude: 99.5436336 },
    },

    {
        name: "หลักช้าง",
        nameEn: "Lak Chang",
        line: "SRT",
        coordinate: { latitude: 8.3221227, longitude: 99.5453378 },
    },

    {
        name: "คลองกุย",
        nameEn: "Khlong Kui",
        line: "SRT",
        coordinate: { latitude: 8.2943774, longitude: 99.5726232 },
    },

    {
        name: "นาบอน",
        nameEn: "Na Bon",
        line: "SRT",
        coordinate: { latitude: 8.2659654, longitude: 99.5938736 },
    },

    {
        name: "คลองจัง",
        nameEn: "Khlong Chang",
        line: "SRT",
        coordinate: { latitude: 8.2409075, longitude: 99.6195524 },
    },

    {
        name: "บ้านเกาะปริง",
        nameEn: "Ban Ko Pring",
        line: "SRT",
        coordinate: { latitude: 8.2132622, longitude: 99.6449462 },
    },

    {
        name: "ชุมทางทุ่งสง",
        nameEn: "Thung Song Junction",
        line: "SRT",
        coordinate: { latitude: 8.170674, longitude: 99.677143 },
    },

    {
        name: "ใสใหญ่",
        nameEn: "Sai Yai",
        line: "SRT",
        coordinate: { latitude: 8.1603919, longitude: 99.7192838 },
    },

    {
        name: "ช่องเขา",
        nameEn: "Chong Khao",
        line: "SRT",
        coordinate: { latitude: 8.14235, longitude: 99.766906 },
    },

    {
        name: "ร่อนพิบูลย์",
        nameEn: "Ron Phibun",
        line: "SRT",
        coordinate: { latitude: 8.1541953, longitude: 99.8385079 },
    },

    {
        name: "ชุมทางเขาชุมทอง",
        nameEn: "Khao Chum Thong Junction",
        line: "SRT",
        coordinate: { latitude: 8.1479203, longitude: 99.8799416 },
    },

    {
        name: "ควนหนองคว้า",
        nameEn: "Khuan Nong Khwa",
        line: "SRT",
        coordinate: { latitude: 8.10427, longitude: 99.934806 },
    },

    {
        name: "บ้านตูล",
        nameEn: "Ban Tun",
        line: "SRT",
        coordinate: { latitude: 8.06102, longitude: 99.959006 },
    },

    {
        name: "บ้านทุ่งค่าย",
        nameEn: "Ban Thung Khai",
        line: "SRT",
        coordinate: { latitude: 7.9940311, longitude: 99.986741 },
    },

    {
        name: "ชะอวด",
        nameEn: "Cha-uat",
        line: "SRT",
        coordinate: { latitude: 7.9671273, longitude: 99.9954053 },
    },

    {
        name: "หนองจิก",
        nameEn: "Nong Chik",
        line: "SRT",
        coordinate: { latitude: 7.9265993, longitude: 100.0064179 },
    },

    {
        name: "บ้านนางหลง",
        nameEn: "Ban Nang Long",
        line: "SRT",
        coordinate: { latitude: 7.9016238, longitude: 100.0118198 },
    },

    {
        name: "บ้านตรอกแค",
        nameEn: "Ban Trok Khae",
        line: "SRT",
        coordinate: { latitude: 7.876722, longitude: 100.019001 },
    },

    {
        name: "บ้านขอนหาด",
        nameEn: "Ban Khon Hat",
        line: "SRT",
        coordinate: { latitude: 7.85516, longitude: 100.026806 },
    },

    {
        name: "แหลมโตนด",
        nameEn: "Laem Tanot",
        line: "SRT",
        coordinate: { latitude: 7.81333, longitude: 100.044806 },
    },

    {
        name: "บ้านสุนทรา",
        nameEn: "Ban Sunthra",
        line: "SRT",
        coordinate: { latitude: 7.780556, longitude: 100.0620071 },
    },

    {
        name: "ปากคลอง",
        nameEn: "Pak Khlong",
        line: "SRT",
        coordinate: { latitude: 7.737112, longitude: 100.0727115 },
    },

    {
        name: "บ้านมะกอกใต้",
        nameEn: "Ban Makok Tai",
        line: "SRT",
        coordinate: { latitude: 7.7015358, longitude: 100.0790956 },
    },

    {
        name: "ชัยบุรี",
        nameEn: "Chai Buri",
        line: "SRT",
        coordinate: { latitude: 7.6752508, longitude: 100.0806575 },
    },

    {
        name: "พัทลุง",
        nameEn: "Phatthalung",
        line: "SRT",
        coordinate: { latitude: 7.620982, longitude: 100.0834172 },
    },

    {
        name: "นาปรือ",
        nameEn: "Na Prue",
        line: "SRT",
        coordinate: { latitude: 7.5939578, longitude: 100.0932206 },
    },

    {
        name: "บ้านค่ายไทย",
        nameEn: "Ban Khai Thai",
        line: "SRT",
        coordinate: { latitude: 7.5548176, longitude: 100.103383 },
    },

    {
        name: "บ้านต้นโดน",
        nameEn: "Ban Ton Don",
        line: "SRT",
        coordinate: { latitude: 7.53114, longitude: 100.107806 },
    },

    {
        name: "บ้านห้วยแตน",
        nameEn: "Ban Huai Taen",
        line: "SRT",
        coordinate: { latitude: 7.5051343, longitude: 100.1162694 },
    },

    {
        name: "เขาชัยสน",
        nameEn: "Khao Chaison",
        line: "SRT",
        coordinate: { latitude: 7.4597904, longitude: 100.1381068 },
    },

    {
        name: "บางแก้ว",
        nameEn: "Bang Kaeo",
        line: "SRT",
        coordinate: { latitude: 7.42203, longitude: 100.164806 },
    },

    {
        name: "ควนพระ",
        nameEn: "Khuan Phra",
        line: "SRT",
        coordinate: { latitude: 7.3757216, longitude: 100.2012519 },
    },

    {
        name: "ควนเคี่ยม",
        nameEn: "Khuan Khiam",
        line: "SRT",
        coordinate: { latitude: 7.3472400, longitude: 100.2309929 },
    },

    {
        name: "หารกง",
        nameEn: "Han Kong",
        line: "SRT",
        coordinate: { latitude: 7.3156585, longitude: 100.2521323 },
    },

    {
        name: "หารเทา",
        nameEn: "Han Thao",
        line: "SRT",
        coordinate: { latitude: 7.2932913, longitude: 100.2699319 },
    },

    {
        name: "วัดควนเผยอ",
        nameEn: "Wat Khuan Phayoe",
        line: "SRT",
        coordinate: { latitude: 7.2594839, longitude: 100.299337 },
    },

    {
        name: "โคกทราย",
        nameEn: "Khok Sai",
        line: "SRT",
        coordinate: { latitude: 7.23788, longitude: 100.3078801 },
    },

    {
        name: "ควนเนียง",
        nameEn: "Khuan Niang",
        line: "SRT",
        coordinate: { latitude: 7.1923733, longitude: 100.3463017 },
    },

    {
        name: "บ้านเกาะใหญ่",
        nameEn: "Ban Ko Yai",
        line: "SRT",
        coordinate: { latitude: 7.145956, longitude: 100.3812241 },
    },

    {
        name: "บางกล่ำ",
        nameEn: "Bang Klam",
        line: "SRT",
        coordinate: { latitude: 7.0875247, longitude: 100.4114725 },
    },

    {
        name: "บ้านดินลาน",
        nameEn: "Ban Din Lan",
        line: "SRT",
        coordinate: { latitude: 7.0475676, longitude: 100.4303699 },
    },

    {
        name: "ชุมทางหาดใหญ่",
        nameEn: "Hat Yai Junction",
        line: "SRT",
        coordinate: { latitude: 7.003904, longitude: 100.465482 },
    },

    {
        name: "นาม่วง",
        nameEn: "Na Muang",
        line: "SRT",
        coordinate: { latitude: 6.96555, longitude: 100.552806 },
    },

    {
        name: "วัดควนมีด",
        nameEn: "Wat Khuan Mit",
        line: "SRT",
        coordinate: { latitude: 6.9720585, longitude: 100.6663437 },
    },

    {
        name: "จะนะ",
        nameEn: "Chana",
        line: "SRT",
        coordinate: { latitude: 6.909151, longitude: 100.7400668 },
    },

    {
        name: "ท่าแมงลัก",
        nameEn: "Tha Maenglak",
        line: "SRT",
        coordinate: { latitude: 6.9473613, longitude: 100.4964097 },
    },

    {
        name: "เกาะสะบ้า",
        nameEn: "Ko Saba",
        line: "SRT",
        coordinate: { latitude: 6.8640528, longitude: 100.8748721 },
    },

    {
        name: "เทพา",
        nameEn: "Thepha Railway Station",
        line: "SRT",
        coordinate: { latitude: 6.82389, longitude: 100.967806 },
    },

    {
        name: "ตาแปด",
        nameEn: "Ta Paet",
        line: "SRT",
        coordinate: { latitude: 6.77999, longitude: 101.024806 },
    },

    {
        name: "บ้านนิคม",
        nameEn: "Ban Nikhom",
        line: "SRT",
        coordinate: { latitude: 6.7602595, longitude: 101.0499766 },
    },

    {
        name: "ปัตตานี",
        nameEn: "Pattani",
        line: "SRT",
        coordinate: { latitude: 6.72947, longitude: 101.061041 },
    },

    {
        name: "นาประดู่",
        nameEn: "Na Pradu",
        line: "SRT",
        coordinate: { latitude: 6.6830327, longitude: 101.1411163 },
    },

    {
        name: "วัดช้างให้",
        nameEn: "Wat Chang Hai",
        line: "SRT",
        coordinate: { latitude: 6.667783, longitude: 101.1701309 },
    },

    {
        name: "ป่าไร่",
        nameEn: "Pa Rai",
        line: "SRT",
        coordinate: { latitude: 6.6628854, longitude: 101.1799219 },
    },

    {
        name: "คลองทราย",
        nameEn: "Khlong Sai",
        line: "SRT",
        coordinate: { latitude: 6.64462, longitude: 101.2138801 },
    },

    {
        name: "ตาเซะ",
        nameEn: "Tase",
        line: "SRT",
        coordinate: { latitude: 6.614653, longitude: 101.2558249 },
    },

    {
        name: "บ้านยุโป",
        nameEn: "Ban Yupo",
        line: "SRT",
        coordinate: { latitude: 6.59055, longitude: 101.2747059 },
    },

    {
        name: "ยะลา",
        nameEn: "Yala",
        line: "SRT",
        coordinate: { latitude: 6.5604314, longitude: 101.2927642 },
    },

    {
        name: "ไม้แก่น",
        nameEn: "Mai Kaen",
        line: "SRT",
        coordinate: { latitude: 6.51181, longitude: 101.365806 },
    },

    {
        name: "บ้านปาแต",
        nameEn: "Ban Patae",
        line: "SRT",
        coordinate: { latitude: 6.4977269, longitude: 101.3929465 },
    },

    {
        name: "รามัน",
        nameEn: "Raman",
        line: "SRT",
        coordinate: { latitude: 6.4768569, longitude: 101.4299138 },
    },

    {
        name: "บาลอ",
        nameEn: "Balo",
        line: "SRT",
        coordinate: { latitude: 6.441216, longitude: 101.455387 },
    },

    {
        name: "รือเสาะ",
        nameEn: "Rueso",
        line: "SRT",
        coordinate: { latitude: 6.3940362, longitude: 101.5111353 },
    },

    {
        name: "บ้านสะโลว์บูกิ๊ตยือแร",
        nameEn: "Ban Salo Bukit Yuerae",
        line: "SRT",
        coordinate: { latitude: 6.3581626, longitude: 101.5384339 },
    },

    {
        name: "ลาโละ",
        nameEn: "Lalo",
        line: "SRT",
        coordinate: { latitude: 6.35539, longitude: 101.5748801 },
    },

    {
        name: "มะรือโบ",
        nameEn: "Maruebo",
        line: "SRT",
        coordinate: { latitude: 6.33481, longitude: 101.636806 },
    },

    {
        name: "กะแด๊ะ",
        nameEn: "Kadae",
        line: "SRT",
        coordinate: { latitude: 6.3125881, longitude: 101.6715966 },
    },

    {
        name: "ตันหยงมัส",
        nameEn: "Tanyong Mat",
        line: "SRT",
        coordinate: { latitude: 6.313663, longitude: 101.6414765 },
    },

    {
        name: "ป่าไผ่",
        nameEn: "Pa Phai",
        line: "SRT",
        coordinate: { latitude: 6.267263, longitude: 101.7556131 },
    },

    {
        name: "เจาะไอร้อง",
        nameEn: "Cho-airong",
        line: "SRT",
        coordinate: { latitude: 6.23587, longitude: 101.801 },
    },

    {
        name: "บูกิต",
        nameEn: "Bukit",
        line: "SRT",
        coordinate: { latitude: 6.2358688, longitude: 101.7658893 },
    },

    {
        name: "ไอสะเตีย",
        nameEn: "Aisatia",
        line: "SRT",
        coordinate: { latitude: 6.1665237, longitude: 101.831609 },
    },

    {
        name: "โต๊ะเด็ง",
        nameEn: "Todeng",
        line: "SRT",
        coordinate: { latitude: 6.1190828, longitude: 101.8542128 },
    },

    {
        name: "สุไหงปาดี",
        nameEn: "Su-ngai Padi",
        line: "SRT",
        coordinate: { latitude: 6.0859165, longitude: 101.8810002 },
    },

    {
        name: "โคกสยา",
        nameEn: "Khok Saya",
        line: "SRT",
        coordinate: { latitude: 6.0333856, longitude: 101.9173226 },
    },

    {
        name: "สุไหงโก-ลก",
        nameEn: "Su-ngai Kolok",
        line: "SRT",
        coordinate: { latitude: 6.02571, longitude: 101.9588801 },
    },

    {
        name: "คลองแงะ",
        nameEn: "Khlong Ngae",
        line: "SRT",
        coordinate: { latitude: 6.7910129, longitude: 100.4504302 },
    },

    {
        name: "ปาดังเบซาร์ (ไทย) (เขต รฟท.)",
        nameEn: "Padang Besar (Thailand) (SRT Area)",
        line: "SRT",
        coordinate: { latitude: 6.6688632, longitude: 100.3243915 },
    },

    {
        name: "ปาดังเบซาร์ (เขต รฟม.)",
        nameEn: "Padang Besar (MRTA Area)",
        line: "SRT",
        coordinate: { latitude: 6.6688351, longitude: 100.324497 },
    },

    {
        name: "ทุ่งบัว",
        nameEn: "Thung Bua",
        line: "SRT",
        coordinate: { latitude: 14.0109047, longitude: 99.9558191 },
    },

    {
        name: "โรงเรียนการบิน",
        nameEn: "Flying Training School",
        line: "SRT",
        coordinate: { latitude: 14.0870057, longitude: 99.9566919 },
    },

    {
        name: "ศรีสำราญ",
        nameEn: "Si Samran",
        line: "SRT",
        coordinate: { latitude: 14.226342, longitude: 100.0077348 },
    },

    {
        name: "ดอนทอง",
        nameEn: "Don Thong",
        line: "SRT",
        coordinate: { latitude: 14.3098367, longitude: 100.0163668 },
    },

    {
        name: "สุพรรณบุรี",
        nameEn: "Suphan Buri",
        line: "SRT",
        coordinate: { latitude: 14.465672, longitude: 100.0926509 },
    },

    {
        name: "ถนนทรงพล",
        nameEn: "Thanon Song Phon",
        line: "SRT",
        coordinate: { latitude: 13.8167441, longitude: 99.877273 },
    },

    {
        name: "สระโกสินารายณ์",
        nameEn: "Sa Kosinarai",
        line: "SRT",
        coordinate: { latitude: 13.8501908, longitude: 99.8487029 },
    },

    {
        name: "ลูกแก",
        nameEn: "Luk Kae",
        line: "SRT",
        coordinate: { latitude: 13.8705785, longitude: 99.8054776 },
    },

    {
        name: "ท่าเรือน้อย",
        nameEn: "Tha Ruea Noi",
        line: "SRT",
        coordinate: { latitude: 13.9561386, longitude: 99.74945 },
    },

    {
        name: "บ้านหนองเสือ",
        nameEn: "Ban Nong Suea",
        line: "SRT",
        coordinate: { latitude: 13.9719369, longitude: 99.6930449 },
    },

    {
        name: "ทุ่งทอง",
        nameEn: "Thung Thong",
        line: "SRT",
        coordinate: { latitude: 13.9797447, longitude: 99.6402703 },
    },

    {
        name: "ปากแพรก",
        nameEn: "Pak Phraek",
        line: "SRT",
        coordinate: { latitude: 14.0165131, longitude: 99.5440798 },
    },

    {
        name: "กาญจนบุรี",
        nameEn: "Kanchanaburi",
        line: "SRT",
        coordinate: { latitude: 14.0339943, longitude: 99.5090233 },
    },

    {
        name: "สะพานแควใหญ่",
        nameEn: "Saphan Khwae Yai",
        line: "SRT",
        coordinate: { latitude: 14.0431561, longitude: 99.5049234 },
    },

    {
        name: "เขาปูน",
        nameEn: "Khao Pun",
        line: "SRT",
        coordinate: { latitude: 14.002982, longitude: 99.5087909 },
    },

    {
        name: "วังลาน",
        nameEn: "Wang Lan",
        line: "SRT",
        coordinate: { latitude: 13.9615645, longitude: 99.4618096 },
    },

    {
        name: "นากาญจน์",
        nameEn: "Na Kan",
        line: "SRT",
        coordinate: { latitude: 13.9334539, longitude: 99.4477333 },
    },

    {
        name: "วังเย็น",
        nameEn: "Wang Yen",
        line: "SRT",
        coordinate: { latitude: 13.94913, longitude: 99.401406 },
    },

    {
        name: "วังตะเคียน",
        nameEn: "Wang Takhian",
        line: "SRT",
        coordinate: { latitude: 13.9531039, longitude: 99.3747712 },
    },

    {
        name: "บ้านโป่งเสี้ยว",
        nameEn: "Ban Pong Siao",
        line: "SRT",
        coordinate: { latitude: 13.9586699, longitude: 99.3449767 },
    },

    {
        name: "บ้านเก่า",
        nameEn: "Ban Kao",
        line: "SRT",
        coordinate: { latitude: 13.973147, longitude: 99.3153485 },
    },

    {
        name: "ท่าตาเสือ",
        nameEn: "Tha Ta Suea",
        line: "SRT",
        coordinate: { latitude: 14.0046913, longitude: 99.2873536 },
    },

    {
        name: "ท่ากิเลน",
        nameEn: "Tha Kilen",
        line: "SRT",
        coordinate: { latitude: 14.0406863, longitude: 99.254495 },
    },

    {
        name: "วังสิงห์",
        nameEn: "Wang Sing",
        line: "SRT",
        coordinate: { latitude: 14.0732058, longitude: 99.2263435 },
    },

    {
        name: "ลุ่มสุ่ม",
        nameEn: "Lum Sum",
        line: "SRT",
        coordinate: { latitude: 14.0927304, longitude: 99.1818224 },
    },

    {
        name: "วังโพ",
        nameEn: "Wang Pho",
        line: "SRT",
        coordinate: { latitude: 14.1200443, longitude: 99.1369355 },
    },

    {
        name: "เกาะมหามงคล",
        nameEn: "Ko Maha Mongkhon",
        line: "SRT",
        coordinate: { latitude: 14.1553179, longitude: 99.1069168 },
    },

    {
        name: "ช่องแคบ",
        nameEn: "Chong Khaep",
        line: "SRT",
        coordinate: { latitude: 14.1679228, longitude: 99.1005791 },
    },

    {
        name: "วังใหญ่",
        nameEn: "Wang Yai",
        line: "SRT",
        coordinate: { latitude: 14.1955825, longitude: 99.0891995 },
    },

    {
        name: "บ้านพุพง",
        nameEn: "Ban Phu Phong",
        line: "SRT",
        coordinate: { latitude: 14.2159282, longitude: 99.0890079 },
    },

    {
        name: "น้ำตก",
        nameEn: "Namtok",
        line: "SRT",
        coordinate: { latitude: 14.2350489, longitude: 99.0591384 },
    },

    {
        name: "บ้านดอนรัก",
        nameEn: "Ban Don Rak",
        line: "SRT",
        coordinate: { latitude: 9.1210346, longitude: 99.1732275 },
    },

    {
        name: "บ้านทุ่งหลวง",
        nameEn: "Ban Thung Luang",
        line: "SRT",
        coordinate: { latitude: 9.1041094, longitude: 99.1175078 },
    },

    {
        name: "บ้านขนาย",
        nameEn: "Ban Khanai",
        line: "SRT",
        coordinate: { latitude: 9.094037, longitude: 99.0843363 },
    },

    {
        name: "บ้านดอนเรียบ",
        nameEn: "Ban Don Riap",
        line: "SRT",
        coordinate: { latitude: 9.078788, longitude: 99.0446728 },
    },

    {
        name: "คลองยัน",
        nameEn: "Klong Yan",
        line: "SRT",
        coordinate: { latitude: 9.0579303, longitude: 99.0243267 },
    },

    {
        name: "เขาหลุง",
        nameEn: "Khao Lung",
        line: "SRT",
        coordinate: { latitude: 9.0457179, longitude: 98.9982727 },
    },

    {
        name: "บ้านยาง",
        nameEn: "Ban Yang",
        line: "SRT",
        coordinate: { latitude: 9.0475291, longitude: 98.9785605 },
    },

    {
        name: "คีรีรัฐนิคม",
        nameEn: "Khiri Rat Nikhom",
        line: "SRT",
        coordinate: { latitude: 9.0312989, longitude: 98.9448711 },
    },

    {
        name: "ที่วัง",
        nameEn: "Thi Wang",
        line: "SRT",
        coordinate: { latitude: 8.09784, longitude: 99.6638801 },
    },

    {
        name: "กะปาง",
        nameEn: "Kapang",
        line: "SRT",
        coordinate: { latitude: 8.004444, longitude: 99.642111 },
    },

    {
        name: "ห้วยยอด",
        nameEn: "Huai Yot",
        line: "SRT",
        coordinate: { latitude: 7.7860608, longitude: 99.6339415 },
    },

    {
        name: "ตรัง",
        nameEn: "Trang",
        line: "SRT",
        coordinate: { latitude: 7.5544139, longitude: 99.6044951 },
    },

    {
        name: "กันตัง",
        nameEn: "Kantang",
        line: "SRT",
        coordinate: { latitude: 7.4108137, longitude: 99.5124524 },
    },

    {
        name: "บ้านเกยเชน",
        nameEn: "Ban Koei Chen",
        line: "SRT",
        coordinate: { latitude: 8.1885946, longitude: 99.8997959 },
    },

    {
        name: "บ้านทุ่งหล่อ",
        nameEn: "Ban Thung Lo",
        line: "SRT",
        coordinate: { latitude: 8.2222194, longitude: 99.919357 },
    },

    {
        name: "โคกคราม",
        nameEn: "Khok Khram",
        line: "SRT",
        coordinate: { latitude: 8.24973, longitude: 99.9385101 },
    },

    {
        name: "บ้านห้วยยูง",
        nameEn: "Ban Huai Yung",
        line: "SRT",
        coordinate: { latitude: 8.2866626, longitude: 99.9432941 },
    },

    {
        name: "บ้านท่าช้าง",
        nameEn: "Ban Tha Chang",
        line: "SRT",
        coordinate: { latitude: 8.3290148, longitude: 99.9417809 },
    },

    {
        name: "วังวัว",
        nameEn: "Wang Wua",
        line: "SRT",
        coordinate: { latitude: 8.355674, longitude: 99.9408891 },
    },

    {
        name: "มะม่วงสองต้น",
        nameEn: "Mamuang Song Ton",
        line: "SRT",
        coordinate: { latitude: 8.3956273, longitude: 99.9458698 },
    },

    {
        name: "นครศรีธรรมราช",
        nameEn: "Nakhon Si Thammarat",
        line: "SRT",
        coordinate: { latitude: 8.440266, longitude: 99.957543 },
    },

    {
        name: "วงเวียนใหญ่",
        nameEn: "Wongwian Yai",
        line: "SRT",
        coordinate: { latitude: 13.7246069, longitude: 100.4878122 },
    },

    {
        name: "ตลาดพลู",
        nameEn: "Talat Phlu",
        line: "SRT",
        coordinate: { latitude: 13.7208315, longitude: 100.4738455 },
    },

    {
        name: "วุฒากาศ",
        nameEn: "Wutthakat",
        line: "SRT",
        coordinate: { latitude: 13.7125407, longitude: 100.4726397 },
    },

    {
        name: "คลองต้นไทร",
        nameEn: "Khlong Ton Sai",
        line: "SRT",
        coordinate: { latitude: 13.7064846, longitude: 100.4697741 },
    },

    {
        name: "จอมทอง",
        nameEn: "Chom Thong",
        line: "SRT",
        coordinate: { latitude: 13.7018278, longitude: 100.465136 },
    },

    {
        name: "วัดไทร",
        nameEn: "Wat Sai",
        line: "SRT",
        coordinate: { latitude: 13.6915585, longitude: 100.4575599 },
    },

    {
        name: "วัดสิงห์",
        nameEn: "Wat Sing",
        line: "SRT",
        coordinate: { latitude: 13.6832577, longitude: 100.4456198 },
    },

    {
        name: "บางบอน",
        nameEn: "Bang Bon",
        line: "SRT",
        coordinate: { latitude: 13.6665099, longitude: 100.428825 },
    },

    {
        name: "การเคหะ",
        nameEn: "Kan Kheha",
        line: "SRT",
        coordinate: { latitude: 13.6525975, longitude: 100.4132302 },
    },

    {
        name: "รางสะแก",
        nameEn: "Rang Sakae",
        line: "SRT",
        coordinate: { latitude: 13.6494143, longitude: 100.4097749 },
    },

    {
        name: "รางโพธิ์",
        nameEn: "Rang Pho",
        line: "SRT",
        coordinate: { latitude: 13.6391362, longitude: 100.3816174 },
    },

    {
        name: "สามแยก",
        nameEn: "Sam Yaek",
        line: "SRT",
        coordinate: { latitude: 13.6302658, longitude: 100.3883655 },
    },

    {
        name: "พรมแดน",
        nameEn: "Phrom Daen",
        line: "SRT",
        coordinate: { latitude: 13.6209828, longitude: 100.3780143 },
    },

    {
        name: "ทุ่งสีทอง",
        nameEn: "Thung Si Thong",
        line: "SRT",
        coordinate: { latitude: 13.6126424, longitude: 100.3687241 },
    },

    {
        name: "บางน้ำจืด",
        nameEn: "Bang Nam Chuet",
        line: "SRT",
        coordinate: { latitude: 13.6051185, longitude: 100.3602696 },
    },

    {
        name: "คอกควาย",
        nameEn: "Khok Khwai",
        line: "SRT",
        coordinate: { latitude: 13.5869538, longitude: 100.3401052 },
    },

    {
        name: "บ้านขอม",
        nameEn: "Ban Khom",
        line: "SRT",
        coordinate: { latitude: 13.5630261, longitude: 100.3135261 },
    },

    {
        name: "คลองจาก",
        nameEn: "Khlong Chak",
        line: "SRT",
        coordinate: { latitude: 13.551665, longitude: 100.2888097 },
    },

    {
        name: "นิคมรถไฟมหาชัย",
        nameEn: "Nikhom Rotfai Maha Chai",
        line: "SRT",
        coordinate: { latitude: 13.5486177, longitude: 100.2820986 },
    },

    {
        name: "มหาชัย",
        nameEn: "Maha Chai",
        line: "SRT",
        coordinate: { latitude: 13.5462511, longitude: 100.2766230 },
    },

    {
        name: "บ้านแหลม",
        nameEn: "Ban Laem",
        line: "SRT",
        coordinate: { latitude: 13.5418695, longitude: 100.26774 },
    },

    {
        name: "โรงพยาบาลนครท่าฉลอม",
        nameEn: "Nakhon Tha Chalom Hospital",
        line: "SRT",
        coordinate: { latitude: 13.5360697, longitude: 100.2677177 },
    },

    {
        name: "ท่าฉลอม",
        nameEn: "Ta Chalom",
        line: "SRT",
        coordinate: { latitude: 13.5313971, longitude: 100.2635289 },
    },

    {
        name: "บ้านชีผ้าขาว",
        nameEn: "Ban Chi Pha Khao",
        line: "SRT",
        coordinate: { latitude: 13.5247682, longitude: 100.240265 },
    },

    {
        name: "คลองนกเล็ก",
        nameEn: "Khlong Nok Lek",
        line: "SRT",
        coordinate: { latitude: 13.5190984, longitude: 100.2221753 },
    },

    {
        name: "บางสีคต",
        nameEn: "Bang Si Khot",
        line: "SRT",
        coordinate: { latitude: 13.515796, longitude: 100.21431 },
    },

    {
        name: "บางกระเจ้า",
        nameEn: "Bang Krachao",
        line: "SRT",
        coordinate: { latitude: 13.5087416, longitude: 100.1974875 },
    },

    {
        name: "บ้านบ่อ",
        nameEn: "Ban Bo",
        line: "SRT",
        coordinate: { latitude: 13.5015479, longitude: 100.1804413 },
    },

    {
        name: "บางโทรัด",
        nameEn: "Bang Tho Rat",
        line: "SRT",
        coordinate: { latitude: 13.4942021, longitude: 100.1601048 },
    },

    {
        name: "บ้านกาหลง",
        nameEn: "Ban Kalong",
        line: "SRT",
        coordinate: { latitude: 13.4872698, longitude: 100.1377025 },
    },

    {
        name: "บ้านนาขวาง",
        nameEn: "Ban Na Khwang",
        line: "SRT",
        coordinate: { latitude: 13.4860562, longitude: 100.1211351 },
    },

    {
        name: "บ้านนาโคก",
        nameEn: "Ban Na Khok",
        line: "SRT",
        coordinate: { latitude: 13.4768179, longitude: 100.102555 },
    },

    {
        name: "เขตเมือง",
        nameEn: "Khet Mueang",
        line: "SRT",
        coordinate: { latitude: 13.456748, longitude: 100.0744883 },
    },

    {
        name: "ลาดใหญ่",
        nameEn: "Lat Yai",
        line: "SRT",
        coordinate: { latitude: 13.4358497, longitude: 100.0452019 },
    },

    {
        name: "แม่กลอง",
        nameEn: "Mae Klong",
        line: "SRT",
        coordinate: { latitude: 13.4074854, longitude: 99.9984292 },
    },

    // =========================================================
    // Chao Phraya Express Boat / River Piers
    //
    // Service status checked against current Chao Phraya Express Boat
    // information and public-sector pier data on 2026-09-29.
    // Coordinates are included only where the pier location was verified.
    // Chao Phraya Tourist Boat is a separate service and is not mixed here.
    // =========================================================

    {
        name: "サトーン船着場（中央）",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "CEN",
        coordinate: { latitude: 13.71862319, longitude: 100.5127792 },
    },
    {
        name: "オリエンタル船着場",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N1",
        serviceStatus: "inactive",
        serviceNote: "改修のため現在休止中です。Chao Phraya Express Boat公式案内で休止が明示されています。",
        serviceDataDate: "2026-09-29",
        coordinate: { latitude: 13.72329212, longitude: 100.5135026 },
    },
    {
        name: "ターティアン（ワット・ポー）",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N8",
        coordinate: { latitude: 13.7444, longitude: 100.4908 },
    },
    {
        name: "ターチャン（王宮）",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N9",
        coordinate: { latitude: 13.7503, longitude: 100.4883 },
    },
    {
        name: "ワンラン（シリラート）",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N10",
        coordinate: { latitude: 13.75628637, longitude: 100.4866838 },
    },
    {
        name: "トンブリー鉄道駅",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N11",
        coordinate: { latitude: 13.75931832, longitude: 100.487563 },
    },
    {
        name: "プラピンクラオ橋",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N12",
        coordinate: { latitude: 13.76298788, longitude: 100.4906288 },
    },
    {
        name: "プラアーティット",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N13",
        coordinate: { latitude: 13.76351023, longitude: 100.4939336 },
    },
    {
        name: "ラーマ8世橋",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N14",
        serviceStatus: "inactive",
        serviceNote: "船着場は存在しますが、現在のChao Phraya Express Boat通常便の停船対象ではありません。",
        serviceDataDate: "2026-09-29",
        coordinate: { latitude: 13.76765421, longitude: 100.4977516 },
    },
    {
        name: "テーウェート",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N15",
        coordinate: { latitude: 13.77211481, longitude: 100.5000365 },
    },
    {
        name: "クルントン橋",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N16",
        coordinate: { latitude: 13.78158169, longitude: 100.5010865 },
    },
    {
        name: "ワット・テープナリー",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N17",
        serviceStatus: "inactive",
        serviceNote: "船着場は存在しますが、現在のChao Phraya Express Boat通常便の停船対象ではありません。",
        serviceDataDate: "2026-09-29",
        coordinate: { latitude: 13.78384552, longitude: 100.5019148 },
    },
    {
        name: "パヤップ",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N18",
        coordinate: { latitude: 13.78744016, longitude: 100.5083195 },
    },
    {
        name: "灌漑局",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N19",
        serviceStatus: "limited",
        serviceNote: "一部の運航便・時間帯のみ停船します。利用前に当日の運航情報を確認してください。",
        serviceDataDate: "2026-09-29",
        coordinate: { latitude: 13.78879636, longitude: 100.5097432 },
    },
    {
        name: "キアオカイカー",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N20",
        serviceStatus: "limited",
        serviceNote: "一部の運航便・時間帯のみ停船します。利用前に当日の運航情報を確認してください。",
        serviceDataDate: "2026-09-29",
        coordinate: { latitude: 13.79091, longitude: 100.51187 },
    },
    {
        name: "キアッカイ",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N21",
        coordinate: { latitude: 13.79856, longitude: 100.51749 },
    },
    {
        name: "バンポー",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N22",
        coordinate: { latitude: 13.80636, longitude: 100.51926 },
    },
    {
        name: "ワット・ソイ・トーン",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N23",
        coordinate: { latitude: 13.81218, longitude: 100.51772 },
    },
    {
        name: "ラーマ7世橋",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N24",
        coordinate: { latitude: 13.81238, longitude: 100.51372 },
    },
    {
        name: "ワット・ケーマ",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N26",
        coordinate: { latitude: 13.82183, longitude: 100.50208 },
    },
    {
        name: "ワット・トゥック",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N27",
        coordinate: { latitude: 13.82442, longitude: 100.49845 },
    },
    {
        name: "ワット・キアン",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N28",
        serviceStatus: "active",
        serviceNote: "2026年7月6日から停船を再開しています。",
        serviceDataDate: "2026-09-29",
        coordinate: { latitude: 13.82802, longitude: 100.49657 },
    },
    {
        name: "ラーマ5世橋",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N29/1",
        coordinate: { latitude: 13.832191, longitude: 100.49382 },
    },
    {
        name: "ノンタブリー（ピブーン3）",
        line: "Boat",
        route: "Chao Phraya Express Boat",
        stationCode: "N30",
        coordinate: { latitude: 13.8422, longitude: 100.4937 },
    },
];