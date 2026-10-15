"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export default function MobileSidebar() {
  const pathname = usePathname();

  const {
    user,
    mobileOpen,
    closeMobile,
    sidebarItems,
  } = useSidebar();

  const displayRole =
    user?.role?.replaceAll("_", " ") ?? "USER";

  const displayName = user?.fullName ?? "User";

  const avatarLetter =
    displayName.charAt(0).toUpperCase() || "U";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
          "border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
          "transition-transform duration-300 ease-in-out",
          "lg:hidden",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >
        {/* Header: Akkhor Signature Golden-Amber Banner */}
        <div className="flex h-16 items-center justify-between bg-sidebar-primary text-white px-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
              <span className="text-sm font-black tracking-tight">AK</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-xl text-white uppercase">AKKHOR</span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-white/80 uppercase truncate">
                {displayRole}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-black/10 text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3">
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              const prevItem = index > 0 ? sidebarItems[index - 1] : null;
              const showSection = item.section && (!prevItem || prevItem.section !== item.section);

              return (
                <div key={item.href} className="space-y-1">
                  {showSection && (
                    <div className={cn("px-3", index === 0 ? "pb-1 pt-1" : "pb-1 pt-4")}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.section}
                      </p>
                    </div>
                  )}

                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200",
                      active
                        ? "bg-white/10 text-white font-semibold border-l-4 border-sidebar-primary shadow-xs"
                        : "text-slate-200 hover:bg-white/5 hover:text-white font-medium",
                    )}
                  >
                    <Icon
                      size={19}
                      className={cn(
                        "transition-transform duration-200 shrink-0 text-sidebar-icon",
                        !active && "group-hover:scale-110",
                      )}
                    />

                    <span className="text-sm font-medium truncate flex-1">
                      {item.title}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-white">
                {avatarLetter}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}