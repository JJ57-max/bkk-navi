import { allBangkokStations } from '@/data/stations';

export function getBoatServiceNotice(latitude: number, longitude: number) {
    const station = allBangkokStations.find(item => item.line === 'Boat' &&
        Math.abs(item.coordinate.latitude - latitude) < 0.000001 &&
        Math.abs(item.coordinate.longitude - longitude) < 0.000001);
    if (!station || (station.serviceStatus !== 'inactive' && station.serviceStatus !== 'limited')) return null;
    return {
        label: station.serviceStatus === 'inactive' ? '通常便では利用できません' : '運航・停船条件をご確認ください',
        note: station.serviceNote || '利用前に運営者の運航情報を確認してください。',
        checkedDate: station.serviceDataDate,
    };
}
