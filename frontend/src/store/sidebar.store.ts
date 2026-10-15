"use client";

import { create } from "zustand";

interface SidebarStore {
  collapsed: boolean;
  mobileOpen: boolean;

  enabledFeatures: string[];
  featuresLoaded: boolean;

  initialize: () => void;

  setEnabledFeatures: (features: string[]) => void;
  setFeaturesLoaded: (value: boolean) => void;
  isFeatureEnabled: (moduleKey: string) => boolean;

  toggle: () => void;

  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  /* ---------------------------------------------------------------------- */
  /* State                                                                  */
  /* ---------------------------------------------------------------------- */

  collapsed: false,
  mobileOpen: false,

  // Backend se enabled modules yahan memory mein rahenge.
  enabledFeatures: [],
  featuresLoaded: false,

  /* ---------------------------------------------------------------------- */
  /* Initialize                                                             */
  /* ---------------------------------------------------------------------- */

  initialize: () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const value = localStorage.getItem("sidebar");

      if (value !== null) {
        set({
          collapsed: value === "true",
        });
      }
    } catch {
      // Ignore localStorage errors.
    }
  },

  /* ---------------------------------------------------------------------- */
  /* Features                                                                */
  /* ---------------------------------------------------------------------- */

  setEnabledFeatures: (features) => {
    set({
      enabledFeatures: features,
      featuresLoaded: true,
    });
  },

  setFeaturesLoaded: (value) => {
    set({
      featuresLoaded: value,
    });
  },

  isFeatureEnabled: (moduleKey) => {
    return get().enabledFeatures.includes(moduleKey);
  },

  /* ---------------------------------------------------------------------- */
  /* Desktop Sidebar                                                        */
  /* ---------------------------------------------------------------------- */

  toggle: () => {
    const next = !get().collapsed;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sidebar", String(next));
      } catch {
        // Ignore localStorage errors.
      }
    }

    set({
      collapsed: next,
    });
  },

  /* ---------------------------------------------------------------------- */
  /* Mobile Sidebar                                                         */
  /* ---------------------------------------------------------------------- */

  openMobile: () => {
    set({
      mobileOpen: true,
    });
  },

  closeMobile: () => {
    set({
      mobileOpen: false,
    });
  },

  toggleMobile: () => {
    set((state) => ({
      mobileOpen: !state.mobileOpen,
    }));
  },
}));
