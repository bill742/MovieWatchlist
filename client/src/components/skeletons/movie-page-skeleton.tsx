const PersonCard = () => (
  <div className="w-32 shrink-0">
    <div className="mb-2 h-48 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
    <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
  </div>
);

const MoviePageSkeleton = () => (
  <div className="min-h-screen pb-12">
    {/* Backdrop */}
    <div className="relative h-[60vh] w-full animate-pulse bg-gray-200 dark:bg-gray-700" />

    {/* Content */}
    <div className="relative container -mt-48 space-y-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Poster */}
        <div className="shrink-0">
          <div className="h-112.5 w-75 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-6">
          {/* Title + meta */}
          <div className="space-y-3">
            <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-wrap gap-4">
              <div className="h-5 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Directors */}
          <div className="space-y-2">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-4">
              <PersonCard />
            </div>
          </div>

          {/* Cast */}
          <div className="space-y-2">
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-wrap gap-4">
              <PersonCard />
              <PersonCard />
              <PersonCard />
              <PersonCard />
              <PersonCard />
              <PersonCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

MoviePageSkeleton.displayName = "MoviePageSkeleton";

export default MoviePageSkeleton;
