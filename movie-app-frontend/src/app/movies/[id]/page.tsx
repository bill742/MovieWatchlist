import { headers } from "next/headers";
import Image from "next/image";
import { type Genre, Movie } from "@/types";

const SingleMovie = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
    },
  };

  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const id = pathname ? pathname.split("/").pop() : null;

  if (!id) {
    return <div>Movie not found</div>;
  }

  const movieRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  );
  const movie: Movie = await movieRes.json();

  return (
    <div
      style={{
        backgroundImage: `url("${process.env.NEXT_PUBLIC_API_IMAGE_PATH}original${movie.backdrop_path}")`,
      }}
      className="relative flex h-screen flex-col items-center bg-cover bg-top"
    >
      <div className="absolute top-20 flex flex-row gap-x-4 bg-white/30 backdrop-blur-sm">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w500${movie.poster_path}`}
          alt={movie.title}
          width={185}
          height={278}
        />

        <div className="p-4 text-white">
          <h1 className="mb-4 text-2xl font-semibold">{movie.title}</h1>
          <p className="mb-4">
            {movie.release_date
              ? ` (${new Date(movie.release_date).getFullYear()})`
              : ""}
            {movie.genres && movie.genres.length > 0
              ? ` - ${movie.genres.map((genre: Genre) => genre.name).join(", ")}`
              : ""}
            {movie.runtime ? ` - ${movie.runtime} min` : ""}
          </p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleMovie;
