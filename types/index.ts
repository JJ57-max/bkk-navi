export interface Station {
    name: string;
    line: 'BTS' | 'MRT' | 'ARL' | 'SRT' | 'Boat' | string;
    coordinate: {
        lat: number;
        lng: number;
    };
}

export interface Landmark {
    id: string;
    name: string;
    category: string;
    coordinate: {
        lat: number;
        lng: number;
    };
}

export interface ExchangeShop {
    rank: string;
    name: string;
    location: string;
    description: string;
    coordinate: {
        lat: number;
        lng: number;
    };
}

export interface PlacePrediction {
    id: string;
    primaryText: string;
    secondaryText: string;
}

export interface DynamicLandmarkDetail {
    rating?: number;
    userRatingsTotal?: number;
    isOpenNow?: boolean;
    tips?: string;
    thaiName?: string;
    englishName?: string;
    thaiLandmarkNote?: string;
}