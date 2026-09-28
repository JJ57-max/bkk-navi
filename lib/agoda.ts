const siteId = process.env.AGODA_SITE_ID;
const apiKey = process.env.AGODA_API_KEY;

if (!siteId || !apiKey) {
  throw new Error(
    'Agoda API credentials are not configured. Please set AGODA_SITE_ID and AGODA_API_KEY.'
  );
}

export const AGODA_CONFIG = {
  endpoint:
    process.env.AGODA_API_ENDPOINT ??
    'https://affiliateapi7643.agoda.com/affiliateservice/lt_v1',
  siteId,
  apiKey,
};

export function getAgodaHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip,deflate',
    Authorization: `${AGODA_CONFIG.siteId}:${AGODA_CONFIG.apiKey}`,
  };
}