// app/api/geocode/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCywzT_-wuzKVhv0PcgvxK06XFK5On3yh0";
    
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted_address;
            
            // 「タイ、」「Thailand」「タイ王国」などの国名・表記を完全に削除し、余分なスペースやカンマを綺麗に整える
            const cleanAddress = formattedAddress
                .replace(/タイ王国|タイ、|Thailand|, Thailand/g, '')
                .replace(/,\s*$/, '')
                .trim();

            return NextResponse.json({ address: cleanAddress });
        } else {
            return NextResponse.json({ address: `指定地点 (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})` });
        }
    } catch (err) {
        console.error('Geocoding API Error:', err);
        return NextResponse.json({ address: `指定地点 (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})` });
    }
}