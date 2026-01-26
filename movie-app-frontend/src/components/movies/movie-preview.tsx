import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface MoviePreviewProps {
  movie: Movie;
}

const MoviePreview = ({ movie }: MoviePreviewProps) => {
  return (
    <Link href={`/movies/${movie.id}`} className="no-underline">
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-lg transition-shadow focus-within:shadow-2xl hover:shadow-2xl">
        <div className="relative aspect-[185/278] w-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}${movie.poster_path}`}
            alt={movie.title}
            fill
            className="h-full w-full object-cover"
            placeholder="blur"
            blurDataURL={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            sizes="(max-width: 768px) 100vw, 185px"
            priority
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-3">
          <CardTitle className="line-clamp-2 min-h-[2.5rem] text-center text-base font-semibold text-neutral-900">
            {movie.title}
          </CardTitle>
          <CardDescription className="text-center text-sm text-neutral-600">
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
};

export default MoviePreview;
