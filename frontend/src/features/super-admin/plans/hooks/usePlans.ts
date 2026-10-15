"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPlan,
  deletePlan,
  getPlans,
  togglePlanStatus,
  updatePlan,
} from "../api/plan.api";
import { CreatePlanDto, UpdatePlanDto } from "../types/plan.types";

export const PLANS_QUERY_KEY = ["super-admin", "plans"];

export function usePlans(page = 1, limit = 12, search = "") {
  return useQuery({
    queryKey: [...PLANS_QUERY_KEY, { page, limit, search }],
    queryFn: () => getPlans(page, limit, search),
  });
}

export function usePlanMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreatePlanDto) => createPlan(data),
    onSuccess: () => {
      toast.success("Subscription plan created successfully");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create plan");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanDto }) =>
      updatePlan(id, data),
    onSuccess: () => {
      toast.success("Subscription plan updated successfully");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update plan");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      togglePlanStatus(id, isActive),
    onSuccess: (data) => {
      toast.success(
        `Plan ${data.isActive ? "activated" : "deactivated"} successfully`,
      );
      invalidate();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update plan status",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => {
      toast.success("Subscription plan deleted successfully");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete plan");
    },
  });

  return {
    createPlan: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePlan: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleStatus: statusMutation.mutateAsync,
    isTogglingStatus: statusMutation.isPending,
    deletePlan: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
