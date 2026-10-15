import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGuardian, getGuardians } from "../api/guardians.api";
import type { CreateGuardianPayload } from "../types/guardians.types";

export const GUARDIANS_QUERY_KEY = ["guardians"];

export function useGuardians() {
  return useQuery({
    queryKey: GUARDIANS_QUERY_KEY,
    queryFn: () => getGuardians(),
  });
}

export function useCreateGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGuardianPayload) => createGuardian(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUARDIANS_QUERY_KEY });
    },
  });
}
