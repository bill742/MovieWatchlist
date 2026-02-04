import Link from "next/link";

import { Film } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-opacity hover:opacity-80 md:pt-0"
    >
      <div className="from-primary flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br to-purple-600">
        <Film className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold">
        Movie<span className="text-primary">Watchlist</span>
      </span>
    </Link>
  );
}
