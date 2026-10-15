"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

export default function NotificationsRedirectPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "SUPER_ADMIN") {
      router.replace("/super-admin/notifications");
    } else if (user.role === "SCHOOL_ADMIN") {
      router.replace("/school-admin/notifications");
    } else if (user.role === "PARENT") {
      router.replace("/parent/notifications");
    } else if (user.role === "TEACHER") {
      router.replace("/teacher/notifications");
    } else {
      router.replace("/school-admin/notifications");
    }
  }, [isHydrated, user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}