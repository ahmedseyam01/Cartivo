import { Skeleton } from "@/components/shared/Skeleton";

export default function AccountLoading() {
  return (
    <div className="page-container" role="status" aria-label="Loading">
      <div className="space-y-3 pt-6 pb-6 sm:pt-10">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-56" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
