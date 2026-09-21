// Agoda API 設定およびリクエスト用ヘルパー

export const AGODA_CONFIG = {
  endpoint: 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1',
  siteId: process.env.AGODA_SITE_ID || '1974942',
  apiKey: process.env.AGODA_API_KEY || 'a2e83833-6b18-4704-9058-b3857d901b92',
};

// 認証ヘッダーを生成する関数
export function getAgodaHeaders() {
  const { siteId, apiKey } = AGODA_CONFIG;
  return {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip,deflate',
    'Authorization': `${siteId}:${apiKey}`,
  };
}