import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  req: NextRequest;
  userId: string | null;
}

export async function createContext(req: NextRequest): Promise<Context> {
  let userId: string | null = null;

  try {
    const { data: session } = await auth.getSession();

    if (session?.user) {
      const { id, email, name } = session.user;

      await prisma.user.upsert({
        where: { id },
        create: { id, email: email ?? "", name: name ?? null },
        update: { name: name ?? null },
      });

      userId = id;
    }
  } catch {
    // Not authenticated — userId stays null
  }

  return { prisma, req, userId };
}
