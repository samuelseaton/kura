import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PrismaClient } from '@prisma/client';

export interface Context {
  prisma: PrismaClient;
  req: NextRequest;
  userId: string | null;
}

// auth.getSession() from @neondatabase/auth relies on next/headers which loses
// its async context inside Apollo Server's execution. Read cookies from the
// incoming NextRequest directly and call the Neon Auth session endpoint instead.
export async function createContext(req: NextRequest): Promise<Context> {
  let userId: string | null = null;

  try {
    const baseUrl = process.env.NEON_AUTH_BASE_URL!;
    const origin =
      req.headers.get('origin') ??
      req.headers.get('referer')?.split('/').slice(0, 3).join('/') ??
      new URL(req.url).origin;

    const sessionRes = await fetch(`${baseUrl}/get-session`, {
      headers: {
        cookie: req.headers.get('cookie') ?? '',
        origin,
      },
    });

    if (sessionRes.ok) {
      const body = (await sessionRes.json()) as {
        user?: { id: string; email?: string; name?: string } | null;
      };

      if (body?.user?.id) {
        const { id, email, name } = body.user;
        await prisma.user.upsert({
          where: { id },
          create: { id, email: email ?? '', name: name ?? null },
          update: { name: name ?? null },
        });
        userId = id;
      }
    }
  } catch {
    // Not authenticated — userId stays null
  }

  return { prisma, req, userId };
}
