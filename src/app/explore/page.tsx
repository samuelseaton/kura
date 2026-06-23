'use client';

import { useQuery } from '@apollo/client/react';
import { useAuthenticate } from '@neondatabase/auth-ui';
import { AnimeCard } from '@/modules/explore/components/AnimeCard';
import { AnimeCardSkeleton } from '@/modules/explore/components/AnimeCardSkeleton';
import { FilterSidebar } from '@/modules/explore/components/FilterSidebar';
import { useAnimeFilter, type MediaSort } from '@/modules/explore/hooks/useAnimeFilter';
import { ME_QUERY } from '@/modules/vault/queries/vault.gql';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/modules/explore/hooks/useDebounce';

export default function ExplorePage() {
  const { user } = useAuthenticate({ enabled: false });
  const { data: meData } = useQuery(ME_QUERY, { skip: !user });
  const defaultSort = meData?.me?.settings?.defaultSort as MediaSort | undefined;
  const preferredGenres = meData?.me?.settings?.preferredGenres;

  const {
    filter,
    hasNextPage,
    items,
    loading,
    loadMore,
    resetFilter,
    updateFilter,
  } = useAnimeFilter(defaultSort, preferredGenres);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    updateFilter({ search: debouncedSearch });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setSearch('');
    resetFilter();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Explore Anime</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse thousands of titles from AniList
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'gap-2 md:hidden'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Mobile search bar – always visible, above the grid */}
      <div className="relative mb-6 md:hidden">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anime..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex gap-8">
        {/* Backdrop – outside sidebar so CSS transform doesn't constrain fixed positioning */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar – desktop always visible, mobile slide-in overlay */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-background p-6 shadow-xl transition-transform md:sticky md:top-[calc(3.5rem+2rem)] md:z-auto md:h-[calc(100vh-3.5rem-2rem)] md:w-56 md:shrink-0 md:translate-x-0 md:self-start md:overflow-y-auto md:bg-transparent md:p-0 md:shadow-none',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <FilterSidebar
            filter={filter}
            onFilterChange={updateFilter}
            onReset={handleReset}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {loading && items.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium">No results found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map(item => (
                  <AnimeCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    posterUrl={item.posterUrl}
                    rating={item.rating}
                    episodeCount={item.episodeCount}
                    studio={item.studio}
                    genres={item.genres}
                  />
                ))}
                {loading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <AnimeCardSkeleton key={`sk-${i}`} />
                  ))}
              </div>

              {hasNextPage && !loading && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMore}
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'px-8'
                    )}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
