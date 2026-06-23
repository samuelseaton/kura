import { Skeleton } from '@/components/ui/skeleton';

export function AnimeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  );
}
