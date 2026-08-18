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
  title: "Amira — Your AI Operator for Work",
  description: "Amira is your AI Operator that gets work done across all your tools. Delegate outcomes, not tasks. Connect 1,000+ tools and let Amira execute complete workflows.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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

import AmiraChatWidget from '@/components/AmiraChatWidget';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Satoshi Font — Fontshare CDN */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap"
          rel="stylesheet"
        />
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
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                window.addEventListener('error', function(e) {
                  var msg = e && (e.message || (e.error && e.error.message)) ? String(e.message || e.error.message) : '';
                  if (msg.includes('ultimate-toolbar-gpt') || msg.includes('react-draggable') || msg.includes('Hydration failed')) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                var origError = console.error;
                console.error = function() {
                  var msg = arguments[0] ? String(arguments[0]) : '';
                  if (msg.includes('ultimate-toolbar-gpt') || msg.includes('react-draggable') || msg.includes('Hydration failed') || msg.includes('server-rendered HTML')) {
                    return;
                  }
                  origError.apply(console, arguments);
                };
              })();
            `
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,es,fr,de,yo,ig,ha,zh-CN,ja,ar,pt,it',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `
          }}
        />
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration:', err);
                  });
                });
              }
            `
          }}
        />
        {children}
        <AmiraChatWidget />
        <div id="google_translate_element" style={{ display: 'none' }} />
      </body>
    </html>
  );
}
