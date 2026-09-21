import { NextResponse } from 'next/server';
import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

// バンコクの都市ID（Agodaの一般的な都市IDやサンプルに合わせた設定、必要に応じて調整）
const BANGKOK_CITY_ID = 9391; // バンコクの都市ID

export async function GET(request: Request) {
  try {
    // クエリパラメータからチェックイン日などを取得できるようにする（未指定の場合はデフォルト値）
    const { searchParams } = new URL(request.url);
    const checkinDate = searchParams.get('checkin') || '2026-10-01';
    const checkoutDate = searchParams.get('checkout') || '2026-10-02';

    // Agoda API仕様書に沿ったリクエストボディの構築
    const requestBody = {
      criteria: {
        cityId: BANGKOK_CITY_ID,
        checkinDate: checkinDate,
        checkOutDate: checkoutDate,
        currency: 'JPY',
        language: 'ja-jp',
        maxResult: 10,
        numberOfAdult: 2,
        numberOfChildren: 0,
        sortBy: 'Recommended',
      },
    };

    // Agoda APIへPOSTリクエストを送信
    const response = await fetch(AGODA_CONFIG.endpoint, {
      method: 'POST',
      headers: getAgodaHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Agoda API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Failed to fetch Agoda hotels:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}