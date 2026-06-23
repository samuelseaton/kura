'use client';

import { useQuery } from '@apollo/client/react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MediaFilter, MediaSort } from '../hooks/useAnimeFilter';
import { useDebounce } from '../hooks/useDebounce';
import { useState, useEffect } from 'react';
import { GENRES_QUERY } from '../queries/animeList.gql';

const SORT_OPTIONS: { value: MediaSort; label: string }[] = [
  { value: 'SCORE_DESC', label: 'Top Rated' },
  { value: 'POPULARITY_DESC', label: 'Most Popular' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'START_DATE_DESC', label: 'Newest' },
];

interface FilterSidebarProps {
  filter: MediaFilter;
  onFilterChange: (patch: Partial<MediaFilter>) => void;
  onReset: () => void;
}

export function FilterSidebar({
  filter,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  const { data } = useQuery(GENRES_QUERY);
  const [search, setSearch] = useState(filter.search);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch !== filter.search) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleGenre = (genre: string) => {
    const next = filter.genres.includes(genre)
      ? filter.genres.filter(g => g !== genre)
      : [...filter.genres, genre];
    onFilterChange({ genres: next });
  };

  const hasActiveFilters =
    filter.search || filter.genres.length > 0 || filter.sort !== 'SCORE_DESC';

  return (
    <aside className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anime..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort by
        </p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange({ sort: value })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                filter.sort === value
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-white/8 hover:text-foreground active:bg-white/12'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Genres
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(data?.genres ?? []).map(genre => {
              const active = filter.genres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  {genre}
                </button>
              );
            })}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            setSearch('');
            onReset();
          }}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full gap-2'
          )}
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}
    </aside>
  );
}
