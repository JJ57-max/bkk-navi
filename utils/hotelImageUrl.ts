// Normalize API-supplied images before assigning them to an HTTPS page.
export function getSecureHotelImageUrl(value: string): string {
    const input = value.trim();
    if (!input) return '';
    try {
        const url = new URL(input.startsWith('//') ? `https:${input}` : input);
        if (url.username || url.password) return '';
        if (url.protocol === 'http:') {
            const host = url.hostname.toLowerCase();
            if (host !== 'agoda.net' && !host.endsWith('.agoda.net')) return '';
            url.protocol = 'https:';
        }
        return url.protocol === 'https:' ? url.href : '';
    } catch {
        return '';
    }
}
