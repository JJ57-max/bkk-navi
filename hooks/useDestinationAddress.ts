'use client';

import { useEffect, useState } from 'react';

export type DestinationAddress = {
    status: 'loading' | 'ready' | 'error';
    addressJa: string | null;
    addressTh: string | null;
    latitude: number;
    longitude: number;
};
type AddressRecord = DestinationAddress & { key: string };

// One coordinate-bound result shared by DetailSheet and the driver card.
// Old responses are aborted and never displayed for a newly selected pin.
export function useDestinationAddress(latitude: number, longitude: number) {
    const key = `${latitude},${longitude}`;
    const [record, setRecord] = useState<AddressRecord | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        const params = new URLSearchParams({ lat: String(latitude), lng: String(longitude) });
        const resolve = async () => {
            try {
                const response = await fetch(`/api/geocode?${params}`, { signal: controller.signal });
                if (!response.ok) throw new Error('Address lookup failed');
                const data = await response.json();
                if (controller.signal.aborted) return;
                if (data.lat !== latitude || data.lng !== longitude) throw new Error('Coordinate mismatch');
                const addressJa = typeof data.addressJa === 'string' ? data.addressJa : null;
                const addressTh = typeof data.addressTh === 'string' && /[\u0E00-\u0E7F]/.test(data.addressTh) &&
                    !/[\u3040-\u30ff\u3400-\u9fff]/.test(data.addressTh) ? data.addressTh : null;
                setRecord({ key, latitude, longitude, addressJa, addressTh,
                    status: addressTh ? 'ready' : 'error' });
            } catch {
                if (!controller.signal.aborted) {
                    setRecord({ key, latitude, longitude, addressJa: null, addressTh: null, status: 'error' });
                }
            }
        };
        void resolve();
        return () => controller.abort();
    }, [key, latitude, longitude, retryCount]);
    const address: DestinationAddress = record?.key === key ? record : {
        latitude, longitude, addressJa: null, addressTh: null, status: 'loading',
    };
    return { address, retryAddress: () => { setRecord(null); setRetryCount(count => count + 1); } };
}
