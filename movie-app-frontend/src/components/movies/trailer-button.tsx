"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TrailerModal } from "./trailer-modal";

interface TrailerButtonProps {
  movieTitle: string;
  trailerKey: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function TrailerButton({
  movieTitle,
  trailerKey,
  variant = "default",
  size = "lg",
}: TrailerButtonProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className="gap-2"
        onClick={() => setShowTrailer(true)}
      >
        <Play className="h-5 w-5 fill-current" />
        Watch Trailer
      </Button>

      <TrailerModal
        movieTitle={movieTitle}
        trailerKey={trailerKey}
        open={showTrailer}
        onOpenChange={setShowTrailer}
      />
    </>
  );
}
