"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/modules/explore/components/AnimeCard";
import { LibraryButton } from "@/modules/vault/components/LibraryButton";
import { MEDIA_DETAIL_QUERY } from "@/modules/explore/queries/animeList.gql";
import { Star, Tv, Calendar } from "lucide-react";

interface MediaDetail {
  media: {
    id: string;
    title: string;
    synopsis: string | null;
    posterUrl: string;
    bannerUrl: string | null;
    rating: number | null;
    episodeCount: number | null;
    status: string | null;
    airDate: string | null;
    genres: string[];
    studio: { id: string; name: string } | null;
    characters: { id: string; name: string; imageUrl: string | null }[];
    recommendations: {
      id: string;
      title: string;
      posterUrl: string;
      rating: number | null;
      genres: string[];
      studio: { id: string; name: string } | null;
    }[];
  } | null;
}

export default function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading } = useQuery<MediaDetail>(MEDIA_DETAIL_QUERY, {
    variables: { id },
  });

  const anime = data?.media;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-4 h-56 w-full rounded-xl" />
        <div className="flex gap-6">
          <Skeleton className="h-64 w-44 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Anime not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      {/* Banner */}
      {anime.bannerUrl && (
        <div className="relative -mx-4 mb-6 h-48 overflow-hidden sm:-mx-6 md:mx-0 md:rounded-xl">
          <Image
            src={anime.bannerUrl}
            alt={anime.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="flex gap-6">
        <div className="relative h-64 w-44 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-xl">
          <Image
            src={anime.posterUrl}
            alt={anime.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 pt-2">
          <h1 className="text-2xl font-bold leading-tight">{anime.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {anime.rating !== null && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                {anime.rating.toFixed(1)}
              </span>
            )}
            {anime.episodeCount && (
              <span className="flex items-center gap-1">
                <Tv className="h-4 w-4" />
                {anime.episodeCount} episodes
              </span>
            )}
            {anime.airDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {anime.airDate.slice(0, 4)}
              </span>
            )}
            {anime.studio && (
              <Link
                href={`/studios/${anime.studio.id}`}
                className="text-primary hover:underline"
              >
                {anime.studio.name}
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {anime.genres.map((g) => (
              <Badge key={g} variant="secondary">
                {g}
              </Badge>
            ))}
          </div>

          <LibraryButton anilistId={Number(id)} />
        </div>
      </div>

      {/* Synopsis */}
      {anime.synopsis && (
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
          <p className="leading-relaxed text-muted-foreground">{anime.synopsis}</p>
        </section>
      )}

      {/* Characters */}
      {anime.characters.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Main Characters</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {anime.characters.map((c) => (
              <div key={c.id} className="text-center">
                <div className="relative mx-auto mb-1.5 h-16 w-16 overflow-hidden rounded-full border border-border/50 bg-muted">
                  {c.imageUrl && (
                    <Image
                      src={c.imageUrl}
                      alt={c.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <p className="text-xs font-medium leading-tight line-clamp-2">{c.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {anime.recommendations.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">You Might Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {anime.recommendations.map((r) => (
              <AnimeCard
                key={r.id}
                id={r.id}
                title={r.title}
                posterUrl={r.posterUrl}
                rating={r.rating}
                episodeCount={null}
                studio={r.studio}
                genres={r.genres}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
