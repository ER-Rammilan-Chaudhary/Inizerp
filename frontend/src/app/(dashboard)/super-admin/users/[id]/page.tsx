"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Edit2,
  KeyRound,
  Mail,
  Phone,
  School,
  Shield,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import { useUser, useDeleteUser, useResetUserPassword } from "@/features/super-admin/users/hooks/useUsers";
import ResetPasswordDialog from "@/features/super-admin/users/components/ResetPasswordDialog";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const { data, isLoading, isError, error } = useUser(id);
  const deleteMutation = useDeleteUser();
  const resetMutation = useResetUserPassword();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const user = data?.data;

  if (isLoading) {
    return <Loader text="Loading user details..." />;
  }

  if (isError || !user) {
    return (
      <ErrorPage
        title="User not found"
        message={error instanceof Error ? error.message : "Unable to retrieve user record."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success("User deleted successfully");
      router.push("/super-admin/users");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleResetPassword = async (password: string) => {
    try {
      await resetMutation.mutateAsync({
        id: user.id,
        data: { password },
      });
      toast.success("Password reset successfully");
      setResetDialogOpen(false);
    } catch {
      toast.error("Failed to reset password");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "TRIAL":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "SUSPENDED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Details
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage platform account credentials and assigned school context.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            className="gap-2"
          >
            <KeyRound className="h-4 w-4" />
            Reset Password
          </Button>

          <Button
            size="sm"
            onClick={() => router.push(`/super-admin/users/${user.id}/edit`)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit User
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* User Hero Summary Card */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                user.fullName?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {user.fullName}
                </h2>
                <Badge variant="outline" className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
                <Badge className="bg-primary text-primary-foreground text-xs uppercase">
                  {user.role}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {user.phone}
                  </span>
                )}
                {user.school && (
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <School className="h-3.5 w-3.5 text-primary" />
                    {user.school.name} ({user.school.code})
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Details */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Identity & Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-medium text-foreground">{user.id}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">System Role</span>
              <span className="font-semibold text-foreground">{user.role}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Account Status</span>
              <span className="font-medium text-foreground">{user.status}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Assigned School</span>
              <span className="font-medium text-foreground">
                {user.school?.name ?? "Global Scope"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security & Activity Timestamps */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Activity & Timestamps</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Last Login</span>
              <span className="font-medium text-foreground">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : "Never logged in"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-medium text-foreground">
                {new Date(user.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium text-foreground">
                {new Date(user.updatedAt).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        user={user}
        loading={resetMutation.isPending}
        onConfirm={handleResetPassword}
      />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md border-destructive/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Confirm User Deletion
              </CardTitle>
              <CardDescription>
                Are you sure you want to delete <strong>{user.fullName}</strong>? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete User"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
