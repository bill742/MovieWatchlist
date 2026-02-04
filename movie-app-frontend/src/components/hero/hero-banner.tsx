"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Info,Play } from "lucide-react";

import { TrailerModal } from "@/components/movies/trailer-modal";
import { Button } from "@/components/ui/button";

import type { Movie } from "@/types";

interface HeroBannerProps {
  movie: Movie;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <>
      <section className="relative h-[500px] w-full overflow-hidden rounded-2xl">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex h-full items-end p-8 md:p-12">
          <div className="max-w-2xl space-y-4">
            <div className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold">
              <span>Featured Movie</span>
            </div>
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              {movie.title}
            </h1>
            <p className="line-clamp-3 text-lg text-gray-200">
              {movie.overview}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setShowTrailer(true)}
              >
                <Play className="h-5 w-5 fill-white" />
                Watch Trailer
              </Button>
              <Link href={`/movies/${movie.id}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-white/90 text-black backdrop-blur-sm hover:bg-black hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        movieId={movie.id}
        movieTitle={movie.title}
        open={showTrailer}
        onOpenChange={setShowTrailer}
      />
    </>
  );
}
