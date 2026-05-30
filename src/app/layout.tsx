import type { Metadata } from "next";
import { Paytone_One, Poppins, Inter, Quantico } from "next/font/google";
import "./globals.css";

const paytoneOne = Paytone_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-paytone",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const quantico = Quantico({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-quantico",
});

export const metadata: Metadata = {
  title: "Amira | Your A.I Powered Call Center",
  description: "Amira does the work of 1000 Call Center Agents, answering calls like a real human. Streamline customer interactions, reduce operational costs, and boost productivity with smart, scalable, and seamless solutions.",
  icons: {
    icon: "https://framerusercontent.com/images/s6PTI0917GyaZC8qM5Tzk1HIAA.png",
    shortcut: "https://framerusercontent.com/images/s6PTI0917GyaZC8qM5Tzk1HIAA.png",
    apple: "https://framerusercontent.com/images/s6PTI0917GyaZC8qM5Tzk1HIAA.png",
  }
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${paytoneOne.variable} ${poppins.variable} ${inter.variable} ${quantico.variable}`}>
      <head>
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

