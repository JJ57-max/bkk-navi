import { NextResponse } from 'next/server';
import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

const BANGKOK_CITY_ID = 9391; // バンコクの都市ID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 確実に未来の日付になるよう設定（例: 1ヶ月後など）
    const checkinDate = searchParams.get('checkin') || '2026-10-01';
    const checkoutDate = searchParams.get('checkout') || '2026-10-02';

    // Agoda Affiliate API (lt_v1) の仕様に合わせた正確なリクエストボディ
    const requestBody = {
      criteria: {
        cityId: BANGKOK_CITY_ID,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate, // キー名を標準的な "checkoutDate" に修正
        currency: 'JPY',
        language: 'ja-jp',
        maxResult: 10,
        numberOfAdult: 2,
        numberOfChildren: 0,
        sortBy: 'Recommended',
      },
    };

    const response = await fetch(AGODA_CONFIG.endpoint, {
      method: 'POST',
      headers: getAgodaHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Agoda API Error Response:', errorText);
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