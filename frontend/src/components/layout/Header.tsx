"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
  Wrench,
} from "lucide-react";

import NotificationBell from "@/features/super-admin/notifications/NotificationBell/NotificationBell";
import HeaderSearch from "@/components/layout/HeaderSearch";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { useMaintenanceStatus } from "@/hooks/useMaintenanceStatus";

export default function Header() {
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: maintenanceData } = useMaintenanceStatus();
  const maintenanceActive = maintenanceData?.enabled ?? false;

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const openMobile = useSidebarStore(
    (state) => state.openMobile,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      setOpen(false);
      router.replace("/login");
    }
  };

  const handleProfile = () => {
    setOpen(false);

    if (user?.role === "SUPER_ADMIN") {
      router.push("/super-admin/profile");
      return;
    }

    // Role-specific profile routes can be added later.
  };

  const handleSettings = () => {
    setOpen(false);

    if (user?.role === "SUPER_ADMIN") {
      router.push("/super-admin/settings");
      return;
    }

    // Role-specific settings routes can be added later.
  };

  const displayName = user?.fullName ?? "User";

  const displayRole =
    user?.role?.replaceAll("_", " ") ?? "USER";

  const avatarLetter =
    displayName.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card shadow-xs">
      {maintenanceActive && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-bold">Maintenance Mode Active:</span>
            <span className="hidden sm:inline">External school portals and non-admin logins are currently restricted.</span>
          </div>
          <Link
            href="/super-admin/settings/system"
            className="font-medium underline hover:text-amber-900 dark:hover:text-amber-200 shrink-0"
          >
            System Settings →
          </Link>
        </div>
      )}

      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openMobile}
            aria-label="Open navigation menu"
            className="cursor-pointer rounded-xl border border-border p-2 transition hover:bg-muted lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-1 justify-start">
          <HeaderSearch />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="relative">
            <NotificationBell />
          </div>

          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setOpen((previous) => !previous)
              }
              aria-expanded={open}
              aria-haspopup="menu"
              className="group flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {avatarLetter}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[130px] truncate text-sm font-semibold leading-5">
                  {displayName}
                </p>

                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {displayRole}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`ml-1 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""
                  }`}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border/70 bg-popover p-1.5 shadow-xl shadow-black/10 dark:shadow-black/30"
              >
                {/* Profile */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <User
                    size={17}
                    strokeWidth={1.8}
                    className="text-muted-foreground"
                  />

                  <span>Profile</span>
                </button>

                {/* Settings */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSettings}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Settings
                    size={17}
                    strokeWidth={1.8}
                    className="text-muted-foreground"
                  />

                  <span>Settings</span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                >
                  <LogOut
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    {loggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}