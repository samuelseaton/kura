'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAuthenticate } from '@neondatabase/auth-ui';
import { BookMarked, Check, ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  ME_QUERY,
  UPSERT_LIBRARY_ENTRY,
  REMOVE_LIBRARY_ENTRY,
} from '../queries/vault.gql';

const STATUS_LABELS: Record<string, string> = {
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  PLAN_TO_WATCH: 'Plan to Watch',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
};

const STATUS_ORDER = [
  'WATCHING',
  'COMPLETED',
  'PLAN_TO_WATCH',
  'ON_HOLD',
  'DROPPED',
];

interface LibraryButtonProps {
  anilistId: number;
}

export function LibraryButton({ anilistId }: LibraryButtonProps) {
  const [open, setOpen] = useState(false);

  const { user } = useAuthenticate({ enabled: false });

  const { data: meData } = useQuery(ME_QUERY, { skip: !user });

  const [upsert] = useMutation(UPSERT_LIBRARY_ENTRY, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const [remove] = useMutation(REMOVE_LIBRARY_ENTRY, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  if (!user) {
    return (
      <a
        href="/auth/sign-in"
        className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
      >
        <BookMarked className="h-4 w-4" />
        Sign in to save
      </a>
    );
  }

  const entry = meData?.me?.libraryEntries.find(e => e.anilistId === anilistId);

  const handleSelect = (status: string) => {
    upsert({ variables: { anilistId, status } });
    setOpen(false);
  };

  const handleRemove = () => {
    remove({ variables: { anilistId } });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          buttonVariants({ variant: entry ? 'default' : 'outline' }),
          'gap-2'
        )}
      >
        {entry ? (
          <>
            <Check className="h-4 w-4" />
            {STATUS_LABELS[entry.status]}
          </>
        ) : (
          <>
            <BookMarked className="h-4 w-4" />
            Add to Library
          </>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-xl border border-border bg-card shadow-lg shadow-black/20">
            {STATUS_ORDER.map(status => (
              <button
                key={status}
                onClick={() => handleSelect(status)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-white/8 active:bg-white/12',
                  entry?.status === status && 'text-primary font-medium'
                )}
              >
                {entry?.status === status && <Check className="h-3.5 w-3.5" />}
                {STATUS_LABELS[status]}
              </button>
            ))}
            {entry && (
              <>
                <div className="mx-3 border-t border-border" />
                <button
                  onClick={handleRemove}
                  className="flex w-full items-center gap-2 rounded-b-xl px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
