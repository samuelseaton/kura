const ANILIST_URL = 'https://graphql.anilist.co';

export async function anilistFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 3600
): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`AniList request failed: ${res.status}`);

  const json = (await res.json()) as {
    data: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data;
}

export const MEDIA_LIST_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $genre_in: [String], $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage hasNextPage }
      media(
        type: ANIME
        isAdult: false
        format_in: [TV, MOVIE]
        search: $search
        genre_in: $genre_in
        sort: $sort
      ) {
        id
        title { romaji english }
        description(asHtml: false)
        coverImage { extraLarge }
        averageScore
        episodes
        status
        startDate { year month day }
        genres
        studios(isMain: true) { nodes { id name } }
      }
    }
  }
`;

export const MEDIA_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
      description(asHtml: false)
      coverImage { extraLarge }
      bannerImage
      averageScore
      episodes
      status
      startDate { year month day }
      genres
      studios(isMain: true) { nodes { id name } }
      characters(sort: ROLE, role: MAIN, perPage: 6) {
        nodes { id name { full } image { medium } }
      }
      recommendations(sort: RATING_DESC, perPage: 6) {
        nodes {
          mediaRecommendation {
            id
            title { romaji english }
            coverImage { large }
            averageScore
          }
        }
      }
    }
  }
`;

export const STUDIO_DETAIL_QUERY = `
  query ($id: Int) {
    Studio(id: $id) {
      id
      name
      siteUrl
      media(sort: SCORE_DESC, perPage: 50) {
        nodes {
          id
          type
          title { romaji english }
          coverImage { extraLarge }
          averageScore
          episodes
          genres
        }
      }
    }
  }
`;

export const GENRE_COLLECTION_QUERY = `
  query {
    GenreCollection
  }
`;

export const STUDIO_LIST_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage }
      studios(sort: FAVOURITES_DESC) {
        id
        name
        favourites
        media(sort: SCORE_DESC, perPage: 1) {
          nodes { coverImage { large } }
        }
      }
    }
  }
`;

export const MEDIA_BY_IDS_QUERY = `
  query ($ids: [Int]) {
    Page(perPage: 50) {
      media(id_in: $ids, type: ANIME) {
        id
        title { romaji english }
        coverImage { extraLarge }
        averageScore
        episodes
        status
        startDate { year month day }
        genres
        studios(isMain: true) { nodes { id name } }
      }
    }
  }
`;

// ── Shared types & helpers (used by resolvers and server components) ─────────

export interface AniListMedia {
  id: number;
  type?: string | null;
  title: {
    romaji?: string | null;
    english?: string | null;
    native?: string | null;
  };
  description?: string | null;
  coverImage?: { extraLarge?: string; large?: string } | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  episodes?: number | null;
  status?: string | null;
  startDate?: {
    year?: number | null;
    month?: number | null;
    day?: number | null;
  } | null;
  genres?: string[];
  studios?: { nodes?: { id: number; name: string }[] } | null;
  characters?: {
    nodes?: {
      id: number;
      name: { full: string };
      image?: { medium?: string };
    }[];
  } | null;
  recommendations?: {
    nodes?: { mediaRecommendation?: AniListMedia | null }[];
  } | null;
}

/**
 * Fetches full anime detail by AniList ID. Returns null if not found or the request fails.
 * @see {@link src/app/explore/[id]/page.tsx}
 */
export async function getAnimeDetail(id: string) {
  try {
    const data = await anilistFetch<{ Media: AniListMedia }>(
      MEDIA_DETAIL_QUERY,
      { id: Number(id) },
      86400
    );
    const m = data.Media;
    return {
      ...normalizeMedia(m),
      characters:
        m.characters?.nodes?.map(c => ({
          id: String(c.id),
          name: c.name.full,
          imageUrl: c.image?.medium ?? null,
        })) ?? [],
      recommendations:
        m.recommendations?.nodes
          ?.filter(n => n.mediaRecommendation != null)
          .map(n => normalizeMedia(n.mediaRecommendation!)) ?? [],
    };
  } catch {
    return null;
  }
}

/**
 * Fetches studio detail by AniList ID, including its anime series. Returns null if not found or the request fails.
 * @see {@link src/app/studios/[id]/page.tsx}
 */
export async function getStudioDetail(id: string) {
  try {
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
  } catch {
    return null;
  }
}

/**
 * Returns the IDs of the top `count` anime by popularity. Used by generateStaticParams.
 * @see {@link src/app/explore/[id]/page.tsx}
 */
export async function getTopAnimeIds(count: number): Promise<string[]> {
  try {
    const data = await anilistFetch<{ Page: { media: { id: number }[] } }>(
      MEDIA_LIST_QUERY,
      { page: 1, perPage: count, sort: ['POPULARITY_DESC'] }
    );
    return data.Page.media.map(m => String(m.id));
  } catch {
    return [];
  }
}

/**
 * Returns the IDs of the top `count` studios by favourites. Used by generateStaticParams.
 * @see {@link src/app/studios/[id]/page.tsx}
 */
export async function getTopStudioIds(count: number): Promise<string[]> {
  try {
    const data = await anilistFetch<{ Page: { studios: { id: number }[] } }>(
      STUDIO_LIST_QUERY,
      { page: 1, perPage: count }
    );
    return data.Page.studios.map(s => String(s.id));
  } catch {
    return [];
  }
}

/**
 * Maps a raw AniList media node to the shape used throughout the app.
 * @see {@link src/graphql/resolvers/anilist.ts}
 */
export function normalizeMedia(m: AniListMedia) {
  const mainStudio = m.studios?.nodes?.[0] ?? null;
  return {
    id: String(m.id),
    title: buildTitle(m.title),
    synopsis: m.description ? stripHtml(m.description) : null,
    posterUrl: m.coverImage?.extraLarge ?? m.coverImage?.large ?? '',
    bannerUrl: m.bannerImage ?? null,
    rating: m.averageScore ? m.averageScore / 10 : null,
    episodeCount: m.episodes ?? null,
    status: m.status ?? null,
    airDate: m.startDate?.year
      ? `${m.startDate.year}-${String(m.startDate.month ?? 1).padStart(2, '0')}-${String(m.startDate.day ?? 1).padStart(2, '0')}`
      : null,
    genres: m.genres ?? [],
    studio: mainStudio
      ? { id: String(mainStudio.id), name: mainStudio.name }
      : null,
  };
}

/**
 * Strips HTML tags from AniList description strings.
 */
function stripHtml(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns the English title if available, falling back to romaji.
 */
function buildTitle(title: {
  english?: string | null;
  romaji?: string | null;
}): string {
  return title.english ?? title.romaji ?? 'Unknown';
}
