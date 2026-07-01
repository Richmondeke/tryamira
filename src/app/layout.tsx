import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from 'next/script';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0b0e' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Amira — AI-Powered Multi-Channel Agent",
  description: "Amira connects to 1,000+ tools and takes action across WhatsApp, Instagram, Messenger, Email and Voice — so your business never misses a customer.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Amira',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Satoshi Font — Fontshare CDN */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,de,yo,ig,ha,zh-CN,ja,ar,pt,it',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
        <style dangerouslySetInnerHTML={{__html: `
          /* Premium override: hide Google Translate frames, banner, and standard selectors */
          iframe.skiptranslate, .goog-te-banner-frame, #goog-gt-tt {
            display: none !important;
            visibility: hidden !important;
          }
          body {
            top: 0px !important;
          }
          #google_translate_element {
            display: none !important;
          }
          .goog-te-menu-value {
            display: none !important;
          }
        `}} />
      </head>
      <body>
        {children}
        <div id="google_translate_element" style={{ display: 'none' }} />
      </body>
    </html>
  );
}
