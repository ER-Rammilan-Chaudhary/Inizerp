"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sliders, ShieldCheck, MonitorCog } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/super-admin/settings/general",
    label: "General Settings",
    icon: Sliders,
    description: "Brand identity & localization",
  },
  {
    href: "/super-admin/settings/security",
    label: "Security & Access",
    icon: ShieldCheck,
    description: "Password & lockout policies",
  },
  {
    href: "/super-admin/settings/system",
    label: "System & Quota",
    icon: MonitorCog,
    description: "Maintenance & storage rules",
  },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex border-b border-border/80 gap-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
