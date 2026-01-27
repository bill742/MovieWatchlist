"use client";

import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Search() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/search?term=${term}`);
    setTerm("");
  };

  const clearSearch = () => {
    setTerm("");
  };

  return (
    <div className="w-60% flex p-4">
      <form id="searchForm" onSubmit={handleSubmit}>
        <div className="flex w-full gap-4">
          <Input
            placeholder="Search by Movie Title"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            id="search"
          />
          {term && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" aria-label="Search movies">
            <SearchIcon className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
