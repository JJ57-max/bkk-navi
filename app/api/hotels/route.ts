import { NextResponse } from 'next/server';
import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

export async function GET(request: Request) {
  try {
    // ★ Agoda公式のLong Tail API仕様に準拠したリクエストボディ構造
    const requestBody = {
      criteria: {
        cityId: 9391, // バンコク
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

    console.log('Sending request to Agoda API with body:', JSON.stringify(requestBody));

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
    console.log('Agoda API Successful Raw Response:', data);
    
    // レスポンスからホテル配列を抽出
    const hotelsArray = data.results || data.hotelList || (Array.isArray(data) ? data : []);
    
    return NextResponse.json(hotelsArray);

  } catch (error: any) {
    console.error('Failed to fetch Agoda hotels:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}