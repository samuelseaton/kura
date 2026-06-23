import { gql } from "graphql-tag";

export const STUDIO_LIST_QUERY = gql`
  query StudioList($page: Int, $perPage: Int) {
    studioList(page: $page, perPage: $perPage) {
      hasNextPage
      items {
        id
        name
        favourites
        coverImageUrl
      }
    }
  }
`;

export const STUDIO_DETAIL_QUERY = gql`
  query StudioDetail($id: ID!) {
    studio(id: $id) {
      id
      name
      siteUrl
      series {
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
  }
`;
