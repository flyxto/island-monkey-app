import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#18191F",
};

export const metadata: Metadata = {
  title: "Island Monkey - Customer Portal",
  description: "Loyalty points, package booking, and studio sessions portal for Island Monkey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Prevent iOS 2-finger pinch-to-zoom gestures
                document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });
                document.addEventListener('touchstart', function(e) {
                  if (e.touches && e.touches.length > 1) {
                    e.preventDefault();
                  }
                }, { passive: false });
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
