"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createClass,
  createSection,
  deleteClass,
  deleteSection,
  getClassById,
  getClasses,
  getSections,
  updateClass,
  updateSection,
} from "../api/classes.api";

import type {
  ClassListParams,
  CreateClassPayload,
  CreateSectionPayload,
  UpdateClassPayload,
  UpdateSectionPayload,
} from "../types/classes.types";

export const classKeys = {
  all: ["classes"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (params?: ClassListParams) =>
    [...classKeys.lists(), params] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...classKeys.details(), id] as const,
  sections: (classId: string) =>
    [...classKeys.all, "sections", classId] as const,
};

export function useClasses(
  params?: ClassListParams,
) {
  return useQuery({
    queryKey: classKeys.list(params),
    queryFn: () => getClasses(params),
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => getClassById(id),
    enabled: Boolean(id),
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) =>
      createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classKeys.lists(),
      });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClassPayload;
    }) => updateClass(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classKeys.lists(),
      });
    },
  });
}

export function useSections(classId: string) {
  return useQuery({
    queryKey: classKeys.sections(classId),
    queryFn: () => getSections(classId),
    enabled: Boolean(classId),
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      payload,
    }: {
      classId: string;
      payload: CreateSectionPayload;
    }) => createSection(classId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.sections(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.lists(),
      });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      sectionId,
      payload,
    }: {
      classId: string;
      sectionId: string;
      payload: UpdateSectionPayload;
    }) =>
      updateSection(
        classId,
        sectionId,
        payload,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.sections(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.lists(),
      });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      sectionId,
    }: {
      classId: string;
      sectionId: string;
    }) => deleteSection(classId, sectionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classKeys.sections(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classKeys.lists(),
      });
    },
  });
}

