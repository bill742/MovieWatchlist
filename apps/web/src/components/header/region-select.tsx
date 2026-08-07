"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRegion } from "@/lib/region-context";
import { REGIONS } from "@/types";

function RegionSelect() {
  const { region, setRegion } = useRegion();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex min-w-20 items-center gap-2 px-3 py-2 text-sm font-medium"
          aria-label="Select region"
        >
          <span className="text-lg">
            {REGIONS.find((option) => option.code === region)?.flag}
          </span>
          <span>{region}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-30">
        {REGIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onSelect={() => setRegion(option.code)}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="text-lg">{option.flag}</span>
            <span>{option.short}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

RegionSelect.displayName = "RegionSelect";

export { RegionSelect };
