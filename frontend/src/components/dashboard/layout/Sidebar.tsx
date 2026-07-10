"use client";

import { useEffect } from "react";

import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebar-data";
import { PanelLeftClose, PanelLeftOpen, }from "lucide-react";

import { useSidebar } from "@/hooks/useSidebar";



export default function Sidebar() {
  const {
    collapsed,
    toggle,
    initialize,
  } = useSidebar();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <aside
      className={`hidden lg:flex flex-col border-r bg-card transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b px-5 fixed top-0 left-0 w-72 bg-card z-30 ">

        {!collapsed && (
          <h2 className="font-bold text-xl text-primary">
            InizerP ERP
          </h2>
        )}

        <button
          onClick={toggle}
          className="rounded-lg p-2 hover:bg-muted"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 pt-24">

        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.title}
            item={item}
            collapsed={collapsed}
          />
        ))}

      </nav>
    </aside>
  );
}