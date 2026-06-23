import { GraphQLError } from "graphql";
import type { Context } from "@/graphql/context";

const VALID_STATUSES = ["WATCHING", "COMPLETED", "PLAN_TO_WATCH", "ON_HOLD", "DROPPED"];

function requireAuth(userId: string | null) {
  if (!userId) throw new GraphQLError("Not authenticated");
  return userId;
}

function serializeEntry(entry: {
  id: string;
  anilistId: number;
  status: string;
  personalRating: number | null;
  isFavorite: boolean;
  notes: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...entry,
    startedAt: entry.startedAt?.toISOString() ?? null,
    completedAt: entry.completedAt?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const libraryResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, { prisma, userId }: Context) => {
      if (!userId) return null;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          settings: true,
          libraryEntries: { orderBy: { updatedAt: "desc" } },
          collections: {
            include: {
              items: {
                include: { libraryEntry: true },
                orderBy: { addedAt: "desc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!user) return null;

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        settings: user.settings
          ? {
              ...user.settings,
              preferredGenres: JSON.parse(user.settings.preferredGenres) as string[],
            }
          : null,
        libraryEntries: user.libraryEntries.map(serializeEntry),
        collections: user.collections.map((col) => ({
          ...col,
          createdAt: col.createdAt.toISOString(),
          items: col.items.map((item) => ({
            ...item,
            addedAt: item.addedAt.toISOString(),
            libraryEntry: serializeEntry(item.libraryEntry),
          })),
        })),
      };
    },
  },

  Mutation: {
    upsertLibraryEntry: async (
      _: unknown,
      args: {
        anilistId: number;
        status: string;
        personalRating?: number;
        isFavorite?: boolean;
        notes?: string;
        startedAt?: string;
        completedAt?: string;
      },
      { prisma, userId }: Context
    ) => {
      const uid = requireAuth(userId);

      if (!VALID_STATUSES.includes(args.status)) {
        throw new GraphQLError(`Invalid status: ${args.status}`);
      }

      const entry = await prisma.libraryEntry.upsert({
        where: { userId_anilistId: { userId: uid, anilistId: args.anilistId } },
        create: {
          userId: uid,
          anilistId: args.anilistId,
          status: args.status,
          personalRating: args.personalRating ?? null,
          isFavorite: args.isFavorite ?? false,
          notes: args.notes ?? null,
          startedAt: args.startedAt ? new Date(args.startedAt) : null,
          completedAt: args.completedAt ? new Date(args.completedAt) : null,
        },
        update: {
          status: args.status,
          ...(args.personalRating !== undefined && { personalRating: args.personalRating }),
          ...(args.isFavorite !== undefined && { isFavorite: args.isFavorite }),
          ...(args.notes !== undefined && { notes: args.notes }),
          ...(args.startedAt !== undefined && { startedAt: new Date(args.startedAt) }),
          ...(args.completedAt !== undefined && { completedAt: new Date(args.completedAt) }),
        },
      });

      return serializeEntry(entry);
    },

    removeLibraryEntry: async (
      _: unknown,
      { anilistId }: { anilistId: number },
      { prisma, userId }: Context
    ) => {
      const uid = requireAuth(userId);
      await prisma.libraryEntry.deleteMany({ where: { userId: uid, anilistId } });
      return true;
    },

    createCollection: async (
      _: unknown,
      { name }: { name: string },
      { prisma, userId }: Context
    ) => {
      const uid = requireAuth(userId);
      const col = await prisma.collection.create({
        data: { name, userId: uid },
        include: { items: true },
      });
      return { ...col, createdAt: col.createdAt.toISOString(), items: [] };
    },

    addToCollection: async (
      _: unknown,
      { collectionId, libraryEntryId }: { collectionId: string; libraryEntryId: string },
      { prisma, userId }: Context
    ) => {
      const uid = requireAuth(userId);

      const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId: uid } });
      if (!collection) throw new GraphQLError("Collection not found");

      const item = await prisma.collectionItem.create({
        data: { collectionId, libraryEntryId },
        include: { libraryEntry: true },
      });

      return {
        ...item,
        addedAt: item.addedAt.toISOString(),
        libraryEntry: serializeEntry(item.libraryEntry),
      };
    },

    removeFromCollection: async (
      _: unknown,
      { collectionId, libraryEntryId }: { collectionId: string; libraryEntryId: string },
      { prisma, userId }: Context
    ) => {
      const uid = requireAuth(userId);
      const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId: uid } });
      if (!collection) throw new GraphQLError("Collection not found");
      await prisma.collectionItem.deleteMany({ where: { collectionId, libraryEntryId } });
      return true;
    },

    updateSettings: async (
      _: unknown,
      args: {
        name?: string;
        avatarUrl?: string;
        preferredGenres?: string[];
        defaultSort?: string;
        layoutPreference?: string;
      },
      { prisma, userId }: Context
    ) => {
      const uid = requireAuth(userId);

      const user = await prisma.user.update({
        where: { id: uid },
        data: {
          ...(args.name !== undefined && { name: args.name }),
          ...(args.avatarUrl !== undefined && { avatarUrl: args.avatarUrl }),
          settings: {
            upsert: {
              create: {
                preferredGenres: args.preferredGenres ? JSON.stringify(args.preferredGenres) : "[]",
                defaultSort: args.defaultSort ?? "SCORE_DESC",
                layoutPreference: args.layoutPreference ?? "grid",
              },
              update: {
                ...(args.preferredGenres !== undefined && {
                  preferredGenres: JSON.stringify(args.preferredGenres),
                }),
                ...(args.defaultSort !== undefined && { defaultSort: args.defaultSort }),
                ...(args.layoutPreference !== undefined && { layoutPreference: args.layoutPreference }),
              },
            },
          },
        },
        include: {
          settings: true,
          libraryEntries: { orderBy: { updatedAt: "desc" } },
          collections: { include: { items: { include: { libraryEntry: true } } } },
        },
      });

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        settings: user.settings
          ? {
              ...user.settings,
              preferredGenres: JSON.parse(user.settings.preferredGenres) as string[],
            }
          : null,
        libraryEntries: user.libraryEntries.map(serializeEntry),
        collections: user.collections.map((col) => ({
          ...col,
          createdAt: col.createdAt.toISOString(),
          items: col.items.map((item) => ({
            ...item,
            addedAt: item.addedAt.toISOString(),
            libraryEntry: serializeEntry(item.libraryEntry),
          })),
        })),
      };
    },
  },
};
