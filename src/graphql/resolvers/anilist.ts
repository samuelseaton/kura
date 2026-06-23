import {
  anilistFetch,
  buildTitle,
  stripHtml,
  MEDIA_LIST_QUERY,
  MEDIA_DETAIL_QUERY,
  STUDIO_DETAIL_QUERY,
  GENRES_QUERY,
  STUDIO_LIST_QUERY,
  MEDIA_BY_IDS_QUERY,
} from "@/lib/anilist";

type AniListSort = "SCORE_DESC" | "POPULARITY_DESC" | "TRENDING_DESC" | "START_DATE_DESC";

interface MediaFilter {
  search?: string;
  genres?: string[];
  sort?: AniListSort;
  page?: number;
  perPage?: number;
}

function normalizeMedia(m: AniListMedia) {
  const mainStudio = m.studios?.nodes?.[0] ?? null;
  return {
    id: String(m.id),
    title: buildTitle(m.title),
    synopsis: m.description ? stripHtml(m.description) : null,
    posterUrl: m.coverImage?.extraLarge ?? m.coverImage?.large ?? "",
    bannerUrl: m.bannerImage ?? null,
    rating: m.averageScore ? m.averageScore / 10 : null,
    episodeCount: m.episodes ?? null,
    status: m.status ?? null,
    airDate: m.startDate?.year ? `${m.startDate.year}-${String(m.startDate.month ?? 1).padStart(2, "0")}-${String(m.startDate.day ?? 1).padStart(2, "0")}` : null,
    genres: m.genres ?? [],
    studio: mainStudio ? { id: String(mainStudio.id), name: mainStudio.name } : null,
  };
}

interface AniListMedia {
  id: number;
  title: { romaji?: string | null; english?: string | null; native?: string | null };
  description?: string | null;
  coverImage?: { extraLarge?: string; large?: string } | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  episodes?: number | null;
  status?: string | null;
  startDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
  genres?: string[];
  studios?: { nodes?: { id: number; name: string }[] } | null;
  characters?: { nodes?: { id: number; name: { full: string }; image?: { medium?: string } }[] } | null;
  recommendations?: { nodes?: { mediaRecommendation?: AniListMedia | null }[] } | null;
}

export const anilistResolvers = {
  Query: {
    mediaList: async (
      _: unknown,
      { filter = {} }: { filter?: MediaFilter }
    ) => {
      const data = await anilistFetch<{
        Page: {
          pageInfo: { total: number; currentPage: number; hasNextPage: boolean };
          media: AniListMedia[];
        };
      }>(MEDIA_LIST_QUERY, {
        page: filter.page ?? 1,
        perPage: filter.perPage ?? 24,
        search: filter.search || undefined,
        genre_in: filter.genres?.length ? filter.genres : undefined,
        sort: [filter.sort ?? "SCORE_DESC"],
      });

      return {
        items: data.Page.media.map(normalizeMedia),
        total: data.Page.pageInfo.total,
        hasNextPage: data.Page.pageInfo.hasNextPage,
        currentPage: data.Page.pageInfo.currentPage,
      };
    },

    media: async (_: unknown, { id }: { id: string }) => {
      const data = await anilistFetch<{ Media: AniListMedia }>(
        MEDIA_DETAIL_QUERY,
        { id: Number(id) },
        86400
      );

      const m = data.Media;
      const base = normalizeMedia(m);

      return {
        ...base,
        characters:
          m.characters?.nodes?.map((c) => ({
            id: String(c.id),
            name: c.name.full,
            imageUrl: c.image?.medium ?? null,
          })) ?? [],
        recommendations:
          m.recommendations?.nodes
            ?.filter((n) => n.mediaRecommendation)
            .map((n) => normalizeMedia(n.mediaRecommendation!)) ?? [],
      };
    },

    genres: async () => {
      const data = await anilistFetch<{ GenreCollection: string[] }>(
        GENRES_QUERY,
        {},
        86400
      );
      return data.GenreCollection;
    },

    studioList: async (
      _: unknown,
      { page = 1, perPage = 25 }: { page?: number; perPage?: number }
    ) => {
      const data = await anilistFetch<{
        Page: {
          pageInfo: { hasNextPage: boolean };
          studios: {
            id: number;
            name: string;
            favourites: number;
            media: { nodes: { coverImage?: { large?: string } }[] };
          }[];
        };
      }>(STUDIO_LIST_QUERY, { page, perPage });

      return {
        items: data.Page.studios.map((s) => ({
          id: String(s.id),
          name: s.name,
          favourites: s.favourites,
          coverImageUrl: s.media.nodes[0]?.coverImage?.large ?? null,
        })),
        hasNextPage: data.Page.pageInfo.hasNextPage,
      };
    },

    mediaByIds: async (_: unknown, { ids }: { ids: string[] }) => {
      if (!ids.length) return [];
      const data = await anilistFetch<{
        Page: { media: AniListMedia[] };
      }>(MEDIA_BY_IDS_QUERY, { ids: ids.map(Number) });
      return data.Page.media.map(normalizeMedia);
    },

    studio: async (_: unknown, { id }: { id: string }) => {
      const data = await anilistFetch<{
        Studio: {
          id: number;
          name: string;
          siteUrl?: string | null;
          media: { nodes: AniListMedia[] };
        };
      }>(STUDIO_DETAIL_QUERY, { id: Number(id) });

      const s = data.Studio;
      return {
        id: String(s.id),
        name: s.name,
        siteUrl: s.siteUrl ?? null,
        series: s.media.nodes.map(normalizeMedia),
      };
    },
  },
};
