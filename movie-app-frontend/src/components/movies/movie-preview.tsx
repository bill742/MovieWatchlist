import Image from "next/image";
import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { MoviePreviewProps } from "@/types";

export function MoviePreview({ movie }: MoviePreviewProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="no-underline">
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-lg transition-shadow focus-within:shadow-2xl hover:shadow-2xl dark:border-neutral-700 dark:bg-neutral-800">
        <div className="relative aspect-[185/278] w-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
            sizes="(max-width: 768px) 100vw, 185px"
            priority
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-3">
          <CardTitle className="line-clamp-2 min-h-[2.5rem] text-center text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {movie.title}
          </CardTitle>
          <CardDescription className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-medium">Release:</span>{" "}
            <time dateTime={movie.release_date}>
              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </time>
          </CardDescription>
        </div>
      </Card>
    </Link>
  );
}
