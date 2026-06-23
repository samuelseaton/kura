import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { AnimeCard } from '@/modules/explore/components/AnimeCard';
import { getStudioDetail, getTopStudioIds } from '@/lib/anilist';

export const revalidate = 86400;

export async function generateStaticParams() {
  const ids = await getTopStudioIds(50);
  return ids.map(id => ({ id }));
}

export default async function StudioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studio = await getStudioDetail(id);

  if (!studio) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <BackButton />

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{studio.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {studio.series.length} title{studio.series.length !== 1 ? 's' : ''}
          </p>
        </div>
        {studio.siteUrl && (
          <a
            href={studio.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            Official site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {studio.series.map(anime => (
          <AnimeCard
            key={anime.id}
            id={anime.id}
            title={anime.title}
            posterUrl={anime.posterUrl}
            rating={anime.rating}
            episodeCount={anime.episodeCount}
            studio={anime.studio}
            genres={anime.genres}
          />
        ))}
      </div>
    </div>
  );
}
