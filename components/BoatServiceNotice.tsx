import { getBoatServiceNotice } from '@/utils/boatServiceNotice';

export default function BoatServiceNotice({ latitude, longitude }: { latitude: number; longitude: number }) {
    const notice = getBoatServiceNotice(latitude, longitude);
    if (!notice) return null;
    return (
        <div role="note" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-left text-xs text-amber-900">
            <p className="font-bold">⚠️ {notice.label}</p>
            <p className="mt-1 leading-relaxed">{notice.note}</p>
            {notice.checkedDate && <p className="mt-1">登録情報の確認日: {notice.checkedDate}</p>}
            <a href="https://www.chaophrayaexpressboat.com/chaophrayaexpressboat" target="_blank" rel="noopener noreferrer" className="mt-1 inline-block underline">運営者の最新運航情報を確認</a>
        </div>
    );
}
