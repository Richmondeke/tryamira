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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${paytoneOne.variable} ${poppins.variable} ${inter.variable} ${quantico.variable}`}>
      <body>{children}</body>
    </html>
  );
}

