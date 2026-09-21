import { useState, useEffect } from 'react';

export function useAgodaHotels() {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/hotels');
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                
                // APIのレスポンスが配列か、オブジェクト（{ results: [...] } 等）かのブレを完全に吸収して抽出
                const hotelList = Array.isArray(data) 
                    ? data 
                    : (data.results || data.hotelList || data.data || []);
                    
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