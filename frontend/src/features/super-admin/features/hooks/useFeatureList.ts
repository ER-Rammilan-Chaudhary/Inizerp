import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { getFeatures } from "../api/feature.api";
import type { FeatureQuery } from "../types/feature.types";

export const featureKeys = {
  all: ["features"] as const,
  list: (params: FeatureQuery = {}) =>
    [
      "features",
      "list",
      params.page ?? 1,
      params.limit ?? 10,
      params.search ?? "",
    ] as const,
};

export const useFeatureList = (
  params: FeatureQuery = {},
) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search ?? "";

  return useQuery({
    queryKey: featureKeys.list({
      page,
      limit,
      search,
    }),
    queryFn: () =>
      getFeatures({
        page,
        limit,
        search,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

