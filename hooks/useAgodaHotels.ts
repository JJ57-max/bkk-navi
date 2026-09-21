// hooks/useAgodaHotels.ts
'use client';

import { useState, useEffect } from 'react';

export interface AgodaHotel {
  hotelId: number;
  hotelName: string;
  starRating: number;
  reviewScore: number;
  currency: string;
  dailyRate: number;
  crossedOutRate: number;
  discountPercentage: number;
  imageURL: string;
  landingURL: string;
  includeBreakfast: boolean;
  freeWifi: boolean;
}

export function useAgodaHotels(checkin?: string, checkout?: string) {
  const [hotels, setHotels] = useState<AgodaHotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotels() {
      try {
        setLoading(true);
        // クエリパラメータの構築
        const params = new URLSearchParams();
        if (checkin) params.append('checkin', checkin);
        if (checkout) params.append('checkout', checkout);

        const res = await fetch(`/api/hotels?${params.toString()}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        
        // Agoda APIのレスポンス構造（resultsプロパティに配列が入る想定）
        if (data && data.results) {
          setHotels(data.results);
        } else if (Array.isArray(data)) {
          setHotels(data);
        } else {
          setHotels([]);
        }
      } catch (err: any) {
        console.error('Error loading Agoda hotels:', err);
        setError(err.message || 'ホテル情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [checkin, checkout]);

  return { hotels, loading, error };
}