"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, RefreshCw, ShieldAlert, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MaintenancePage() {
  const [message, setMessage] = useState(
    "InizERP is currently undergoing scheduled platform upgrades to improve performance and stability."
  );
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/maintenance-status?_t=${Date.now()}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.message) {
          setMessage(data.data.message);
        }
        if (data?.data && data.data.enabled === false) {
          window.location.href = "/";
        }
      })
      .catch(() => {});
  }, []);

  const handleRefresh = async () => {
    setChecking(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/maintenance-status?_t=${Date.now()}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (data?.data?.enabled === false) {
        window.location.href = "/login";
        return;
      }
      if (data?.data?.message) {
        setMessage(data.data.message);
      }
    } catch {}
    setTimeout(() => setChecking(false), 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-lg border-border/80 shadow-2xl relative z-10 text-center">
        <CardContent className="p-8 sm:p-12 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
            <Wrench className="h-10 w-10 animate-bounce duration-1000" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              Platform Maintenance Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              We&apos;ll be back soon
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
              {message}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Status</span>
              <span className="text-amber-600 font-medium">Scheduled Maintenance</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Data Security</span>
              <span className="text-emerald-600 font-medium">100% Protected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Platform Scope</span>
              <span>All School Portals</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleRefresh}
              disabled={checking}
              className="w-full sm:w-auto gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
              {checking ? "Checking Status..." : "Check Status"}
            </Button>

            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/login">
                Super Admin Login
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span>Need urgent assistance? Contact support@inizerp.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
