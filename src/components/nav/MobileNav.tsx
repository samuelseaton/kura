'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { SignedIn, SignedOut, useAuthenticate } from '@neondatabase/auth-ui';
import { Sheet, SheetContent, SheetClose, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

function MobileAuthFooter() {
  const { user } = useAuthenticate({ enabled: false });

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    window.location.href = '/';
  };

  return (
    <SheetFooter className="border-t border-border/50 pt-4">
      <SignedOut>
        <SheetClose
          render={
            <Link
              href="/auth/sign-in"
              className={cn(buttonVariants({ size: 'sm' }), 'w-full justify-center')}
            />
          }
        >
          Sign In
        </SheetClose>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col gap-1">
          <p className="px-2 text-xs text-muted-foreground truncate">{user?.email}</p>
          <SheetClose
            render={
              <Link href="/settings" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'justify-start active:translate-y-0 active:bg-white/15 active:opacity-100')} />
            }
          >
            Settings
          </SheetClose>
          <button
            onClick={handleSignOut}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'justify-start text-destructive hover:bg-white/10 active:translate-y-0 active:bg-white/15 active:opacity-100')}
          >
            Sign out
          </button>
        </div>
      </SignedIn>
    </SheetFooter>
  );
}

export function MobileNav({ links }: { links: NavLink[] }) {
  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          'md:hidden',
          buttonVariants({ variant: 'ghost', size: 'icon' })
        )}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 flex flex-col">
        <nav className="mt-14 flex flex-col gap-1 px-4">
          {links.map(({ href, label }) => (
            <SheetClose
              key={href}
              render={
                <Link
                  href={href}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'justify-start text-base font-medium active:translate-y-0 active:bg-white/15 active:opacity-100'
                  )}
                />
              }
            >
              {label}
            </SheetClose>
          ))}
        </nav>
        <MobileAuthFooter />
      </SheetContent>
    </Sheet>
  );
}
