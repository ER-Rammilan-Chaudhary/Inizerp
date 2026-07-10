"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./sidebar-data";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-border bg-card">

      {/* Logo Fixed */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          IP
        </div>

        <div className="ml-3">
          <h2 className="text-lg font-bold">
            InizerP ERP
          </h2>

          <p className="text-xs text-muted-foreground">
            Super Admin
          </p>
        </div>
      </div>


      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-auto py-4">

        <div className="space-y-1 px-3">
          {sidebarItems.map((item) => {

            const Icon = item.icon;
            const href = item.href ?? "#";
            const active = pathname === href;

            return (
              <Link
                key={item.title}
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

      </nav>


      {/* Fixed Footer */}
      <div className="shrink-0 border-t border-border p-5">

        <div className="rounded-xl bg-muted p-4">
          <h3 className="font-semibold">
            Super Admin
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage all schools, colleges, users and reports.
          </p>
        </div>

      </div>

    </aside>
  );
}