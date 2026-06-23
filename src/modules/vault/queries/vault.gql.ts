import { gql } from 'graphql-tag';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      settings {
        preferredGenres
        defaultSort
        layoutPreference
      }
      libraryEntries {
        id
        anilistId
        status
        personalRating
        isFavorite
        notes
        createdAt
        updatedAt
      }
      collections {
        id
        name
        createdAt
        items {
          id
          addedAt
          libraryEntry {
            id
            anilistId
            status
          }
        }
      }
    }
  }
`;

export const UPSERT_LIBRARY_ENTRY = gql`
  mutation UpsertLibraryEntry(
    $anilistId: Int!
    $status: WatchStatus!
    $personalRating: Float
    $isFavorite: Boolean
    $notes: String
  ) {
    upsertLibraryEntry(
      anilistId: $anilistId
      status: $status
      personalRating: $personalRating
      isFavorite: $isFavorite
      notes: $notes
    ) {
      id
      anilistId
      status
      personalRating
      isFavorite
      notes
      updatedAt
    }
  }
`;

export const REMOVE_LIBRARY_ENTRY = gql`
  mutation RemoveLibraryEntry($anilistId: Int!) {
    removeLibraryEntry(anilistId: $anilistId)
  }
`;

export const CREATE_COLLECTION = gql`
  mutation CreateCollection($name: String!) {
    createCollection(name: $name) {
      id
      name
      createdAt
      items {
        id
      }
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings(
    $name: String
    $preferredGenres: [String!]
    $defaultSort: String
    $layoutPreference: String
  ) {
    updateSettings(
      name: $name
      preferredGenres: $preferredGenres
      defaultSort: $defaultSort
      layoutPreference: $layoutPreference
    ) {
      id
      name
      settings {
        preferredGenres
        defaultSort
        layoutPreference
      }
    }
  }
`;
