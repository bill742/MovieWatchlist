import { MovieFetcher } from "@/components/movies/movie-fetcher";
import { RegionSelect } from "@/components/header/region-select";

export default function Home() {
  return (
    <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
      <RegionSelect />
      <MovieFetcher />
    </main>
  );
}
