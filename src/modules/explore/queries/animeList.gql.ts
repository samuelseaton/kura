import { gql } from 'graphql-tag';
import type { TypedDocumentNode } from '@apollo/client';

export interface AnimeItem {
  id: string;
  title: string;
  posterUrl: string;
  rating: number | null;
  episodeCount: number | null;
  status: string | null;
  genres: string[];
  studio: { id: string; name: string } | null;
}

interface MediaFilter {
  search?: string;
  genres?: string[];
  sort?: string;
  page?: number;
  perPage?: number;
}

export const MEDIA_LIST_QUERY: TypedDocumentNode<
  {
    mediaList: {
      total: number;
      hasNextPage: boolean;
      currentPage: number;
      items: AnimeItem[];
    };
  },
  { filter?: MediaFilter }
> = gql`
  query MediaList($filter: MediaFilter) {
    mediaList(filter: $filter) {
      total
      hasNextPage
      currentPage
      items {
        id
        title
        posterUrl
        rating
        episodeCount
        status
        genres
        studio {
          id
          name
        }
      }
    }
  }
`;

export const MEDIA_DETAIL_QUERY = gql`
  query MediaDetail($id: ID!) {
    media(id: $id) {
      id
      title
      synopsis
      posterUrl
      bannerUrl
      rating
      episodeCount
      status
      airDate
      genres
      studio {
        id
        name
      }
      characters {
        id
        name
        imageUrl
      }
      recommendations {
        id
        title
        posterUrl
        rating
        genres
        studio {
          id
          name
        }
      }
    }
  }
`;

export const GENRES_QUERY: TypedDocumentNode<
  { genres: string[] },
  Record<string, never>
> = gql`
  query Genres {
    genres
  }
`;

export const MEDIA_BY_IDS_QUERY: TypedDocumentNode<
  { mediaByIds: AnimeItem[] },
  { ids: string[] }
> = gql`
  query MediaByIds($ids: [ID!]!) {
    mediaByIds(ids: $ids) {
      id
      title
      posterUrl
      rating
      episodeCount
      genres
      studio {
        id
        name
      }
    }
  }
`;
