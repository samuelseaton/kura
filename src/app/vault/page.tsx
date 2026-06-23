'use client';

import { useQuery } from '@apollo/client/react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthenticate } from '@neondatabase/auth-ui';
import { ME_QUERY } from '@/modules/vault/queries/vault.gql';
import type { LibraryEntry } from '@/modules/vault/queries/vault.gql';
import { MEDIA_BY_IDS_QUERY } from '@/modules/explore/queries/animeList.gql';
import type { AnimeItem } from '@/modules/explore/queries/animeList.gql';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  PLAN_TO_WATCH: 'Plan to Watch',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
};

const STATUS_ORDER = [
  'WATCHING',
  'PLAN_TO_WATCH',
  'COMPLETED',
  'ON_HOLD',
  'DROPPED',
];

type MediaItem = AnimeItem;

export default function VaultPage() {
  const { user, isPending } = useAuthenticate();

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY, {
    skip: !user,
  });

  const anilistIds =
    meData?.me?.libraryEntries.map(e => String(e.anilistId)) ?? [];

  const { data: mediaData, loading: mediaLoading } = useQuery(MEDIA_BY_IDS_QUERY, {
    variables: { ids: anilistIds },
    skip: anilistIds.length === 0,
  });

  if (isPending || meLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <BookMarked className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <h1 className="text-xl font-semibold">Your Vault</h1>
          <p className="mt-1 text-muted-foreground">
            Sign in to see your saved anime
          </p>
        </div>
        <Link href="/auth/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    );
  }

  const entries = meData?.me?.libraryEntries ?? [];
  const mediaMap = new Map<number, MediaItem>(
    (mediaData?.mediaByIds ?? []).map(m => [Number(m.id), m])
  );

  const grouped = STATUS_ORDER.reduce<Record<string, LibraryEntry[]>>(
    (acc, status) => {
      acc[status] = entries.filter(e => e.status === status);
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Vault</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {entries.length} title{entries.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookMarked className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">Your vault is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start exploring and save anime to your library
          </p>
          <Link href="/explore" className={cn(buttonVariants(), 'mt-4')}>
            Browse Anime
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {STATUS_ORDER.map(status => {
            const statusEntries = grouped[status];
            if (!statusEntries?.length) return null;

            return (
              <section key={status}>
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                  {STATUS_LABELS[status]}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                    {statusEntries.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {statusEntries.map(entry => {
                    const media = mediaMap.get(entry.anilistId);
                    return (
                      <Link
                        key={entry.id}
                        href={`/explore/${entry.anilistId}`}
                        className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-3 hover:border-primary/40 hover:bg-white/10"
                      >
                        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {media && (
                            <Image
                              src={media.posterUrl}
                              alt={media.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          {mediaLoading && !media ? (
                            <Skeleton className="h-4 w-2/3" />
                          ) : (
                            <p className="font-medium leading-tight line-clamp-1">
                              {media?.title ?? `#${entry.anilistId}`}
                            </p>
                          )}
                          {media?.studio && (
                            <p className="text-xs text-muted-foreground">
                              {media.studio.name}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {media?.genres.slice(0, 3).map(g => (
                              <Badge
                                key={g}
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px]"
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {entry.personalRating !== null && (
                            <span className="flex items-center gap-1 text-xs text-yellow-400">
                              <Star className="h-3 w-3 fill-yellow-400" />
                              {entry.personalRating.toFixed(1)}
                            </span>
                          )}
                          {media?.rating != null && (
                            <span className="text-xs text-muted-foreground">
                              AniList {media.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
