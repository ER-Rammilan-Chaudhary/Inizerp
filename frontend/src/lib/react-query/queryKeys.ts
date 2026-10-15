// lib/react-query/queryKeys.ts
export const queryKeys = {
  schools: {
    all: ["schools"] as const,
    list: (page: number, limit: number, search: string) =>
      ["schools", page, limit, search] as const,
    detail: (id: string) => ["school", id] as const,
  },
  // plans quary
  plans: {
    all: ["plans"] as const,
    list: () => ["plans"] as const,
  },

  // features quary
  features: {
    all: ["features"] as const,
    list: (page: number, limit: number, search: string) =>
      ["features", page, limit, search] as const,
  },

  // subscriptions quary
  subscriptions: {
    all: ["subscriptions"] as const,
    list: (page: number, limit: number, search?: string) =>
      ["subscriptions", page, limit, search] as const,
    stats: ["subscription-stats"] as const,
    school: (schoolId: string) => ["school-subscriptions", schoolId] as const,
  },

  // notifications quary
  notifications: {
    all: ["notifications"] as const,
    list: (filters?: unknown) => ["notifications", "list", filters] as const,
    detail: (id: string) => ["notifications", id] as const,
    my: (filters?: unknown) => ["notifications", "my", filters] as const,
    school: (schoolId: string, filters?: unknown) =>
      ["notifications", "school", schoolId, filters] as const,
    unread: ["notifications", "unread"] as const,
    stats: ["notifications", "stats"] as const,
  },

  // auditLogs quary
  auditLogs: {
    all: ["audit-logs"] as const,
    list: (filters?: unknown) => ["audit-logs", "list", filters] as const,
    detail: (id: string) => ["audit-logs", "detail", id] as const,
    recent: ["audit-logs", "recent"] as const,
    stats: ["audit-logs", "stats"] as const,
  },

  // setting quary
  settings: {
    all: ["settings"] as const,
    list: ["settings", "list"] as const,
    section: (section: string) => ["settings", "section", section] as const,
  },

  academicYearKeys: {
    all: ["academic-years"] as const,
    list: () => ["academic-years", "list"] as const,
  },
  
};
