"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SchoolNavigationProps {
  schoolId: string;
}

const navigation = [
  {
    title: "General",
    href: (id: string) => `/super-admin/schools/${id}`,
  },
  {
    title: "Admins",
    href: (id: string) => `/super-admin/schools/${id}/admins`,
  },
  {
    title: "Features",
    href: (id: string) => `/super-admin/schools/${id}/features`,
  },
  {
    title: "Subscription",
    href: (id: string) => `/super-admin/schools/${id}/subscription`,
  },
  {
    title: "Activity",
    href: (id: string) => `/super-admin/schools/${id}/activity`,
  },
];

export default function SchoolNavigation({
  schoolId,
}: SchoolNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-xl border bg-card p-2">
        {navigation.map((item) => {
          const href = item.href(schoolId);

          const active = pathname === href;

          return (
            <Link
              key={item.title}
              href={href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}