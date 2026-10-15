import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../api/students.api";
import type {
  CreateStudentPayload,
  StudentListParams,
  UpdateStudentPayload,
} from "../types/students.types";

export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (params?: StudentListParams) =>
    [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

export const useStudents = (params?: StudentListParams) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentsApi.getStudents(params),
  });
};

export const useStudent = (id?: string) => {
  return useQuery({
    queryKey: studentKeys.detail(id ?? ""),
    queryFn: () => studentsApi.getStudentById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentPayload) =>
      studentsApi.createStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStudentPayload;
    }) => studentsApi.updateStudent(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
};
