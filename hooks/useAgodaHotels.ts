import { useState, useEffect } from 'react';

type AgodaHotel = Record<string, unknown>;

export function useAgodaHotels() {
    const [hotels, setHotels] = useState<AgodaHotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);

                const res = await fetch('/api/hotels');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: unknown = await res.json();

                console.log('API Response Data:', data);

                let hotelList: AgodaHotel[] = [];

                if (Array.isArray(data)) {
                    hotelList = data.filter(
                        (item): item is AgodaHotel =>
                            typeof item === 'object' &&
                            item !== null &&
                            !Array.isArray(item)
                    );
                } else if (typeof data === 'object' && data !== null) {
                    const responseData = data as {
                        results?: unknown;
                        hotelList?: unknown;
                        data?: unknown;
                    };

                    const candidate =
                        responseData.results ??
                        responseData.hotelList ??
                        responseData.data;

                    if (Array.isArray(candidate)) {
                        hotelList = candidate.filter(
                            (item): item is AgodaHotel =>
                                typeof item === 'object' &&
                                item !== null &&
                                !Array.isArray(item)
                        );
                    }
                }

                console.log('Parsed Hotel List:', hotelList);

                setHotels(hotelList);
            } catch (error) {
                console.error('Agoda API Fetch Error:', error);
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    return { hotels, loading };
}