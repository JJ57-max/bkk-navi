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
      <body className="antialiased overflow-hidden">
        {children}
      </body>
      {/* Googleアナリティクスの測定IDを設定 */}
      <GoogleAnalytics gaId="G-9KLS8XGZ7N" />
    </html>
  );
}