"use client";

import Link from "next/link";
import Search from "../search/search";

import { ModeToggle } from "./mode-toggle";
import { RegionSelect } from "./region-select";

const Header = () => {
  return (
    <header className="flex w-full flex-row items-center justify-between">
      <Link href={`/`}>
        <h1>Watchlist</h1>
      </Link>

      <Search />

      <RegionSelect />

      <ModeToggle />
    </header>
  );
};

export default Header;
