'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { useAuthenticate } from '@neondatabase/auth-ui';
import { ME_QUERY, UPDATE_SETTINGS } from '@/modules/vault/queries/vault.gql';
import { GENRES_QUERY } from '@/modules/explore/queries/animeList.gql';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, Settings } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'SCORE_DESC', label: 'Top Rated' },
  { value: 'POPULARITY_DESC', label: 'Most Popular' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'START_DATE_DESC', label: 'Newest' },
];

export default function SettingsPage() {
  const { user, isPending } = useAuthenticate();

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY, {
    skip: !user,
  });

  const { data: genresData } = useQuery(GENRES_QUERY);

  const [updateSettings, { loading: saving }] = useMutation(UPDATE_SETTINGS, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const [name, setName] = useState('');
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [defaultSort, setDefaultSort] = useState('SCORE_DESC');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (meData?.me) {
      setName(meData.me.name ?? '');
      setPreferredGenres(meData.me.settings?.preferredGenres ?? []);
      setDefaultSort(meData.me.settings?.defaultSort ?? 'SCORE_DESC');
    }
  }, [meData]);

  const toggleGenre = (genre: string) => {
    setPreferredGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    await updateSettings({ variables: { name, preferredGenres, defaultSort } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isPending || meLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-8 w-24" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Settings className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Sign in to manage your settings
          </p>
        </div>
        <Link href="/auth/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>

      <div className="space-y-8">
        <section className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="mb-4 font-semibold">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-muted-foreground">
                Display name
              </label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted-foreground">
                Email
              </label>
              <Input value={user.email} disabled className="opacity-60" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="mb-4 font-semibold">Preferences</h2>

          <div className="mb-6">
            <label className="mb-2 block text-sm text-muted-foreground">
              Default sort
            </label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setDefaultSort(value)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    defaultSort === value
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Preferred genres
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(genresData?.genres ?? []).map(genre => {
                const active = preferredGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                      active
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    )}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(buttonVariants({ size: 'sm' }), 'min-w-24 gap-2')}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : saving ? (
              'Saving...'
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
