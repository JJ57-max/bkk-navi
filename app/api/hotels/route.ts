import { NextResponse } from 'next/server';
import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

export async function GET(request: Request) {
  try {
    // 検索日を11月に変更し、確実にヒットするように調整
    const requestBody = {
      criteria: {
        cityId: 9391, // バンコク
        checkInDate: '2026-11-01',
        checkOutDate: '2026-11-02',
        currency: 'JPY',
        language: 'ja-jp',
        maxResult: 10,
      },
    };

    const response = await fetch(AGODA_CONFIG.endpoint, {
      method: 'POST',
      headers: getAgodaHeaders(),
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Agoda API Error Response:', responseText);
      return NextResponse.json(
        { error: `Agoda API Error: ${response.status}`, details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('Agoda Raw API Response:', data); // バックエンド側のログも確認用に出力
    
    // results、またはそのまま配列であればそれを返す
    const hotelsArray = data.results || (Array.isArray(data) ? data : (data.hotelList || []));
    
    return NextResponse.json(hotelsArray);

  } catch (error: any) {
    console.error('Failed to fetch Agoda hotels:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}