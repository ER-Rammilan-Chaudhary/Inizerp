import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import {
  createAcademicYear,
  deleteAcademicYear,
  getAcademicYears,
  setCurrentAcademicYear,
  updateAcademicYear,
} from "../api/academic-years.api";

import type {
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
} from "../types/academic-years.types";

export const academicYearKeys = {
  all: ["academic-years"] as const,
  list: () => [...academicYearKeys.all, "list"] as const,
};

export const useAcademicYears = () => {
  return useQuery({
    queryKey: queryKeys.academicYearKeys.list(),
    queryFn: getAcademicYears,
    staleTime: 60 * 1000,
  });
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAcademicYearPayload) =>
      createAcademicYear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.all,
      });
    },
  });
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAcademicYearPayload;
    }) => updateAcademicYear(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.all,
      });
    },
  });
};

export const useSetCurrentAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setCurrentAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.all,
      });
    },
  });
};

export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.all,
      });
    },
  });
};
