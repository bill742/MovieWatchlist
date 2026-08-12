"use client";

import { useEffect, useState, useTransition } from "react";

import Link from "next/link";

import { BookMarked, LogIn, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";

function UserMenu() {
  const [pending, startTransition] = useTransition();
  // `undefined` means "not resolved yet" — distinct from `null` (signed out),
  // so the first paint renders neutral space rather than flashing "Sign in" at
  // a user who is in fact signed in.
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? null);
    });

    // Keeps the header honest after sign-in/sign-out without a reload, which
    // the server-rendered email prop used to depend on.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setEmail(session?.user?.email ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (email === undefined) {
    return <div aria-hidden className="h-9 w-9" />;
  }

  if (!email) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/login">
          <LogIn className="mr-1.5 h-4 w-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="User menu" size="icon" variant="ghost">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="text-muted-foreground truncate px-2 py-1.5 text-xs">
          {email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/watchlist">
            <BookMarked className="mr-2 h-4 w-4" />
            My Watchlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={pending}
          onSelect={() => startTransition(() => signout())}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

UserMenu.displayName = "UserMenu";

export { UserMenu };
