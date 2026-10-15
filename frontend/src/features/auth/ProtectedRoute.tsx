"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Loader from "@/components/common/Loader";
import { ROLE_DASHBOARDS } from "@/constants/routes";
import type { UserRole } from "@/types/auth.types";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const isHydrated = useAuthStore(
    (state) => state.isHydrated,
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace(ROLE_DASHBOARDS[user.role]);
    }
  }, [
    allowedRoles,
    isAuthenticated,
    isHydrated,
    router,
    user,
  ]);

  if (!isHydrated) {
    return <Loader text="Loading page..." fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}