"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreatePlanDto, SubscriptionPlan, UpdatePlanDto } from "../types/plan.types";

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planToEdit?: SubscriptionPlan | null;
  onSubmit: (data: CreatePlanDto | UpdatePlanDto) => Promise<any>;
  isLoading?: boolean;
}

const defaultValues: CreatePlanDto = {
  name: "",
  code: "",
  description: "",
  price: 9999,
  currency: "INR",
  durationInDays: 365,
  maxStudents: 500,
  maxTeachers: 30,
  maxAdmins: 3,
};

export default function PlanFormDialog({
  open,
  onOpenChange,
  planToEdit,
  onSubmit,
  isLoading,
}: PlanFormDialogProps) {
  const [formData, setFormData] = useState<CreatePlanDto>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        name: planToEdit.name,
        code: planToEdit.code,
        description: planToEdit.description || "",
        price: Number(planToEdit.price),
        currency: planToEdit.currency || "INR",
        durationInDays: planToEdit.durationInDays,
        maxStudents: planToEdit.maxStudents,
        maxTeachers: planToEdit.maxTeachers,
        maxAdmins: planToEdit.maxAdmins,
      });
    } else {
      setFormData(defaultValues);
    }
    setErrors({});
  }, [planToEdit, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Plan name is required";
    if (!formData.code.trim()) newErrors.code = "Plan code is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (formData.durationInDays <= 0)
      newErrors.durationInDays = "Duration must be at least 1 day";
    if (formData.maxStudents <= 0)
      newErrors.maxStudents = "Must allow at least 1 student";
    if (formData.maxTeachers <= 0)
      newErrors.maxTeachers = "Must allow at least 1 teacher";
    if (formData.maxAdmins <= 0)
      newErrors.maxAdmins = "Must allow at least 1 admin";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch {
      // Handled by mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {planToEdit ? "Edit Subscription Plan" : "Create New Plan"}
          </DialogTitle>
          <DialogDescription>
            {planToEdit
              ? "Update tier pricing, limits, and configuration details."
              : "Define a new subscription package for schools on your platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Plan Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Standard Annual"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Plan Code (Unique) <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase().replace(/\s+/g, "_"),
                  })
                }
                placeholder="e.g. STANDARD_ANNUAL"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm uppercase outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.code && (
                <p className="text-[11px] text-destructive">{errors.code}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              placeholder="Brief description of who this plan is suitable for..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Price <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.price && (
                <p className="text-[11px] text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Duration (Days) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.durationInDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationInDays: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.durationInDays && (
                <p className="text-[11px] text-destructive">
                  {errors.durationInDays}
                </p>
              )}
            </div>
          </div>

          {/* User Limits */}
          <div className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Capacity & User Allocations
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Max Students
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStudents: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Max Teachers
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxTeachers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTeachers: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Max Admins
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxAdmins}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxAdmins: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : planToEdit
                ? "Update Plan"
                : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
