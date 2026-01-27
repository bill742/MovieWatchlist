"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";

import { getMovieTrailer } from "@/data/loaders";

interface TrailerModalProps {
  movieId: number;
  movieTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrailerModal({
  movieId,
  movieTitle,
  open,
  onOpenChange,
}: TrailerModalProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchTrailer = async () => {
      setLoading(true);
      const key = await getMovieTrailer(movieId);
      setTrailerKey(key);
      setLoading(false);
    };

    fetchTrailer();
  }, [movieId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{movieTitle} - Trailer</DialogTitle>
          <DialogDescription>
            Watch the trailer for {movieTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="aspect-video w-full">
          {loading ? (
            <div className="bg-muted flex h-full items-center justify-center">
              <Loader message="Loading trailer..." size="sm" />
            </div>
          ) : trailerKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          ) : (
            <div className="bg-muted flex h-full items-center justify-center">
              <p className="text-muted-foreground">No trailer available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
