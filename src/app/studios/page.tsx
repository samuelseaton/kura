'use client';

import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { StudioCard } from '@/modules/studios/components/StudioCard';
import { AnimeCardSkeleton } from '@/modules/explore/components/AnimeCardSkeleton';
import { STUDIO_LIST_QUERY } from '@/modules/studios/queries/studioList.gql';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StudioItem {
  id: string;
  name: string;
  favourites: number;
  coverImageUrl: string | null;
}

interface StudioListData {
  studioList: {
    hasNextPage: boolean;
    items: StudioItem[];
  };
}

export default function StudiosPage() {
  const [page, setPage] = useState(1);
  const [allStudios, setAllStudios] = useState<StudioItem[]>([]);

  const { data, loading, error, fetchMore } = useQuery<StudioListData>(
    STUDIO_LIST_QUERY,
    {
      variables: { page: 1, perPage: 30 },
    }
  );

  useEffect(() => {
    if (data?.studioList?.items) {
      setAllStudios(data.studioList.items);
      setPage(1);
    }
  }, [data]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const result = await fetchMore({
      variables: { page: nextPage, perPage: 30 },
    });
    const newStudios = (result.data as StudioListData)?.studioList?.items ?? [];
    setAllStudios(prev => [...prev, ...newStudios]);
    setPage(nextPage);
  };

  const hasNextPage = data?.studioList?.hasNextPage ?? false;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 text-2xl font-bold">Animation Studios</h1>
        <p className="text-muted-foreground">
          Failed to load studios: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Animation Studios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the studios behind your favourite anime
        </p>
      </div>

      {loading && allStudios.length === 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      ) : allStudios.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">
          No studios found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allStudios.map(studio => (
              <StudioCard key={studio.id} {...studio} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={cn(buttonVariants({ variant: 'outline' }), 'px-8')}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
