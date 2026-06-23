'use client';

import { useQuery } from '@apollo/client/react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookMarked, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PUBLIC_LIBRARY_QUERY } from '@/modules/vault/queries/vault.gql';
import type { LibraryEntry } from '@/modules/vault/queries/vault.gql';
import { MEDIA_BY_IDS_QUERY } from '@/modules/explore/queries/animeList.gql';
import type { AnimeItem } from '@/modules/explore/queries/animeList.gql';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  PLAN_TO_WATCH: 'Plan to Watch',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
};

const STATUS_ORDER = ['WATCHING', 'PLAN_TO_WATCH', 'COMPLETED', 'ON_HOLD', 'DROPPED'];

const STATUS_COLORS: Record<string, string> = {
  WATCHING: 'text-green-400',
  COMPLETED: 'text-blue-400',
  PLAN_TO_WATCH: 'text-yellow-400',
  ON_HOLD: 'text-orange-400',
  DROPPED: 'text-red-400',
};

export default function PublicVaultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const { data: libData, loading: libLoading } = useQuery(PUBLIC_LIBRARY_QUERY, {
    variables: { token },
  });

  const entries = libData?.publicLibrary?.libraryEntries ?? [];
  const anilistIds = entries.map(e => String(e.anilistId));

  const { data: mediaData, loading: mediaLoading } = useQuery(MEDIA_BY_IDS_QUERY, {
    variables: { ids: anilistIds },
    skip: anilistIds.length === 0,
  });

  const mediaMap = new Map<number, AnimeItem>(
    (mediaData?.mediaByIds ?? []).map(m => [Number(m.id), m])
  );

  if (libLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="mb-8 h-4 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!libData?.publicLibrary) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <BookMarked className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <h1 className="text-xl font-semibold">Library not found</h1>
          <p className="mt-1 text-muted-foreground">
            This share link may have been revoked or is invalid.
          </p>
        </div>
        <Link href="/explore" className="text-sm text-primary hover:underline">
          Browse Anime
        </Link>
      </div>
    );
  }

  const { ownerName, ownerAvatarUrl } = libData.publicLibrary;
  const displayName = ownerName ?? 'Someone';

  const grouped = STATUS_ORDER.reduce<Record<string, LibraryEntry[]>>((acc, status) => {
    acc[status] = entries.filter(e => e.status === status);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        {ownerAvatarUrl ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
            <Image src={ownerAvatarUrl} alt={displayName} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {displayName[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{displayName}'s Vault</h1>
          <p className="text-sm text-muted-foreground">
            {entries.length} title{entries.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookMarked className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">This vault is empty</p>
        </div>
      ) : (
        <div className="space-y-10">
          {STATUS_ORDER.map(status => {
            const statusEntries = grouped[status];
            if (!statusEntries?.length) return null;
            return (
              <section key={status}>
                <h2 className={cn('mb-4 flex items-center gap-2 text-base font-semibold', STATUS_COLORS[status])}>
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
                            <p className="font-medium leading-tight line-clamp-2">
                              {media?.title ?? `#${entry.anilistId}`}
                            </p>
                          )}
                          {media?.studio && (
                            <p className="text-xs text-muted-foreground">{media.studio.name}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {media?.genres.slice(0, 3).map(g => (
                              <Badge key={g} variant="secondary" className="px-1.5 py-0 text-[10px]">
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
