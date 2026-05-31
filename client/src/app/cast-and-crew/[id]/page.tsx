import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { MovieList } from "@/components/movies/movie-list";

import { getPerson, getPersonMovieCredits } from "@/data/loaders";
import type { Movie, PersonMovieCredit } from "@/types";

async function getPersonId(): Promise<string | null> {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const id = pathname ? pathname.split("/").pop() : null;
  return id || null;
}

export async function generateMetadata(): Promise<Metadata> {
  const id = await getPersonId();

  if (!id) {
    return {
      description: "The requested person could not be found.",
      title: `Person Not Found - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    };
  }

  const person = await getPerson(id);

  if (!person) {
    return {
      description: "The requested person could not be found.",
      title: `Person Not Found - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    };
  }

  return {
    alternates: {
      canonical: `/cast-and-crew/${id}`,
    },
    description: person.biography
      ? person.biography.slice(0, 160)
      : `${person.name} filmography and biography.`,
    title: `${person.name} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  };
}

function creditToMovie(credit: PersonMovieCredit): Movie {
  return {
    backdrop_path: credit.backdrop_path ?? "",
    genres: [],
    id: credit.id,
    overview: credit.overview,
    poster_path: credit.poster_path ?? "",
    release_date: credit.release_date,
    release_dates: [],
    runtime: 0,
    title: credit.title,
    vote_average: credit.vote_average,
    vote_count: credit.vote_count,
  };
}

function sortByReleaseDateDesc(
  credits: PersonMovieCredit[]
): PersonMovieCredit[] {
  return [...credits].sort((a, b) => {
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    return (
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
  });
}

function deduplicateById(credits: PersonMovieCredit[]): PersonMovieCredit[] {
  const seen = new Set<number>();
  return credits.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

const DEPARTMENT_ORDER = [
  "Directing",
  "Writing",
  "Production",
  "Camera",
  "Editing",
  "Sound",
  "Music",
  "Art",
  "Costume & Make-Up",
  "Visual Effects",
  "Crew",
];

function groupCrewByDepartment(
  credits: PersonMovieCredit[]
): [string, Movie[]][] {
  const grouped: Record<string, PersonMovieCredit[]> = {};
  for (const credit of credits) {
    const dept = credit.department ?? "Crew";
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(credit);
  }

  return Object.entries(grouped)
    .map(([dept, deptCredits]): [string, Movie[]] => [
      dept,
      sortByReleaseDateDesc(deduplicateById(deptCredits)).map(creditToMovie),
    ])
    .sort(([a], [b]) => {
      const ai = DEPARTMENT_ORDER.indexOf(a);
      const bi = DEPARTMENT_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

const SinglePerson = async () => {
  const id = await getPersonId();

  if (!id) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="mb-4 text-2xl font-bold">Person not found</h2>
        <p>
          The person you&apos;re looking for doesn&apos;t exist or the URL is
          invalid.
        </p>
      </div>
    );
  }

  const [person, credits] = await Promise.all([
    getPerson(id),
    getPersonMovieCredits(id),
  ]);

  if (!person) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="mb-4 text-2xl font-bold">Person not found</h2>
        <p>The requested person could not be found or failed to load.</p>
      </div>
    );
  }

  const castMovies = credits
    ? sortByReleaseDateDesc(credits.cast).map(creditToMovie)
    : [];

  const crewByDepartment = credits ? groupCrewByDepartment(credits.crew) : [];

  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Person header */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {person.profile_path ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_IMAGE_PATH}w342${person.profile_path}`}
            alt={person.name}
            width={200}
            height={300}
            className="h-auto w-40 shrink-0 self-start rounded-xl object-cover shadow-md sm:w-48"
          />
        ) : (
          <div className="flex h-72 w-40 shrink-0 items-center justify-center self-start rounded-xl bg-gray-200 text-center sm:w-48 dark:bg-gray-700">
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
              No Image Available
            </span>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-3xl font-bold">{person.name}</h2>

          {person.imdb_id && (
            <Link
              href={`https://www.imdb.com/name/${person.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-yellow-700 underline-offset-4 hover:underline dark:text-yellow-500"
            >
              View on IMDb
            </Link>
          )}

          {person.biography && (
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {person.biography}
            </p>
          )}
        </div>
      </div>

      {/* Cast filmography */}
      {castMovies.length > 0 && (
        <MovieList heading="Acting" movies={castMovies} />
      )}

      {/* Crew filmography by department */}
      {crewByDepartment.map(([department, movies]) => (
        <MovieList key={department} heading={department} movies={movies} />
      ))}
    </div>
  );
};

export default SinglePerson;
