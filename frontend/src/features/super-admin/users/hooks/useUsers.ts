"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserPassword,
  createUser,
} from "../api/user.api";

import {
  UsersQuery,
  UpdateUserFormInput,
  ResetPasswordInput,
} from "../types/user.types";

import { queryKeys } from "@/lib/react-query/queryKeys";

export const usersQueryKey = ["admin", "users"];

export const userQueryKey = (id: string) => ["admin", "user", id];

export const useUsers = (params: UsersQuery) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...usersQueryKey, params],
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });

  // PREFETCH  PAGE;

  useEffect(() => {
    const pagination = query.data?.data?.pagination;
    // Next page nahi hai
    if (!pagination?.hasNext) {
      return;
    }
    const nextPage = pagination.page + 1;
    queryClient.prefetchQuery({
      queryKey: [...usersQueryKey, { ...params, page: nextPage }],
      queryFn: () => getUsers({ ...params, page: nextPage }),
      staleTime: 30_000,
    });

    if (!pagination?.hasPrevious) {
      return;
    }

    const prevPage = pagination.page - 1;
    queryClient.prefetchQuery({
      queryKey: [...usersQueryKey, { ...params, page: prevPage }],
      queryFn: () => getUsers({ ...params, page: prevPage }),
      staleTime: 30_000,
    });
  }, [query.data, params, queryClient]);

  return query;
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userQueryKey(id),

    queryFn: () => getUserById(id),

    enabled: Boolean(id),

    staleTime: 30_000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.all,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.stats,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.recent,
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserFormInput }) =>
      updateUser(id, data),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: userQueryKey(variables.id),
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.all,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.stats,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.recent,
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.all,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.stats,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.recent,
      });
    },
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordInput }) =>
      resetUserPassword(id, data),

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.all,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.stats,
      });

      await queryClient.refetchQueries({
        queryKey: queryKeys.auditLogs.recent,
      });
    },
  });
};
