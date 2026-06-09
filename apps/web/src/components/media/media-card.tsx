import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { MediaCardItem } from "@/types";

interface Props {
  item: MediaCardItem;
}

function MediaCard({ item }: Props) {
  const href = item.media_type === "tv" ? `/tv/${item.id}` : `/movies/${item.id}`;

  return (
    <Link href={href} className="group no-underline">
      <Card className="relative h-full overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-none transition-all duration-300 hover:scale-105">
        <div className="bg-muted relative aspect-2/3 overflow-hidden rounded-xl">
          {item.poster_path ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w342${item.poster_path}`}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 15vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-center dark:bg-gray-700">
              <span className="px-4 text-sm text-gray-600 dark:text-gray-300">
                No Image Available
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {item.vote_average && item.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {item.vote_average.toFixed(1)}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="mb-1 line-clamp-2 text-base font-bold text-white">
              {item.title}
            </h3>
            <p className="text-sm text-gray-300">
              {item.date
                ? new Date(item.date).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date TBA"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

MediaCard.displayName = "MediaCard";

export { MediaCard };
