"use client";

import Link from "next/link";
import { Film } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import { Search } from "../search/search";

export function Header() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="from-primary flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br to-purple-600">
            <Film className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">
            Movie<span className="text-primary">Watchlist</span>
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Search />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
