import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discover your Valentine match!",
  description: "Find your Valentine match! Enter your student ID to reveal your connection this Valentine's Day.",
  openGraph: {
    title: "Discover your Valentine match!",
    description: "Find your Valentine match at my-valentine.tech!",
    url: "https://www.my-valentine.tech/",
    siteName: "my-valentine.tech",
    images: [
      {
        url: "https://www.my-valentine.tech/high-res-logo.jpg",
        width: 1200,
        height: 630,
        alt: "my-valentine.tech logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover your Valentine match!",
    description: "Find your Valentine match at my-valentine.tech!",
    images: ["https://www.my-valentine.tech/high-res-logo.jpg"],
    site: "@myvalentinetech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
