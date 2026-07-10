"use client";

import { create } from "zustand";

interface SidebarStore {
  collapsed: boolean;
  mobileOpen: boolean;

  toggle: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  initialize: () => void;
}

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  collapsed: false,
  mobileOpen: false,

  initialize: () => {
    if (typeof window === "undefined") return;

    const value = localStorage.getItem("sidebar");

    if (value) {
      set({
        collapsed: value === "true",
      });
    }
  },

  toggle: () => {
    const next = !get().collapsed;

    localStorage.setItem("sidebar", String(next));

    set({
      collapsed: next,
    });
  },

  openMobile: () =>
    set({
      mobileOpen: true,
    }),

  closeMobile: () =>
    set({
      mobileOpen: false,
    }),
}));
