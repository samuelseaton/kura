import { anilistResolvers } from "./anilist";
import { libraryResolvers } from "./library";

export const resolvers = {
  Query: {
    ...anilistResolvers.Query,
    ...libraryResolvers.Query,
  },
  Mutation: {
    ...libraryResolvers.Mutation,
  },
};
