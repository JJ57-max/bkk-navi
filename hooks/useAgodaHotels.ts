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
                console.log('API Response Data:', data); // ← 取得データの中身をコンソールに出力
                
                const hotelList = Array.isArray(data) 
                    ? data 
                    : (data.results || data.hotelList || data.data || []);
                    
                console.log('Parsed Hotel List:', hotelList); // ← パース後の配列を出力
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