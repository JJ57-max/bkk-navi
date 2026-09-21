import { NextResponse } from 'next/server';
import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

export async function GET(request: Request) {
  try {
    const requestBody = {
      criteria: {
        cityId: 9391,
        checkInDate: '2026-11-01',
        checkOutDate: '2026-11-02',
        numberOfAdults: 2,
        numberOfRooms: 1,
        additional: {
          currency: 'JPY',
          language: 'ja-jp',
          maxResult: 10,
        }
      },
    };

    const response = await fetch(AGODA_CONFIG.endpoint, {
      method: 'POST',
      headers: getAgodaHeaders(),
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    let hotelsArray = [];

    if (response.ok) {
      const data = JSON.parse(responseText);
      if (!data.error && (data.results || data.hotelList || Array.isArray(data))) {
        hotelsArray = data.results || data.hotelList || data;
      }
    }

    // 個別座標と個別リンクを持たせたフォールバックデータ
    if (!hotelsArray || hotelsArray.length === 0) {
      hotelsArray = [
        {
          hotelId: 48641,
          hotelName: 'サイアム ケンプンスキー ホテル バンコク',
          imageURL: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
          landingURL: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${AGODA_CONFIG.siteId}&hid=48641`,
          dailyRate: 45000,
          currency: 'JPY',
          starRating: 5,
          reviewScore: 9.2,
          discountPercentage: 15,
          latitude: 13.7447,
          longitude: 100.5377,
        },
        {
          hotelId: 528741,
          hotelName: 'マリオット ホテル スクンビット',
          imageURL: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80',
          landingURL: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${AGODA_CONFIG.siteId}&hid=528741`,
          dailyRate: 28000,
          currency: 'JPY',
          starRating: 4.5,
          reviewScore: 8.9,
          discountPercentage: 10,
          latitude: 13.7196,
          longitude: 100.5858,
        },
        {
          hotelId: 386221,
          hotelName: 'イーステイン グランデ ホテル サトーン',
          imageURL: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=300&q=80',
          landingURL: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${AGODA_CONFIG.siteId}&hid=386221`,
          dailyRate: 19000,
          currency: 'JPY',
          starRating: 4,
          reviewScore: 9.0,
          discountPercentage: 20,
          latitude: 13.7191,
          longitude: 100.5283,
        },
        {
          hotelId: 6871,
          hotelName: 'デュシタニ バンコク',
          imageURL: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80',
          landingURL: `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=${AGODA_CONFIG.siteId}&hid=6871`,
          dailyRate: 35000,
          currency: 'JPY',
          starRating: 5,
          reviewScore: 9.1,
          discountPercentage: 12,
          latitude: 13.7275,
          longitude: 100.5341,
        }
      ];
    }

    return NextResponse.json(hotelsArray);

  } catch (error: any) {
    console.error('Failed to fetch Agoda hotels:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}