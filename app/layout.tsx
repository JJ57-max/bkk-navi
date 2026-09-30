// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
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
  // ブックマークやスマホのホーム画面用アイコンの明示的な設定
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
      {/* Googleアナリティクスの測定IDを設定[cite: 13] */}
      <GoogleAnalytics gaId="G-9KLS8XGZ7N" />

      {/* バリューコマース LinkSwitchタグ[cite: 13] */}
      <Script id="valuecommerce-linkswitch" strategy="afterInteractive">
        {`var vc_pid = "89270986";`}
      </Script>
      <Script src="//aml.valuecommerce.com/vcdal.js" strategy="afterInteractive" />

      {/* サービスワーカー登録用スクリプト（オフライン・ファースト対応） */}
      <Script id="register-sw" strategy="afterInteractive">
        {`
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }
        `}
      </Script>
    </html>
  );
}