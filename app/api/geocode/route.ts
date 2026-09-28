export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return Response.json(
            { error: 'Latitude and longitude are required' },
            { status: 400 }
        );
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (
        !Number.isFinite(latNum) ||
        !Number.isFinite(lngNum) ||
        latNum < -90 ||
        latNum > 90 ||
        lngNum < -180 ||
        lngNum > 180
    ) {
        return Response.json(
            { error: 'Invalid latitude or longitude' },
            { status: 400 }
        );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('Google Maps API key is not configured.');

        return Response.json(
            { error: 'Geocoding service is not configured' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latNum},${lngNum}&language=ja&key=${apiKey}`
        );

        if (!response.ok) {
            console.error(
                `Google Geocoding API returned HTTP ${response.status}`
            );

            return Response.json({
                address: `指定地点 (${latNum.toFixed(4)}, ${lngNum.toFixed(4)})`,
            });
        }

        const data = await response.json();

        if (
            data.status === 'OK' &&
            Array.isArray(data.results) &&
            data.results.length > 0
        ) {
            const formattedAddress = data.results[0].formatted_address;

            const cleanAddress = formattedAddress
                .replace(/タイ王国|タイ、|Thailand|, Thailand/g, '')
                .replace(/,\s*$/, '')
                .trim();

            return Response.json({
                address: cleanAddress,
            });
        }

        return Response.json({
            address: `指定地点 (${latNum.toFixed(4)}, ${lngNum.toFixed(4)})`,
        });
    } catch (error) {
        console.error('Geocoding API Error:', error);

        return Response.json({
            address: `指定地点 (${latNum.toFixed(4)}, ${lngNum.toFixed(4)})`,
        });
    }
}