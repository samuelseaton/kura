import { gql } from 'graphql-tag';
import type { TypedDocumentNode } from '@apollo/client';

export interface LibraryEntry {
  id: string;
  anilistId: number;
  createdAt: string;
  isFavorite: boolean;
  notes: string | null;
  personalRating: number | null;
  status: string;
  updatedAt: string;
}

export interface MeData {
  me: {
    id: string;
    collections: {
      id: string;
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
      name: string;
    }[];
    email: string;
    libraryEntries: LibraryEntry[];
    name: string | null;
    settings: {
      defaultSort: string;
      layoutPreference: string;
      preferredGenres: string[];
    } | null;
  } | null;
}

export const ME_QUERY: TypedDocumentNode<MeData, Record<string, never>> = gql`
  query Me {
    me {
      id
      collections {
        id
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
        name
      }
      email
      libraryEntries {
        id
        anilistId
        createdAt
        isFavorite
        notes
        personalRating
        status
        updatedAt
      }
      name
      settings {
        defaultSort
        layoutPreference
        preferredGenres
      }
    }
  }
`;

export const UPSERT_LIBRARY_ENTRY: TypedDocumentNode<
  {
    upsertLibraryEntry: {
      id: string;
      anilistId: number;
      isFavorite: boolean;
      notes: string | null;
      personalRating: number | null;
      status: string;
      updatedAt: string;
    };
  },
  {
    anilistId: number;
    isFavorite?: boolean;
    notes?: string;
    personalRating?: number;
    status: string;
  }
> = gql`
  mutation UpsertLibraryEntry(
    $anilistId: Int!
    $isFavorite: Boolean
    $notes: String
    $personalRating: Float
    $status: WatchStatus!
  ) {
    upsertLibraryEntry(
      anilistId: $anilistId
      isFavorite: $isFavorite
      notes: $notes
      personalRating: $personalRating
      status: $status
    ) {
      id
      anilistId
      isFavorite
      notes
      personalRating
      status
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
      createdAt: string;
      items: { id: string }[];
      name: string;
    };
  },
  { name: string }
> = gql`
  mutation CreateCollection($name: String!) {
    createCollection(name: $name) {
      id
      createdAt
      items {
        id
      }
      name
    }
  }
`;

export const UPDATE_SETTINGS: TypedDocumentNode<
  {
    updateSettings: {
      id: string;
      name: string | null;
      settings: {
        defaultSort: string;
        layoutPreference: string;
        preferredGenres: string[];
      } | null;
    };
  },
  {
    defaultSort?: string;
    layoutPreference?: string;
    name?: string;
    preferredGenres?: string[];
  }
> = gql`
  mutation UpdateSettings(
    $defaultSort: String
    $layoutPreference: String
    $name: String
    $preferredGenres: [String!]
  ) {
    updateSettings(
      defaultSort: $defaultSort
      layoutPreference: $layoutPreference
      name: $name
      preferredGenres: $preferredGenres
    ) {
      id
      name
      settings {
        defaultSort
        layoutPreference
        preferredGenres
      }
    }
  }
`;
