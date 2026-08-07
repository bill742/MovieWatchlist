"use client";

import { ReactNode, createContext, useContext } from "react";

import type { RegionContextType } from "@/types";

const RegionContext = createContext<RegionContextType | undefined>(undefined);

/**
 * Region comes from the signed-in user's profile, set on the Profile page.
 * There was also a header dropdown that wrote to local state only, so the two
 * disagreed and neither survived a reload.
 */
function RegionProvider({
  children,
  region,
}: {
  children: ReactNode;
  region: string;
}) {
  return (
    <RegionContext.Provider value={{ region }}>
      {children}
    </RegionContext.Provider>
  );
}

function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}

RegionProvider.displayName = "RegionProvider";

export { RegionProvider, useRegion };
