"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/lib/region-context";

export function RegionSelect() {
  const { region, setRegion } = useRegion();

  const regionOptions = [
    { value: "US", label: "US", flag: "🇺🇸" },
    { value: "CA", label: "CAN", flag: "🇨🇦" },
    { value: "GB", label: "GB", flag: "🇬🇧" },
    { value: "AU", label: "AU", flag: "🇦🇺" },
    { value: "DE", label: "DE", flag: "🇩🇪" },
    { value: "FR", label: "FR", flag: "🇫🇷" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 min-w-[80px] px-3 py-2 text-sm font-medium"
          aria-label="Select region"
        >
          <span className="text-lg">{regionOptions.find((opt) => opt.value === region)?.flag}</span>
          <span>{region}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {regionOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => setRegion(option.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{option.flag}</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

