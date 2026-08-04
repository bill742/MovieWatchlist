import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/server";

import { RegionProvider } from "@/lib/region-context";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://movie-watchlist.com";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Discover and track movie premiere dates for upcoming and now playing films worldwide. Browse the latest releases and plan your movie watching.",
  metadataBase: new URL(siteUrl),
  title: `${process.env.NEXT_PUBLIC_SITE_NAME} - Track Premiere Dates & Discover Films`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            <Header email={user?.email} />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </RegionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
