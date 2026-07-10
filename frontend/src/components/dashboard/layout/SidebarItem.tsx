"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { SidebarItem as Item } from "@/types/sidebar";

interface Props {
  item: Item;
  collapsed: boolean;
}

export default function SidebarItem({
  item,
  collapsed,
}: Props) {
  const pathname = usePathname();

  const isActiveParent =
  item.children?.some((child) =>
    pathname.startsWith(child.href || "")
  ) ?? false;

const [open, setOpen] = useState(isActiveParent);

  const Icon = item.icon;

  if (item.children) {
    return (
      <div className="group relative">

        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-muted"
        >
          <div className="flex items-center gap-3">

            <Icon size={20} />

            {!collapsed && (
              <span>{item.title}</span>
            )}

          </div>

          {!collapsed && (
            <ChevronDown
              size={18}
              className={`transition ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {collapsed && (
          <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-lg bg-black px-3 py-2 text-sm text-white opacity-0 transition group-hover:opacity-100">
            {item.title}
          </div>
        )}

        {!collapsed && open && (
          <div className="mt-2 space-y-1">
          {item.children.map((child) => {
          const ChildIcon = child.icon;
          const active = pathname === child.href;

          return (
            <Link
              key={child.title}
              href={child.href || "#"}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <ChildIcon size={16} />
              {child.title}
            </Link>
          );
  })}
</div>)}
      </div>
    );
  }

  const active = pathname === item.href;

  return (
    <div className="group relative">

      <Link
        href={item.href || "#"}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
          active
            ? "bg-primary text-primary-foreground shadow-md"
            : "hover:bg-muted"
        }`}
      >
        <Icon size={20} />

        {!collapsed && (
          <span>{item.title}</span>
        )}
      </Link>

      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-lg bg-black px-3 py-2 text-sm text-white opacity-0 transition group-hover:opacity-100">
          {item.title}
        </div>
      )}

    </div>
  );
}