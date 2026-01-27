import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { RegionProvider } from "@/lib/region-context";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://movie-watchlist.com";

export const metadata: Metadata = {
  title: "Movie Watchlist - Track Premiere Dates & Discover Films",
  description:
    "Discover and track movie premiere dates for upcoming and now playing films worldwide. Browse the latest releases and plan your movie watching.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RegionProvider>
            <Header />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </RegionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
