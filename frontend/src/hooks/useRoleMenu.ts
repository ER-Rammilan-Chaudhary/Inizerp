"use client";

import { menu } from "@/constants/menu";
import { UserRole } from "@/types/auth";

export function useRoleMenu(role: UserRole) {
  return menu[role] ?? [];
}