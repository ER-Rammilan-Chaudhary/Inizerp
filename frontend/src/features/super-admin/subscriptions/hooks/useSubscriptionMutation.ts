"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  renewSubscription,
  updateSubscriptionStatus,
} from "../api/subscription.api";

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["subscription-stats"],
      });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      updateSubscription(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["subscription-stats"],
      });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscription,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["subscription-stats"],
      });
    },
  });
}

export function useRenewSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, endDate }: { id: string; endDate: string }) =>
      renewSubscription(id, endDate),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["subscription-stats"],
      });
    },
  });
}

export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateSubscriptionStatus(id, status),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["subscription-stats"],
      });
    },
  });
}
