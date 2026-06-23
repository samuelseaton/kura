const ANILIST_URL = "https://graphql.anilist.co";

export async function anilistFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 3600
): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`AniList request failed: ${res.status}`);

  const json = (await res.json()) as { data: T; errors?: { message: string }[] };
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
      media(sort: SCORE_DESC, perPage: 25) {
        nodes {
          id
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

export const GENRES_QUERY = `
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

export function stripHtml(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildTitle(title: { english?: string | null; romaji?: string | null }): string {
  return title.english ?? title.romaji ?? "Unknown";
}
