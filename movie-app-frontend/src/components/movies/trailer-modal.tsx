"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrailerModalProps {
  movieTitle: string;
  trailerKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrailerModal({
  movieTitle,
  trailerKey,
  open,
  onOpenChange,
}: TrailerModalProps) {
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
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title={`${movieTitle} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
