'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, useAuthenticate } from '@neondatabase/auth-ui';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function UserAvatar() {
  const { user } = useAuthenticate({ enabled: false });
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? '?');

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
      {initials}
    </span>
  );
}

export function NavbarAuth() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    window.location.href = '/';
  };

  return (
    <div className="hidden md:flex items-center gap-3">
      <SignedOut>
        <Link href="/auth/sign-in" className={buttonVariants({ size: 'sm' })}>
          Sign In
        </Link>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full hover:opacity-80 transition-opacity cursor-pointer">
            <UserAvatar />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="ring-white/20 bg-zinc-900">
            <DropdownMenuItem onClick={() => router.push('/settings')} className="focus:bg-white/10 cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleSignOut} className="focus:bg-destructive/20 cursor-pointer">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </div>
  );
}
