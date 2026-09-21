import { NextResponse } from 'next/server';
import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

export async function GET(request: Request) {
  try {
    // Agoda Affiliate API (lt_v1) の必須最小限のスキーマ構造
    const requestBody = {
      criteria: {
        cityId: 9391, // バンコクの都市ID
        checkinDate: "2026-10-01",
        checkoutDate: "2026-10-02",
        currency: "JPY",
        language: "ja-jp",
        maxResult: 5
      }
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
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Failed to fetch Agoda hotels:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}