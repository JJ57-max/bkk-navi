// app/api/kkday/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    // 取得されたバリューコマースのKKdayアフィリエイトリンク
    const affiliateUrl = 'https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3782281&pid=892711845&vc_url=https%3A%2F%2Fwww.kkday.com%2Fja%2Fproduct%2Fproductlist%2F%E3%83%90%E3%83%B3%E3%82%B3%E3%82%AF%3Ftab_key%3DCATEGORY_001%2CCATEGORY_018';
    
    // サーバー側からアフィリエイトURLへ302リダイレクト
    return NextResponse.redirect(affiliateUrl, 302);
}