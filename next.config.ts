// next.config.js の例
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY', // クリックジャッキング対策（他サイトのiframe埋め込みを禁止）
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff', // MIMEタイプスニフィングの防止
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin', // リファラー情報の制御
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;