import type { Metadata } from "next";
import { Bungee_Shade, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bungeeShade = Bungee_Shade({
  variable: "--font-bungee-shade",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hot Diggity - Hot Dog Crawl",
  description:
    "Rate, rank, and relish every stop on the ultimate hot dog crawl.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bungeeShade.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
