// @/src/app/layout.tsx

import type { Metadata } from "next";
import { Jost, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoe Empire - Best Online Shoe Store in Nairobi",
  description:
    "Discover the best online shoe store in Nairobi at Shoe Empire. We offer a wide selection of stylish and comfortable shoes for men, women, and children. Shop now and step up your shoe game with our trendy and affordable footwear collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        jost.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
