const SkeletonCard = () => (
  <div className="relative aspect-2/3 animate-pulse overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700" />
);

const SkeletonCardList = () => (
  <>
    <div className="flex flex-col justify-between">
      <div className="h-9 w-41 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="from-primary mt-1 h-1 w-16 rounded-full bg-linear-to-r to-purple-600" />
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </>
);

SkeletonCardList.displayName = "SkeletonCardList";

export { SkeletonCardList };
