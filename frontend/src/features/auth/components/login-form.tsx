"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, ShieldCheck, Wrench } from "lucide-react";
import { authApi } from "@/api/auth.api";
import { ROLE_DASHBOARDS } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { getErrorMessage } from "@/lib/error-message";

import { useMaintenanceStatus } from "@/hooks/useMaintenanceStatus";

export default function LoginForm() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [customNotice, setCustomNotice] = useState<string | null>(null);

  const { data: maintenanceData } = useMaintenanceStatus();
  const maintenanceNotice =
    customNotice ||
    (maintenanceData?.enabled
      ? maintenanceData.message ||
        "InizERP is currently undergoing scheduled maintenance. School portals are temporarily offline. Super Administrators may still sign in."
      : null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await authApi.login(form);
      const role = data.user?.role;

      if (!role) {
        setError("User role is missing.");
        logout();
        return;
      }

      const dashboard = ROLE_DASHBOARDS[role];

      if (!dashboard) {
        setError("You are not authorized to access this system.");
        logout();
        return;
      }

      login(data);
      router.replace(dashboard);
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 503 ||
          (error.response?.data as any)?.code === "MAINTENANCE_MODE")
      ) {
        const msg =
          (error.response?.data as any)?.message ||
          "Platform maintenance is active. School portals are temporarily inaccessible. Only Super Administrators may log in.";
        setCustomNotice(msg);
        setError("");
      } else {
        console.error("Login error:", error);
        setError(getErrorMessage(error, "Invalid email or password"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck size={34} className="text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground">InizERP</h1>

          <p className="text-muted-foreground mt-2">ERP Management Portal</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-5"
        >
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Welcome Back 👋
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              Login to manage your ERP system
            </p>
          </div>

          {/* Maintenance Notice */}
          {maintenanceNotice && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-600 dark:text-amber-400 space-y-2">
              <div className="flex items-start gap-2.5">
                <Wrench className="h-4 w-4 shrink-0 mt-0.5 text-amber-500 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    Platform Maintenance Active
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {maintenanceNotice}
                  </p>
                </div>
              </div>
              <div className="pt-1.5 flex items-center justify-between border-t border-amber-500/20">
                <span className="font-medium text-[11px]">
                  Super Admins may sign in below
                </span>
                <a
                  href="/maintenance"
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View Status Page →
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>

            <input
              type="email"
              value={form.email}
              placeholder="admin@example.com"
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground p-3 outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Enter password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground p-3 pr-12 outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-5 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex gap-2 items-center text-muted-foreground">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="/forgot-password" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground p-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-center text-xs text-muted-foreground pt-3">
            Protected by InizERP Security
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2026 InizERP. All rights reserved.
        </p>
      </div>
    </div>
  );
}