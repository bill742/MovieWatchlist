"use client";

import { useState } from "react";

import { Clapperboard, Tv } from "lucide-react";

import { RegionSelect } from "@/components/header/region-select";
import { MovieFetcher } from "@/components/movies/movie-fetcher";
import { TVFetcher } from "@/components/tv/tv-fetcher";

type Tab = "movies" | "tv";

function ContentTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("movies");

  return (
    <div className="space-y-8">
      {/* Tab bar */}
      <div className="flex flex-col justify-between gap-y-8 md:flex-row md:gap-y-0">
        <div className="flex w-fit gap-1 rounded-lg border p-1">
          <TabButton
            active={activeTab === "movies"}
            icon={<Clapperboard className="h-4 w-4" />}
            label="Movies"
            onClick={() => setActiveTab("movies")}
          />
          <TabButton
            active={activeTab === "tv"}
            icon={<Tv className="h-4 w-4" />}
            label="TV Shows"
            onClick={() => setActiveTab("tv")}
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          Select your region: <RegionSelect />
        </div>
      </div>

      {activeTab === "movies" ? <MovieFetcher /> : <TVFetcher />}
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

ContentTabs.displayName = "ContentTabs";

export { ContentTabs };
