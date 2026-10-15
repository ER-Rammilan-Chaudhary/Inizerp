import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { timetablesApi } from "../api/timetables.api";

import type {
  CreateTimetablePayload,
  TimetableListParams,
  UpdateTimetablePayload,
} from "../types/timetables.types";

export const timetableKeys = {
  all: ["timetables"] as const,
  lists: () => [...timetableKeys.all, "list"] as const,
  list: (params?: TimetableListParams) =>
    [...timetableKeys.lists(), params ?? {}] as const,
  details: () => [...timetableKeys.all, "detail"] as const,
  detail: (id: string) => [...timetableKeys.details(), id] as const,
};

export const useTimetables = (params?: TimetableListParams) => {
  return useQuery({
    queryKey: timetableKeys.list(params),
    queryFn: () => timetablesApi.list(params),
    placeholderData: keepPreviousData,
  });
};

export const useTimetable = (id?: string) => {
  return useQuery({
    queryKey: timetableKeys.detail(id ?? ""),
    queryFn: () => timetablesApi.getById(id as string),
    enabled: Boolean(id),
  });
};

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTimetablePayload) =>
      timetablesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.lists(),
      });
    },
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTimetablePayload;
    }) => timetablesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: timetableKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timetablesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.lists(),
      });
    },
  });
};

export const useUpsertTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTimetablePayload) =>
      timetablesApi.upsert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.lists(),
      });
    },
  });
};

export const periodKeys = {
  all: ["periods"] as const,
  list: () => [...periodKeys.all, "list"] as const,
};

export const usePeriods = () => {
  return useQuery({
    queryKey: periodKeys.list(),
    queryFn: () => timetablesApi.getPeriods(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSavePeriods = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { periods: any[] }) =>
      timetablesApi.savePeriods(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodKeys.all,
      });
    },
  });
};

export const useAddPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) =>
      timetablesApi.addPeriod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodKeys.all,
      });
    },
  });
};

export const useDeletePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (periodId: string) =>
      timetablesApi.deletePeriod(periodId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodKeys.all,
      });
    },
  });
};

