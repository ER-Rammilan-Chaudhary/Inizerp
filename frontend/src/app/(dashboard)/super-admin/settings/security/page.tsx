"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, Save, ShieldAlert, ShieldCheck, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/common/Loader";
import SettingsNav from "@/features/super-admin/settings/components/SettingsNav";
import { useSettings } from "@/features/super-admin/settings/hooks/useSettings";
import { useUpdateSettings } from "@/features/super-admin/settings/hooks/useUpdateSettings";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { data: settingsList, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState({
    password_min_length: "8",
    password_require_uppercase: "true",
    password_require_special: "true",
    session_timeout_minutes: "15",
    max_failed_logins: "5",
    lockout_duration_minutes: "15",
    enforce_2fa: "false",
    send_login_alerts: "true",
    single_active_session: "true",
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
      toast.success("Security policies updated successfully");
    } catch {
      toast.error("Failed to update security policies");
    }
  };

  if (isLoading) {
    return <Loader text="Loading security settings..." />;
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Security & Authentication
          </h1>
          <p className="text-xs text-muted-foreground">
            Enforce password complexity, session duration, and automated lockout policies.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="gap-2 shrink-0"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Policies"}
        </Button>
      </div>

      {/* Tabs */}
      <SettingsNav />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Policy */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Password Requirements</CardTitle>
            </div>
            <CardDescription>
              Rules enforced when school staff, teachers, or admins set or update passwords.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Minimum Password Length
                </label>
                <select
                  value={form.password_min_length}
                  onChange={(e) =>
                    setForm({ ...form, password_min_length: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="6">6 Characters</option>
                  <option value="8">8 Characters (Recommended)</option>
                  <option value="10">10 Characters (High Security)</option>
                  <option value="12">12 Characters</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Require Uppercase Letters
                </label>
                <select
                  value={form.password_require_uppercase}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password_require_uppercase: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Enforced (A-Z)</option>
                  <option value="false">Optional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Require Special Characters
                </label>
                <select
                  value={form.password_require_special}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password_require_special: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Enforced (!@#$%^&*)</option>
                  <option value="false">Optional</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brute-Force & Lockout Policy */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Brute-Force & Account Lockout</CardTitle>
            </div>
            <CardDescription>
              Mitigate credential stuffing by temporarily locking accounts with repeated failures.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Max Failed Logins Threshold
                </label>
                <select
                  value={form.max_failed_logins}
                  onChange={(e) =>
                    setForm({ ...form, max_failed_logins: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="3">3 Consecutive Failures</option>
                  <option value="5">5 Consecutive Failures (Standard)</option>
                  <option value="10">10 Consecutive Failures</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Temporary Lockout Duration
                </label>
                <select
                  value={form.lockout_duration_minutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lockout_duration_minutes: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="5">5 Minutes</option>
                  <option value="15">15 Minutes (Standard)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions & Token Lifetime */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Session Governance</CardTitle>
            </div>
            <CardDescription>
              Browser session expiry and multi-device connection preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Access Token Lifetime
                </label>
                <select
                  value={form.session_timeout_minutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      session_timeout_minutes: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="15">15 Minutes (Auto-Refreshed)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Single Active Session
                </label>
                <select
                  value={form.single_active_session}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      single_active_session: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Enforced (One Device)</option>
                  <option value="false">Multiple Devices Allowed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Suspicious Login Email Alerts
                </label>
                <select
                  value={form.send_login_alerts}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      send_login_alerts: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Saving..." : "Save Security Policies"}
          </Button>
        </div>
      </form>
    </div>
  );
}