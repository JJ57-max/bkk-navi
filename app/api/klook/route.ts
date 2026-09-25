// app/api/klook/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    // バリューコマースのKlookアフィリエイトリンク
    const affiliateUrl = 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3782281&pid=892711503&vc_url=https%3A%2F%2Fwww.klook.com%2Fja%2Fsearch%2Fresult%2F%3Fquery%3D%E3%83%90%E3%83%B3%E3%82%B3%E3%82%AF%26sort%3Dmost_relevant%26tab_key%3D2%26search_scope%3Dattraction%26spm%3DAttraction_Vertical.ChangeDestination.Destination%26clickId%3D29e47f2c7b';
    
    // サーバー側からアフィリエイトURLへ302リダイレクト
    return NextResponse.redirect(affiliateUrl, 302);
}