'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@neondatabase/auth-ui';
import { buttonVariants } from '@/components/ui/button';

export function NavbarAuth() {
  return (
    <div className="hidden md:flex items-center gap-3">
      <SignedOut>
        <Link href="/auth/sign-in" className={buttonVariants({ size: 'sm' })}>
          Sign In
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
