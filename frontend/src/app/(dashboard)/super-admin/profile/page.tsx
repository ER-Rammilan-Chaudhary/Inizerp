"use client";

import { useState } from "react";
import {
  ShieldAlert,
  User,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  Calendar,
  Globe,
  Database,
  Building2,
  Sliders,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Edit Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || "Super Administrator");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    setIsUpdatingProfile(true);
    setTimeout(() => {
      if (user) {
        updateUser({
          ...user,
          fullName: fullName.trim(),
        });
      }
      setIsUpdatingProfile(false);
      toast.success("Profile information updated successfully");
    }, 600);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Security password changed successfully");
    }, 800);
  };

  const displayName = user?.fullName || "Super Administrator";
  const displayEmail = user?.email || "admin@inizerp.com";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "SA";


  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Profile Hero Card */}
      <Card className="overflow-hidden border border-border/80 shadow-xs">
        <div className="h-15 bg-gradient-to-r to-slate-900" />
        <CardContent className="relative px-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="flex h-15 w-15 items-center justify-center rounded-2xl border-4 border-card bg-primary text-2xl font-black text-primary-foreground shadow-lg">
                {initials}
              </div>
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {displayName}
                  </h1>
                  <Badge className="bg-primary text-primary-foreground text-xs uppercase px-2.5 py-0.5">
                    Root Super Admin
                  </Badge>
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  {displayEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground self-start sm:self-auto">
              <Globe className="h-4 w-4 text-primary" />
              <span>Global Multi-Tenant Scope</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Details & Password */}
      <div className="grid gap-6 lg:grid-cols-3">

        <div className="space-y-6 lg:col-span-2">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Account Information</CardTitle>
              </div>
              <CardDescription>
                Update your administrative display name and primary contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full rounded-lg border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed outline-none"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Email address is managed by platform security policy.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Role & Permissions Tier
                    </label>
                    <input
                      type="text"
                      value="SUPER_ADMIN (Global Authority)"
                      disabled
                      className="w-full rounded-lg border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Security & Password</CardTitle>
              </div>
              <CardDescription>
                Ensure your account is protected with a high-entropy password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Updating Password..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Platform Privileges & Metadata */}
        <div className="space-y-6">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-base font-bold">Platform Privileges</CardTitle>
              </div>
              <CardDescription>Root capabilities granted to this identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Cross-Tenant Visibility</p>
                  <p className="text-muted-foreground text-[11px]">
                    Access all registered schools and tenants without restrictions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Subscription & Billing Control</p>
                  <p className="text-muted-foreground text-[11px]">
                    Create, modify, and assign plans and renewal licenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Feature Flag Gating</p>
                  <p className="text-muted-foreground text-[11px]">
                    Enable or disable specific ERP modules globally or per school.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">System Audit Trails</p>
                  <p className="text-muted-foreground text-[11px]">
                    Inspect activity logs and security alerts across the infrastructure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Session & Environment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs divide-y divide-border/60">
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Session Architecture</span>
                <span className=" font-medium text-foreground">JWT (Memory + HTTP-only)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Access Token Lifetime</span>
                <span className="font-medium text-foreground">15 Minutes (Rotating)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Refresh Token Lifetime</span>
                <span className="font-medium text-foreground">7 Days (Hashed)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Brute-Force Lockout</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Active (5 tries / 15m)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


