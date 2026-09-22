// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'; // インポートを追加
import "./globals.css";

export const metadata: Metadata = {
  title: "バンコクおまもりコンパス",
  description: "バンコクおよびタイ全土の交通機関・観光ナビゲーション",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BKKナビ",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="impact-site-verification" value="c54d0af30-efb7-4f61-af19-faf5c9e12c57" />
      </head>
      <body className="antialiased overflow-hidden">
        {children}
      </body>
      {/* Googleアナリティクスの測定IDを設定 */}
      <GoogleAnalytics gaId="G-9KLS8XGZ7N" />
    </html>
  );
}