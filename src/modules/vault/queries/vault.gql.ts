import { gql } from 'graphql-tag';
import type { TypedDocumentNode } from '@apollo/client';

export interface LibraryEntry {
  id: string;
  anilistId: number;
  status: string;
  personalRating: number | null;
  isFavorite: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeData {
  me: {
    id: string;
    email: string;
    name: string | null;
    settings: {
      preferredGenres: string[];
      defaultSort: string;
      layoutPreference: string;
    } | null;
    libraryEntries: LibraryEntry[];
    collections: {
      id: string;
      name: string;
      createdAt: string;
      items: {
        id: string;
        addedAt: string;
        libraryEntry: {
          id: string;
          anilistId: number;
          status: string;
        };
      }[];
    }[];
  } | null;
}

export const ME_QUERY: TypedDocumentNode<MeData, Record<string, never>> = gql`
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

export const UPSERT_LIBRARY_ENTRY: TypedDocumentNode<
  {
    upsertLibraryEntry: {
      id: string;
      anilistId: number;
      status: string;
      personalRating: number | null;
      isFavorite: boolean;
      notes: string | null;
      updatedAt: string;
    };
  },
  {
    anilistId: number;
    status: string;
    personalRating?: number;
    isFavorite?: boolean;
    notes?: string;
  }
> = gql`
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

export const REMOVE_LIBRARY_ENTRY: TypedDocumentNode<
  { removeLibraryEntry: boolean },
  { anilistId: number }
> = gql`
  mutation RemoveLibraryEntry($anilistId: Int!) {
    removeLibraryEntry(anilistId: $anilistId)
  }
`;

export const CREATE_COLLECTION: TypedDocumentNode<
  {
    createCollection: {
      id: string;
      name: string;
      createdAt: string;
      items: { id: string }[];
    };
  },
  { name: string }
> = gql`
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

export const UPDATE_SETTINGS: TypedDocumentNode<
  {
    updateSettings: {
      id: string;
      name: string | null;
      settings: {
        preferredGenres: string[];
        defaultSort: string;
        layoutPreference: string;
      } | null;
    };
  },
  {
    name?: string;
    preferredGenres?: string[];
    defaultSort?: string;
    layoutPreference?: string;
  }
> = gql`
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
