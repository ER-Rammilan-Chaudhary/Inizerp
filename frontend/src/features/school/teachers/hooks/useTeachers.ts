"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeachers } from "../api/teachers.api";

export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: () => [...teacherKeys.lists()] as const,
};

export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.list(),
    queryFn: getTeachers,
    staleTime: 5 * 60 * 1000,
  });
}
