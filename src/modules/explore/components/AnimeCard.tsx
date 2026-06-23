import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface AnimeCardProps {
  id: string;
  title: string;
  posterUrl: string;
  rating: number | null;
  episodeCount: number | null;
  studio: { id: string; name: string } | null;
  genres: string[];
}

export const AnimeCard = memo(function AnimeCard({
  id,
  title,
  posterUrl,
  rating,
  episodeCount,
  studio,
  genres,
}: AnimeCardProps) {
  return (
    <Link href={`/explore/${id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
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
    </Link>
  );
});
