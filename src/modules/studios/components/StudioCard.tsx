import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface StudioCardProps {
  id: string;
  coverImageUrl: string | null;
  favourites: number;
  name: string;
}

export function StudioCard({
  id,
  coverImageUrl,
  favourites,
  name,
}: StudioCardProps) {
  return (
    <Link href={`/studios/${id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/30">
              {name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {favourites.toLocaleString()} favourites
          </p>
        </div>
      </article>
    </Link>
  );
}
