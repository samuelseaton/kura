import {
  anilistFetch,
  normalizeMedia,
  AniListMedia,
  MEDIA_LIST_QUERY,
  MEDIA_DETAIL_QUERY,
  STUDIO_DETAIL_QUERY,
  GENRE_COLLECTION_QUERY,
  STUDIO_LIST_QUERY,
  MEDIA_BY_IDS_QUERY,
} from '@/lib/anilist';

type AniListSort =
  | 'SCORE_DESC'
  | 'POPULARITY_DESC'
  | 'TRENDING_DESC'
  | 'START_DATE_DESC';

interface MediaFilter {
  genres?: string[];
  page?: number;
  perPage?: number;
  search?: string;
  sort?: AniListSort;
}

export const anilistResolvers = {
  Query: {
    mediaList: async (
      _: unknown,
      { filter = {} }: { filter?: MediaFilter }
    ) => {
      const data = await anilistFetch<{
        Page: {
          pageInfo: {
            total: number;
            currentPage: number;
            hasNextPage: boolean;
          };
          media: AniListMedia[];
        };
      }>(MEDIA_LIST_QUERY, {
        page: filter.page ?? 1,
        perPage: filter.perPage ?? 24,
        search: filter.search || undefined,
        genre_in: filter.genres?.length ? filter.genres : undefined,
        sort: [filter.sort ?? 'SCORE_DESC'],
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
          m.characters?.nodes?.map(c => ({
            id: String(c.id),
            name: c.name.full,
            imageUrl: c.image?.medium ?? null,
          })) ?? [],
        recommendations:
          m.recommendations?.nodes
            ?.filter(n => n.mediaRecommendation)
            .map(n => normalizeMedia(n.mediaRecommendation!)) ?? [],
      };
    },

    genres: async () => {
      const data = await anilistFetch<{ GenreCollection: string[] }>(
        GENRE_COLLECTION_QUERY,
        {},
        86400
      );
      return data.GenreCollection.filter(g => g !== 'Hentai');
    },

    studioList: async (
      _: unknown,
      { page = 1, perPage = 25, search }: { page?: number; perPage?: number; search?: string }
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
      }>(STUDIO_LIST_QUERY, { page, perPage, search: search || undefined });

      return {
        items: data.Page.studios.map(s => ({
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
        series: Array.from(new Map(s.media.nodes.map(n => [n.id, n])).values())
          .filter(n => n.type === 'ANIME')
          .map(normalizeMedia),
      };
    },
  },
};
