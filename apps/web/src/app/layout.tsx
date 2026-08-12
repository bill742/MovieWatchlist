import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

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

/**
 * Deliberately synchronous and cookie-free.
 *
 * This layout used to await `supabase.auth.getUser()` to pass an email into the
 * header. Reading cookies in the root layout opts *every* route in the app out
 * of static rendering, so nothing could be CDN-cached and each page view cost a
 * function invocation — enough to exhaust the plan's monthly allowance. The
 * header now resolves the session in the browser instead; keep server-side auth
 * reads inside the routes that actually gate on them.
 */
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
          <Header />
          <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
