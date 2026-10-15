"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Mail, Save, Settings as SettingsIcon, Building, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/common/Loader";
import SettingsNav from "@/features/super-admin/settings/components/SettingsNav";
import { useSettings } from "@/features/super-admin/settings/hooks/useSettings";
import { useUpdateSettings } from "@/features/super-admin/settings/hooks/useUpdateSettings";

export default function GeneralSettingsPage() {
  const router = useRouter();
  const { data: settingsList, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState({
    site_name: "InizERP School Cloud",
    site_description: "Enterprise Multi-Tenant School Management Platform",
    support_email: "support@inizerp.com",
    support_phone: "+91 98765 43210",
    support_address: "New Delhi, India",
    timezone: "Asia/Kolkata",
    currency: "INR",
    language: "en",
    date_format: "DD/MM/YYYY",
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
      toast.success("General settings updated successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) {
    return <Loader text="Loading settings..." />;
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            General Settings
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure platform brand identity, support contact channels, and localization.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="gap-2 shrink-0"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Tabs */}
      <SettingsNav />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Platform Brand Identity</CardTitle>
            </div>
            <CardDescription>
              Basic application details displayed across school portals and invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={form.site_name}
                  onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Currency
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Platform Slogan / Description
              </label>
              <textarea
                value={form.site_description}
                onChange={(e) => setForm({ ...form, site_description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Support & Helpdesk</CardTitle>
            </div>
            <CardDescription>
              Contact information displayed to school administrators and parents for billing support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Helpdesk Email
                </label>
                <input
                  type="email"
                  value={form.support_email}
                  onChange={(e) => setForm({ ...form, support_email: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  value={form.support_phone}
                  onChange={(e) => setForm({ ...form, support_phone: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Office / Support Address
              </label>
              <input
                type="text"
                value={form.support_address}
                onChange={(e) => setForm({ ...form, support_address: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Localization & Time</CardTitle>
            </div>
            <CardDescription>
              Timezone calculations for automated attendance, invoices, and exam scheduling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Timezone
                </label>
                <select
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC (Universal Time)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Primary Language
                </label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Date Format
                </label>
                <select
                  value={form.date_format}
                  onChange={(e) => setForm({ ...form, date_format: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
