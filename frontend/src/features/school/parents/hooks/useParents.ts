import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createParent,
  deleteParent,
  getParentById,
  getParents,
  updateParent,
} from "../api/parents.api";
import type {
  CreateParentPayload,
  UpdateParentPayload,
} from "../types/parents.types";

export const PARENTS_QUERY_KEY = ["parents"];

export function useParents() {
  return useQuery({
    queryKey: PARENTS_QUERY_KEY,
    queryFn: () => getParents(),
  });
}

export function useParent(id: string) {
  return useQuery({
    queryKey: [...PARENTS_QUERY_KEY, id],
    queryFn: () => getParentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateParentPayload) => createParent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateParentPayload;
    }) => updateParent(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PARENTS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useDeleteParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteParent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
