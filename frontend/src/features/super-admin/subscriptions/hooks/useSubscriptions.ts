"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getSubscriptions } from "../api/subscription.api";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { queryKeys } from "@/lib/react-query/queryKeys";

export function useSubscriptions(page: number = 1, limit: number = 2) {
  const { search } = useGlobalSearch();
  const queryClient = useQueryClient();


  const query = useQuery({
    queryKey: queryKeys.subscriptions.list(page, limit, search),
    queryFn: () => getSubscriptions(page, limit, search),
    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const pagination = query.data?.pagination;

    if (!pagination) {
      return;
    }

    const prefetchPages = async () => {
      if (pagination.hasNext) {
        const nextPage = page + 1;
        console.log("Prefetching page:", nextPage);
        await queryClient.prefetchQuery({
          queryKey: queryKeys.subscriptions.list(nextPage, limit, search),
          queryFn: () => getSubscriptions(nextPage, limit, search),
          staleTime: 1000 * 60 * 5,
        });

        const cachedData = queryClient.getQueryData(
          queryKeys.subscriptions.list(nextPage, limit, search),
        );

        console.log("NEXT PAGE CACHE:", cachedData);
      }

      if (pagination.hasPrevious) {
        const previousPage = page - 1;

        console.log("Prefetching page:", previousPage);

        await queryClient.prefetchQuery({
          queryKey: queryKeys.subscriptions.list(previousPage, limit, search),

          queryFn: () => getSubscriptions(previousPage, limit, search),

          staleTime: 1000 * 60 * 5,
        });
      }
    };

    prefetchPages();
  }, [page, limit, search, query.data?.pagination, queryClient]);

  return query;
}
