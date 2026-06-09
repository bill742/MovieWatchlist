"use client";

import Link from "next/link";
import { useTransition } from "react";

import { BookMarked, LogIn, LogOut, User } from "lucide-react";

import { signout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  email: string | null;
}

function UserMenu({ email }: Props) {
  const [pending, startTransition] = useTransition();

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
        <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
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
