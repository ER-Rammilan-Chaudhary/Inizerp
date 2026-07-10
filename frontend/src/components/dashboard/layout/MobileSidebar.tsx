"use client";

import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebar-data";
import { X } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";

export default function MobileSidebar() {
  const {
    mobileOpen,
    closeMobile,
  } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-card border-r transition-transform duration-300 lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">

          <h2 className="font-bold text-xl text-primary">
            InizerP ERP
          </h2>

          <button
            onClick={closeMobile}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2 p-4">

          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.title}
              item={item}
              collapsed={false}
            />
          ))}

        </nav>
      </aside>
    </>
  );
}