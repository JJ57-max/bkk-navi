// Reverse geocode the selected pin in Japanese and Thai. No invented address fallback.
type GeocodeResult = { address: string | null; status: string };

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const latRaw = searchParams.get('lat');
    const lngRaw = searchParams.get('lng');
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!latRaw?.trim() || !lngRaw?.trim() || !Number.isFinite(lat) ||
        !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return Response.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return Response.json({ error: 'Geocoding service is not configured' }, { status: 503 });
    }
    const lookup = async (language: 'ja' | 'th'): Promise<GeocodeResult> => {
        try {
            const params = new URLSearchParams({ latlng: `${lat},${lng}`, language, key: apiKey });
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`, {
                signal: AbortSignal.timeout(8000),
                cache: 'no-store',
            });
            if (!response.ok) return { address: null, status: 'UPSTREAM_HTTP_ERROR' };
            const data = await response.json();
            const address = data.status === 'OK' && typeof data.results?.[0]?.formatted_address === 'string'
                ? data.results[0].formatted_address.trim() : null;
            return { address: address || null, status: typeof data.status === 'string' ? data.status : 'INVALID_RESPONSE' };
        } catch {
            return { address: null, status: 'UPSTREAM_UNAVAILABLE' };
        }
    };
    const [ja, th] = await Promise.all([lookup('ja'), lookup('th')]);
    const thaiAddressUsable = !!th.address && /[\u0E00-\u0E7F]/.test(th.address) &&
        !/[\u3040-\u30ff\u3400-\u9fff]/.test(th.address);
    return Response.json({
        lat, lng,
        address: ja.address, // Compatibility with existing callers.
        addressJa: ja.address,
        addressTh: thaiAddressUsable ? th.address : null,
        status: thaiAddressUsable ? 'OK' : 'ADDRESS_UNAVAILABLE',
        jaStatus: ja.status,
        thStatus: th.status,
    }, { status: ja.address || thaiAddressUsable ? 200 : 502, headers: { 'Cache-Control': 'no-store' } });
}
