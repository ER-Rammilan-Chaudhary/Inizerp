"use client";

import { ReactNode, useEffect } from "react";

import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const setHydrated = useAuthStore(
    (state) => state.setHydrated,
  );

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      try {
        // Refresh token is automatically sent through
        // the httpOnly cookie.
        const { accessToken } = await authApi.refresh();

        if (!mounted) return;

        setAccessToken(accessToken);

        const user = await authApi.me();

        if (!mounted) return;

        setUser(user);
      } catch {
        if (!mounted) return;

        clearAuth();
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [
    clearAuth,
    setAccessToken,
    setHydrated,
    setUser,
  ]);

  return <>{children}</>;
}