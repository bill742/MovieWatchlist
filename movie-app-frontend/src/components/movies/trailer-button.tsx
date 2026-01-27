"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TrailerModal } from "./trailer-modal";

interface TrailerButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function TrailerButton({
  movieId,
  movieTitle,
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
        movieId={movieId}
        movieTitle={movieTitle}
        open={showTrailer}
        onOpenChange={setShowTrailer}
      />
    </>
  );
}
