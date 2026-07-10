"use client";

import { Menu } from "lucide-react";

import ThemeToggle from "@/components/providers/ThemeToggle";
import SearchBox from "../../ui/SearchBox";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

import { useSidebar } from "@/hooks/useSidebar";

export default function Header() {

  const {
    openMobile,
  } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">

      <div className="flex items-center gap-4">

        <button
          onClick={openMobile}
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
        >
          <Menu size={22} />
        </button>

        <SearchBox />

      </div>

      <div className="flex items-center gap-3">

        <ThemeToggle />

        <NotificationDropdown />

        <ProfileDropdown />

      </div>

    </header>
  );
}