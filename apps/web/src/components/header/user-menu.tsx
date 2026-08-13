"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  // Sign-in and sign-out are both server actions: they change the cookie and
  // redirect, so supabase-js in this tab never performs either and
  // onAuthStateChange stays silent. This component lives in the root layout, so
  // it survives the redirect without remounting, and kept offering "Sign in" to
  // someone already signed in. Detail pages looked correct only because their
  // buttons mount fresh. Re-reading on navigation covers both directions, since
  // each redirect is itself a navigation.
  const pathname = usePathname();
  // One client for the component's life. Building a new one per navigation
  // spawns multiple GoTrue instances against the same storage.
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let active = true;

    // getSession, not getUser: this only decides what the header renders, and
    // getUser is a round trip to the auth server on every navigation. That cost
    // was enough to push detail pages past their load budget in Firefox. Route
    // gating still uses requireUser() on the server, and RLS guards the data —
    // nothing is authorized on the strength of this read.
    supabase.auth.getSession().then(({ data }) => {
      if (active) setEmail(data.session?.user?.email ?? null);
    });

    return () => {
      active = false;
    };
  }, [pathname, supabase]);

  useEffect(() => {
    // Catches whatever happens without a navigation: token refreshes, and
    // sign-outs performed in another tab.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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
