"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { MEDIA_LIST_QUERY } from "../queries/animeList.gql";

export type MediaSort = "SCORE_DESC" | "POPULARITY_DESC" | "TRENDING_DESC" | "START_DATE_DESC";

export interface MediaFilter {
  search: string;
  genres: string[];
  sort: MediaSort;
}

interface AnimeItem {
  id: string;
  title: string;
  posterUrl: string;
  rating: number | null;
  episodeCount: number | null;
  status: string | null;
  genres: string[];
  studio: { id: string; name: string } | null;
}

interface MediaListData {
  mediaList: {
    items: AnimeItem[];
    total: number;
    hasNextPage: boolean;
  };
}

const DEFAULT_FILTER: MediaFilter = {
  search: "",
  genres: [],
  sort: "SCORE_DESC",
};

export function useAnimeFilter() {
  const [filter, setFilter] = useState<MediaFilter>(DEFAULT_FILTER);
  const [page, setPage] = useState(1);
  const [accItems, setAccItems] = useState<AnimeItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const { data, loading, fetchMore } = useQuery<MediaListData>(MEDIA_LIST_QUERY, {
    variables: {
      filter: {
        search: filter.search || undefined,
        genres: filter.genres.length ? filter.genres : undefined,
        sort: filter.sort,
        page: 1,
        perPage: 24,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.mediaList?.items) {
      setAccItems(data.mediaList.items);
      setPage(1);
    }
  }, [data]);

  const updateFilter = useCallback((patch: Partial<MediaFilter>) => {
    startTransition(() => {
      setFilter((prev) => ({ ...prev, ...patch }));
    });
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const result = await fetchMore({
      variables: {
        filter: {
          search: filter.search || undefined,
          genres: filter.genres.length ? filter.genres : undefined,
          sort: filter.sort,
          page: nextPage,
          perPage: 24,
        },
      },
    });
    const newItems = (result.data as MediaListData)?.mediaList?.items ?? [];
    setAccItems((prev) => [...prev, ...newItems]);
    setPage(nextPage);
  }, [page, filter, fetchMore]);

  const resetFilter = useCallback(() => {
    startTransition(() => {
      setFilter(DEFAULT_FILTER);
    });
  }, []);

  return {
    filter,
    updateFilter,
    resetFilter,
    loadMore,
    items: accItems,
    total: data?.mediaList?.total ?? 0,
    hasNextPage: data?.mediaList?.hasNextPage ?? false,
    loading: loading || isPending,
  };
}
