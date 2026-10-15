import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEnrollmentApi,
  deleteEnrollmentApi,
  getEnrollmentByIdApi,
  getEnrollmentsApi,
  promoteStudentsApi,
  updateEnrollmentApi,
} from "../api/enrollments.api";
import type {
  CreateEnrollmentPayload,
  EnrollmentListParams,
  PromoteStudentsPayload,
  UpdateEnrollmentPayload,
} from "../types/enrollments.types";

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  lists: () => [...enrollmentKeys.all, "list"] as const,
  list: (params?: EnrollmentListParams) =>
    [...enrollmentKeys.lists(), params] as const,
  details: () => [...enrollmentKeys.all, "detail"] as const,
  detail: (id: string) => [...enrollmentKeys.details(), id] as const,
};

export const useEnrollments = (params?: EnrollmentListParams) => {
  return useQuery({
    queryKey: enrollmentKeys.list(params),
    queryFn: () => getEnrollmentsApi(params),
  });
};

export const useEnrollment = (id?: string) => {
  return useQuery({
    queryKey: enrollmentKeys.detail(id ?? ""),
    queryFn: () => getEnrollmentByIdApi(id!),
    enabled: Boolean(id),
  });
};

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEnrollmentPayload) =>
      createEnrollmentApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.all,
      });
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEnrollmentPayload;
    }) => updateEnrollmentApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEnrollmentApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.all,
      });
    },
  });
};

export const usePromoteStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromoteStudentsPayload) =>
      promoteStudentsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.all,
      });
    },
  });
};
