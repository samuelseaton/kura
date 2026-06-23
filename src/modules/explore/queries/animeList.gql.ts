import { gql } from 'graphql-tag';
import type { TypedDocumentNode } from '@apollo/client';

export interface AnimeItem {
  id: string;
  episodeCount: number | null;
  genres: string[];
  posterUrl: string;
  rating: number | null;
  status: string | null;
  studio: { id: string; name: string } | null;
  title: string;
}

interface MediaFilter {
  genres?: string[];
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
}

export const MEDIA_LIST_QUERY: TypedDocumentNode<
  {
    mediaList: {
      currentPage: number;
      hasNextPage: boolean;
      items: AnimeItem[];
      total: number;
    };
  },
  { filter?: MediaFilter }
> = gql`
  query MediaList($filter: MediaFilter) {
    mediaList(filter: $filter) {
      currentPage
      hasNextPage
      items {
        id
        episodeCount
        genres
        posterUrl
        rating
        status
        studio {
          id
          name
        }
        title
      }
      total
    }
  }
`;

export const MEDIA_DETAIL_QUERY = gql`
  query MediaDetail($id: ID!) {
    media(id: $id) {
      id
      airDate
      bannerUrl
      characters {
        id
        imageUrl
        name
      }
      episodeCount
      genres
      posterUrl
      rating
      recommendations {
        id
        genres
        posterUrl
        rating
        studio {
          id
          name
        }
        title
      }
      status
      studio {
        id
        name
      }
      synopsis
      title
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
      episodeCount
      genres
      posterUrl
      rating
      studio {
        id
        name
      }
      title
    }
  }
`;
