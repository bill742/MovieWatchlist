import { MovieFetcher } from "@/components/movies/movie-fetcher";
import { RegionSelect } from "@/components/header/region-select";

export default function Home() {
  return (
    <main className="space-y-12 py-8">
      <div className="flex flex-row items-center gap-4">
        Select your region: <RegionSelect />
      </div>
      <MovieFetcher />
    </main>
  );
}
