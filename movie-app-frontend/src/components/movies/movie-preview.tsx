import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { MoviePreviewProps } from "@/types";

export function MoviePreview({ movie }: MoviePreviewProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group no-underline">
      <Card className="relative h-full overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-none transition-all duration-300 hover:scale-105">
        {/* Poster with overlay */}
        <div className="bg-muted relative aspect-[2/3] overflow-hidden rounded-xl">
          {movie.poster_path ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-center">
              <span className="px-4 text-sm text-gray-500">
                No Image Available
              </span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Rating badge */}
          {movie.vote_average && movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}

          {/* Info overlay (shows on hover) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="mb-1 line-clamp-2 text-base font-bold text-white">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-300">
              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Release date TBA"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
