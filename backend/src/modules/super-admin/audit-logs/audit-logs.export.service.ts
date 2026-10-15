import { Parser } from "json2csv";
import { prisma } from "../../../config/prisma";

import {
  AuditLogQuery,
  buildAuditLogWhereForExport,
} from "./audit-logs.service";

const MAX_EXPORT_ROWS = 10000;

export const exportAuditLogsCSVService = async (query: AuditLogQuery) => {
  const where = buildAuditLogWhereForExport(query);

  const logs = await prisma.auditLog.findMany({
    where,

    take: MAX_EXPORT_ROWS,

    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],

    include: {
      school: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const data = logs.map((item) => ({
    ID: item.id,
    Action: item.action,
    Module: item.module,
    Entity: item.entity,
    EntityID: item.entityId ?? "",
    SchoolID: item.schoolId ?? "",
    School: item.school?.name ?? "",
    SchoolCode: item.school?.code ?? "",
    UserID: item.userId ?? "",
    User: item.user?.fullName ?? "",
    Email: item.user?.email ?? "",
    Role: item.user?.role ?? "",
    Browser: item.browser ?? "",
    Device: item.device ?? "",
    IPAddress: item.ipAddress ?? "",
    CreatedAt: item.createdAt.toISOString(),
  }));

  const parser = new Parser({
    fields: [
      "ID",
      "Action",
      "Module",
      "Entity",
      "EntityID",
      "SchoolID",
      "School",
      "SchoolCode",
      "UserID",
      "User",
      "Email",
      "Role",
      "Browser",
      "Device",
      "IPAddress",
      "CreatedAt",
    ],
  });

  return parser.parse(data);
};
