"use client";

import Link from "next/link";

import { Search } from "../search/search";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="flex w-full flex-row items-center justify-between">
      <Link href={`/`}>
        <h1>Watchlist</h1>
      </Link>

      <Search />

      <ModeToggle />
    </header>
  );
}
