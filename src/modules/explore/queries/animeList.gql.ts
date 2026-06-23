import { gql } from 'graphql-tag';

export const MEDIA_LIST_QUERY = gql`
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

export const GENRES_QUERY = gql`
  query Genres {
    genres
  }
`;

export const MEDIA_BY_IDS_QUERY = gql`
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
