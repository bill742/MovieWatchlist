import SkeletonCardList from "./skeleton-card-list";

const SkeletonSection = () => (
  <section className="space-y-6">
    <SkeletonCardList />
  </section>
);

const MediaListSkeleton = () => (
  <section className="space-y-16">
    <div className="h-125 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
    <SkeletonSection />
    <SkeletonSection />
  </section>
);

MediaListSkeleton.displayName = "MediaListSkeleton";

export default MediaListSkeleton;
