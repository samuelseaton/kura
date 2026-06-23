import Link from 'next/link';
import { MobileNav } from './MobileNav';
import { NavbarAuth } from './NavbarAuth';
import { KuraWordmark } from '@/components/KuraWordmark';

const links = [
  { href: '/explore', label: 'Explore' },
  { href: '/studios', label: 'Studios' },
  { href: '/vault', label: 'Vault' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <KuraWordmark fontSize={24} />
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <NavbarAuth />
          <MobileNav links={links} />
        </div>
      </nav>
    </header>
  );
}
