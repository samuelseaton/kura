'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LibraryButton } from '@/modules/vault/components/LibraryButton';
import { Star, Tv } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  id: string;
  episodeCount: number | null;
  genres: string[];
  posterUrl: string;
  rating: number | null;
  studio: { id: string; name: string } | null;
  title: string;
}

export const AnimeCard = memo(function AnimeCard({
  id,
  episodeCount,
  genres,
  posterUrl,
  rating,
  studio,
  title,
}: AnimeCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group block w-full text-left"
      >
        <article className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02]">
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {rating !== null && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-yellow-400 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {episodeCount && (
              <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white backdrop-blur-sm">
                {episodeCount} ep
              </div>
            )}
          </div>

          <div className="space-y-2 p-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
              {title}
            </h3>
            {studio && (
              <p className="text-xs text-muted-foreground">{studio.name}</p>
            )}
            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 3).map(genre => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px]"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </article>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex gap-4 p-5 pr-10">
            {/* Poster */}
            <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-lg">
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-col gap-2.5">
              <h2 className="text-base font-bold leading-tight">{title}</h2>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                {rating !== null && (
                  <span className="flex items-center gap-1 font-medium text-yellow-400">
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                    {rating.toFixed(1)}
                  </span>
                )}
                {episodeCount && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Tv className="h-3.5 w-3.5" />
                    {episodeCount} ep
                  </span>
                )}
              </div>

              {studio && (
                <Link
                  href={`/studios/${studio.id}`}
                  onClick={() => setOpen(false)}
                  className="w-fit text-sm font-medium text-primary hover:underline"
                >
                  {studio.name}
                </Link>
              )}

              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 5).map(genre => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px]"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto">
                <LibraryButton anilistId={Number(id)} />
              </div>
            </div>
          </div>

          <div className="border-t border-border px-5 py-3">
            <Link
              href={`/explore/${id}`}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            >
              View Details
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
