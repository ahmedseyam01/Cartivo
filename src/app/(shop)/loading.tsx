import { ProductGridSkeleton, Skeleton } from "@/components/shared/Skeleton";

export default function ShopLoading() {
  return (
    <div className="page-container" role="status" aria-label="Loading products">
      <div className="space-y-3 pt-6 pb-6 sm:pt-10">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-56" />
      </div>
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
