import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # ── AniList-sourced types ──────────────────────────────────────────────────

  type Media {
    id: ID!
    title: String!
    synopsis: String
    posterUrl: String!
    bannerUrl: String
    rating: Float
    episodeCount: Int
    status: String
    airDate: String
    genres: [String!]!
    studio: MediaStudio
  }

  type MediaStudio {
    id: ID!
    name: String!
  }

  type MediaListResult {
    items: [Media!]!
    total: Int!
    hasNextPage: Boolean!
    currentPage: Int!
  }

  type StudioSummary {
    id: ID!
    name: String!
    favourites: Int!
    coverImageUrl: String
  }

  type StudioListResult {
    items: [StudioSummary!]!
    hasNextPage: Boolean!
  }

  type StudioDetail {
    id: ID!
    name: String!
    siteUrl: String
    series: [Media!]!
  }

  type MediaCharacter {
    id: ID!
    name: String!
    imageUrl: String
  }

  type MediaDetail {
    id: ID!
    title: String!
    synopsis: String
    posterUrl: String!
    bannerUrl: String
    rating: Float
    episodeCount: Int
    status: String
    airDate: String
    genres: [String!]!
    studio: MediaStudio
    characters: [MediaCharacter!]!
    recommendations: [Media!]!
  }

  enum MediaSort {
    SCORE_DESC
    POPULARITY_DESC
    TRENDING_DESC
    START_DATE_DESC
  }

  input MediaFilter {
    search: String
    genres: [String!]
    sort: MediaSort
    page: Int
    perPage: Int
  }

  # ── User data types ────────────────────────────────────────────────────────

  enum WatchStatus {
    WATCHING
    COMPLETED
    PLAN_TO_WATCH
    ON_HOLD
    DROPPED
  }

  type LibraryEntry {
    id: ID!
    anilistId: Int!
    status: WatchStatus!
    personalRating: Float
    isFavorite: Boolean!
    notes: String
    startedAt: String
    completedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type CollectionItem {
    id: ID!
    addedAt: String!
    libraryEntry: LibraryEntry!
  }

  type Collection {
    id: ID!
    name: String!
    createdAt: String!
    items: [CollectionItem!]!
  }

  type UserSettings {
    preferredGenres: [String!]!
    defaultSort: String!
    layoutPreference: String!
  }

  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    settings: UserSettings
    libraryEntries: [LibraryEntry!]!
    collections: [Collection!]!
  }

  # ── Queries ────────────────────────────────────────────────────────────────

  type Query {
    mediaList(filter: MediaFilter): MediaListResult!
    media(id: ID!): MediaDetail
    mediaByIds(ids: [ID!]!): [Media!]!
    genres: [String!]!
    studioList(page: Int, perPage: Int, search: String): StudioListResult!
    studio(id: ID!): StudioDetail
    me: User
  }

  # ── Mutations ──────────────────────────────────────────────────────────────

  type Mutation {
    upsertLibraryEntry(
      anilistId: Int!
      status: WatchStatus!
      personalRating: Float
      isFavorite: Boolean
      notes: String
      startedAt: String
      completedAt: String
    ): LibraryEntry!

    removeLibraryEntry(anilistId: Int!): Boolean!

    createCollection(name: String!): Collection!
    addToCollection(collectionId: ID!, libraryEntryId: ID!): CollectionItem!
    removeFromCollection(collectionId: ID!, libraryEntryId: ID!): Boolean!

    updateSettings(
      name: String
      avatarUrl: String
      preferredGenres: [String!]
      defaultSort: String
      layoutPreference: String
    ): User!
  }
`;
