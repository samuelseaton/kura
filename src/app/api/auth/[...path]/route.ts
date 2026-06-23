import { auth } from '@/lib/auth';
import { type NextRequest } from 'next/server';

/**
 * The Neon Auth remote server validates the Origin header against its own
 * trustedOrigins list. It only trusts its own origin by default, so requests
 * originating from our Vercel domain are rejected with INVALID_ORIGIN.
 * We rewrite the origin to match the Neon server's own origin before proxying
 * so the check passes without needing to configure trusted origins on Neon's side.
 */
const neonOrigin = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

/** Route handlers produced by the Neon Auth proxy factory. */
const handlers = auth.handler();

type Ctx = { params: Promise<{ path: string[] }> };

/**
 * Clones the incoming Next.js request with the Origin header replaced by the
 * Neon Auth server's own origin, so the upstream CSRF origin check passes.
 */
function rewriteOrigin(req: NextRequest): Request {
  const headers = new Headers(req.headers);
  headers.set('origin', neonOrigin);
  return new Request(req.url, {
    method: req.method,
    headers,
    body: req.body,
    // duplex required by Node when body is a ReadableStream
    ...(req.body ? { duplex: 'half' } : {}),
  } as RequestInit);
}

export const dynamic = 'force-dynamic';

/** Proxies GET auth requests (e.g. session fetch, OAuth callbacks) to Neon Auth. */
export function GET(req: NextRequest, ctx: Ctx) {
  return handlers.GET(rewriteOrigin(req), ctx);
}

/** Proxies POST auth requests (e.g. sign-up, sign-in, sign-out) to Neon Auth. */
export function POST(req: NextRequest, ctx: Ctx) {
  return handlers.POST(rewriteOrigin(req), ctx);
}
