"use client";

import { createContext, ReactNode,useContext, useState } from "react";

import type { RegionContextType } from "@/types";

const RegionContext = createContext<RegionContextType | undefined>(undefined);

function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState("US");

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
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
