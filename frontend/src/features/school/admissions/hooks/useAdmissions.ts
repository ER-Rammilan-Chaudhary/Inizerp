import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admissionsApi } from "../api/admissions.api";

import type {
  AdmissionsFilterParams,
  AdmissionStatus,
  CreateAdmissionPayload,
  UpdateAdmissionPayload,
} from "../types/admissions.types";

export const admissionKeys = {
  all: ["admissions"] as const,
  lists: () => [...admissionKeys.all, "list"] as const,
  list: (params?: AdmissionsFilterParams) =>
    [...admissionKeys.lists(), params ?? {}] as const,
  details: () => [...admissionKeys.all, "detail"] as const,
  detail: (id: string) => [...admissionKeys.details(), id] as const,
};

export const useAdmissions = (params?: AdmissionsFilterParams) => {
  return useQuery({
    queryKey: admissionKeys.list(params),
    queryFn: () => admissionsApi.getAdmissions(params),
  });
};

export const useAdmission = (id?: string) => {
  return useQuery({
    queryKey: admissionKeys.detail(id ?? ""),
    queryFn: () => admissionsApi.getAdmissionById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateAdmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdmissionPayload) =>
      admissionsApi.createAdmission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: admissionKeys.lists(),
      });
    },
  });
};

export const useUpdateAdmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdmissionPayload;
    }) => admissionsApi.updateAdmission(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: admissionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: admissionKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteAdmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => admissionsApi.deleteAdmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: admissionKeys.lists(),
      });
    },
  });
};

export const useUpdateAdmissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: AdmissionStatus;
      remarks?: string;
    }) =>
      admissionsApi.updateAdmission(id, {
        status,
        ...(remarks !== undefined && { remarks }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: admissionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: admissionKeys.detail(variables.id),
      });
    },
  });
};
