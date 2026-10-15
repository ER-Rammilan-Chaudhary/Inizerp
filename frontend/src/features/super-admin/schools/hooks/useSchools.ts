"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSchools } from "../api/school.api";
import { useEffect } from "react";

interface UseSchoolsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useSchools({
  page = 1,
  limit = 10,
  search = "",
}: UseSchoolsParams = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["schools", page, limit, search],
    queryFn: () => getSchools(page, limit, search),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!query.data?.pagination.hasNext) {
      return;
    }

    queryClient.prefetchQuery({
      queryKey: ["schools", page + 1, limit, search],
      queryFn: () => getSchools(page + 1, limit, search),
    });

    if (!query.data?.pagination.hasPrevious) {
      return;
    }

    queryClient.prefetchQuery({
      queryKey: ["schools", page - 1, limit, search],

      queryFn: () => getSchools(page - 1, limit, search),
    });
  }, [
    page,
    limit,
    search,
    query.data?.pagination.hasNext,
    query.data?.pagination.hasPrevious,
    queryClient,
  ]);

  return query;
}
