import { MovieFetcher } from "@/components/movies/movie-fetcher";

export default function Home() {
  return (
    <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
      <MovieFetcher />
    </main>
  );
}
