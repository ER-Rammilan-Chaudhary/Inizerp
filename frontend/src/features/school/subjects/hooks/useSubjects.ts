import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { subjectsApi } from "../api/subjects.api";

export const subjectKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectKeys.all, "list"] as const,
  list: (params?: object) => [...subjectKeys.lists(), params ?? {}] as const,
  details: () => [...subjectKeys.all, "detail"] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
};

export const useSubjects = (
  params?: Parameters<typeof subjectsApi.getSubjects>[0],
) => {
  return useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: () => subjectsApi.getSubjects(params),
    placeholderData: keepPreviousData,
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectsApi.getSubjectById(id),
    enabled: Boolean(id),
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectsApi.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subjectKeys.lists(),
      });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof subjectsApi.updateSubject>[1];
    }) => subjectsApi.updateSubject(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subjectKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: subjectKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectsApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subjectKeys.lists(),
      });
    },
  });
};
