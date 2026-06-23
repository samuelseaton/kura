import { gql } from 'graphql-tag';
import type { TypedDocumentNode } from '@apollo/client';

export interface StudioItem {
  id: string;
  coverImageUrl: string | null;
  favourites: number;
  name: string;
}

export const STUDIO_LIST_QUERY: TypedDocumentNode<
  { studioList: { hasNextPage: boolean; items: StudioItem[] } },
  { page?: number; perPage?: number }
> = gql`
  query StudioList($page: Int, $perPage: Int) {
    studioList(page: $page, perPage: $perPage) {
      hasNextPage
      items {
        id
        coverImageUrl
        favourites
        name
      }
    }
  }
`;

export const STUDIO_DETAIL_QUERY = gql`
  query StudioDetail($id: ID!) {
    studio(id: $id) {
      id
      name
      series {
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
      siteUrl
    }
  }
`;
