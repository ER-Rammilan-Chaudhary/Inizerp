"use client";

import { useEffect, useMemo } from "react";

import { getSchoolEnabledModuleKeys } from "@/features/super-admin/schools/api/school.api";
import { sidebarByRole } from "@/constants/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";

export const useSidebar = () => {
  const user = useAuthStore((state) => state.user);
  const collapsed = useSidebarStore((state) => state.collapsed);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const enabledFeatures = useSidebarStore((state) => state.enabledFeatures);
  const featuresLoaded = useSidebarStore((state) => state.featuresLoaded);
  const initialize = useSidebarStore((state) => state.initialize);
  const setEnabledFeatures = useSidebarStore((state) => state.setEnabledFeatures,);
  const setFeaturesLoaded = useSidebarStore((state) => state.setFeaturesLoaded);
  const toggle = useSidebarStore((state) => state.toggle);
  const openMobile = useSidebarStore((state) => state.openMobile);
  const closeMobile = useSidebarStore((state) => state.closeMobile);
  const toggleMobile = useSidebarStore((state) => state.toggleMobile);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!user?.schoolId || user.role === "SUPER_ADMIN") {
      return;
    }

    let cancelled = false;

    getSchoolEnabledModuleKeys()
      .then((features) => {
        if (!cancelled) {
          setEnabledFeatures(features);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEnabledFeatures([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setFeaturesLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [setEnabledFeatures, setFeaturesLoaded, user]);

  const sidebarItems = useMemo(() => {
    if (!user?.role) {
      return [];
    }

    const items = sidebarByRole[user.role] ?? [];

    if (user.role === "SUPER_ADMIN") {
      return items;
    }

    const normalizedEnabledFeatures = enabledFeatures.map((feature) =>
      feature.toUpperCase(),
    );

    // If features haven't loaded yet or are empty, show all items by default
    if (!featuresLoaded || normalizedEnabledFeatures.length === 0) {
      return items;
    }

    return items.filter((item) => {
      // Common modules always visible.
      if (item.common) {
        return true;
      }

      // Module key nahi hai to visible rakho.
      if (!item.moduleKey) {
        return true;
      }

      // Sirf enabled school features visible.
      return normalizedEnabledFeatures.includes(item.moduleKey.toUpperCase());
    });
  }, [enabledFeatures, featuresLoaded, user]);

  return {
    user,
    collapsed,
    mobileOpen,
    sidebarItems,
    enabledFeatures,
    featuresLoaded,
    initialize,
    setEnabledFeatures,
    toggle,
    openMobile,
    closeMobile,
    toggleMobile,
  };
};
