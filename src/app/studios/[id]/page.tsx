"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ExternalLink, ChevronLeft } from "lucide-react";
import { AnimeCard } from "@/modules/explore/components/AnimeCard";
import { AnimeCardSkeleton } from "@/modules/explore/components/AnimeCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDIO_DETAIL_QUERY } from "@/modules/studios/queries/studioList.gql";

interface StudioDetailData {
  studio: {
    id: string;
    name: string;
    siteUrl: string | null;
    series: {
      id: string;
      title: string;
      posterUrl: string;
      rating: number | null;
      episodeCount: number | null;
      genres: string[];
      studio: { id: string; name: string } | null;
    }[];
  } | null;
}

export default function StudioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading } = useQuery<StudioDetailData>(STUDIO_DETAIL_QUERY, {
    variables: { id },
  });

  const studio = data?.studio;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/studios"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        All Studios
      </Link>

      {loading ? (
        <>
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="mb-8 h-4 w-24" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : !studio ? (
        <p className="text-muted-foreground">Studio not found.</p>
      ) : (
        <>
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{studio.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {studio.series.length} title{studio.series.length !== 1 ? "s" : ""}
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
            {studio.series.map((anime) => (
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
        </>
      )}
    </div>
  );
}
