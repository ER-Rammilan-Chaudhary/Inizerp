"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Database,
  HardDrive,
  Power,
  Save,
  Server,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/Loader";
import SettingsNav from "@/features/super-admin/settings/components/SettingsNav";
import { useSettings } from "@/features/super-admin/settings/hooks/useSettings";
import { useUpdateSettings } from "@/features/super-admin/settings/hooks/useUpdateSettings";

export default function SystemSettingsPage() {
  const router = useRouter();
  const { data: settingsList, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState({
    maintenance_mode: "false",
    maintenance_message: "InizERP is currently performing scheduled system upgrades. Please check back shortly.",
    max_upload_size_mb: "5",
    default_page_size: "20",
    audit_log_retention_days: "90",
    error_tracking_enabled: "true",
  });

  useEffect(() => {
    if (Array.isArray(settingsList)) {
      const map: Record<string, string> = {};
      settingsList.forEach((item) => {
        if (typeof item.value === "string") {
          map[item.key] = item.value;
        } else if (item.value !== null && item.value !== undefined) {
          map[item.key] = String(item.value);
        }
      });
      setForm((prev) => ({
        ...prev,
        ...map,
      }));
    }
  }, [settingsList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      toast.success("System configurations saved successfully");
    } catch {
      toast.error("Failed to save system configurations");
    }
  };

  if (isLoading) {
    return <Loader text="Loading system configurations..." />;
  }

  const isMaintenanceOn = form.maintenance_mode === "true";

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System Configuration
          </h1>
          <p className="text-xs text-muted-foreground">
            Platform maintenance mode, upload quotas, and infrastructure health parameters.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="gap-2 shrink-0"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save System Config"}
        </Button>
      </div>

      {/* Tabs */}
      <SettingsNav />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Maintenance Mode */}
        <Card className={`border shadow-xs transition-colors ${
          isMaintenanceOn ? "border-amber-500/50 bg-amber-500/5" : "border-border/80"
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Power className={`h-5 w-5 ${isMaintenanceOn ? "text-amber-500" : "text-primary"}`} />
                <CardTitle className="text-base font-semibold">Maintenance Mode</CardTitle>
              </div>
              <Badge variant="outline" className={
                isMaintenanceOn
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
              }>
                {isMaintenanceOn ? "Maintenance Active" : "Operational (Online)"}
              </Badge>
            </div>
            <CardDescription>
              Restrict student and school access during core platform updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Maintenance Switch
                </label>
                <select
                  value={form.maintenance_mode}
                  onChange={(e) =>
                    setForm({ ...form, maintenance_mode: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="false">Online (Normal Operation)</option>
                  <option value="true">Offline (Maintenance Mode Active)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Public Banner Notice
                </label>
                <textarea
                  value={form.maintenance_message}
                  onChange={(e) =>
                    setForm({ ...form, maintenance_message: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotas & Capacity Defaults */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Storage & Pagination Defaults</CardTitle>
            </div>
            <CardDescription>
              Global defaults for file ingestion and database query chunk sizes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Max Ingestion Size (MB)
                </label>
                <select
                  value={form.max_upload_size_mb}
                  onChange={(e) =>
                    setForm({ ...form, max_upload_size_mb: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="2">2 MB (Avatars)</option>
                  <option value="5">5 MB (Standard Images)</option>
                  <option value="10">10 MB (Documents & Attachments)</option>
                  <option value="25">25 MB (Large Assets)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Query Page Size
                </label>
                <select
                  value={form.default_page_size}
                  onChange={(e) =>
                    setForm({ ...form, default_page_size: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="10">10 Records / Page</option>
                  <option value="20">20 Records / Page (Standard)</option>
                  <option value="50">50 Records / Page</option>
                  <option value="100">100 Records / Page</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Audit Trail Retention
                </label>
                <select
                  value={form.audit_log_retention_days}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      audit_log_retention_days: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days (Standard)</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days (1 Year)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Environment Info */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Infrastructure Environment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs divide-y divide-border/60">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Framework Engine</span>
              <span className="font-semibold text-foreground">Next.js 16 (React 19) + Express 5</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">ORM Database Layer</span>
              <span className="font-semibold text-foreground">Prisma ORM with PostgreSQL</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Tenant Isolation Boundary</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Active (JWT verified schoolId)
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Platform Release Version</span>
              <span className="font-semibold text-foreground">InizERP v2.0 Enterprise</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Saving..." : "Save System Config"}
          </Button>
        </div>
      </form>
    </div>
  );
}