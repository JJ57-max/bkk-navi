// app/api/places/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json([]);
  }

  // APIキーは必ず環境変数から取得する（直書きしない）
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
      console.error("Google Maps API Key is missing.");
      return NextResponse.json([]);
  }
  
  try {
    // バンコク中心部を基準に、フリーワードでGoogle Placesからスポットを検索
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' バンコク')}&location=13.7460,100.5347&radius=30000&language=ja&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results) {
      const places = data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        category: 'Googleスポット',
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || 4.0,
        userRatingsTotal: place.user_ratings_total || 0,
      }));
      return NextResponse.json(places);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Places API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}