import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/nav/Navbar';
import { ApolloProvider } from '@/components/providers/ApolloProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kura — Your Personal Anime Library',
  description:
    "Browse thousands of anime, track what you've watched, and build your personal collection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <AuthProvider>
          <ApolloProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
