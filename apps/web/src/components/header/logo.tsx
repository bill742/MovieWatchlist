import Link from "next/link";

import { Film } from "lucide-react";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-opacity hover:opacity-80 md:pt-0"
    >
      <div className="from-primary flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br to-purple-600">
        <Film className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-xl font-bold">
        Movie<span className="text-primary">Watchlist</span>
      </h1>
    </Link>
  );
}

Logo.displayName = "Logo";

export { Logo };
