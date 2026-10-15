"use client";

import { useState } from "react";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Power,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionPlan } from "../types/plan.types";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  isToggling?: boolean;
}

export default function PlanCard({
  plan,
  onEdit,
  onToggleStatus,
  onDelete,
  isToggling,
}: PlanCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Card
      className={`relative flex flex-col transition-all duration-200 border ${
        plan.isActive
          ? "border-border/80 hover:border-primary/50 hover:shadow-md"
          : "border-border/40 opacity-75 bg-muted/20"
      }`}
    >
      {/* Top Banner Accent */}
      <div
        className={`h-1.5 w-full rounded-t-lg ${
          plan.isActive
            ? "bg-gradient-to-r from-primary to-indigo-500"
            : "bg-muted"
        }`}
      />

      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-foreground tracking-tight">
                {plan.name}
              </h3>
              <Badge variant="outline" className=" text-xs uppercase px-2">
                {plan.code}
              </Badge>
            </div>
            {plan.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {plan.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer outline-none">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(plan)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4 text-muted-foreground" />
                Edit Plan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(plan.id, !plan.isActive)}
                disabled={isToggling}
                className="cursor-pointer"
              >
                <Power className="mr-2 h-4 w-4 text-muted-foreground" />
                {plan.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setConfirmDelete(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Pricing */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-muted-foreground">
              {plan.currency === "INR" ? "₹" : plan.currency}
            </span>
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {Number(plan.price).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              / {plan.durationInDays} days
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-5 pt-2 space-y-4">
        {/* Tier Limits */}
        <div className="space-y-2.5 rounded-lg bg-muted/40 p-3.5 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              Max Students
            </span>
            <span className="font-semibold text-foreground">
              {plan.maxStudents.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="h-3.5 w-3.5 text-primary" />
              Max Teachers
            </span>
            <span className="font-semibold text-foreground">
              {plan.maxTeachers.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Max Admins
            </span>
            <span className="font-semibold text-foreground">
              {plan.maxAdmins.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/60 mt-auto">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{plan.durationInDays} Days Duration</span>
        </div>

        <Badge
          variant={plan.isActive ? "default" : "secondary"}
          className={`text-[10px] font-semibold px-2 py-0.5 ${
            plan.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {plan.isActive ? "Active" : "Archived"}
        </Badge>
      </CardFooter>

      {/* Delete Confirmation Overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-background/95 p-6 text-center backdrop-blur-xs">
          <Trash2 className="h-8 w-8 text-destructive mb-2" />
          <h4 className="font-bold text-sm text-foreground">Delete this Plan?</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Schools currently subscribed might be affected.
          </p>
          <div className="flex gap-2 w-full max-w-xs">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => {
                onDelete(plan.id);
                setConfirmDelete(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
