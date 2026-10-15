// features/audit-logs/components/AuditLogsPage.tsx

"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuditLogFilters from "./AuditLogFilters";
import AuditLogStats from "./AuditLogStats";
import AuditLogsTable from "./AuditLogsTable";
import AuditLogDetailDialog from "./AuditLogDetailDialog";
import { useAuditStats } from "../hooks/useAuditStats";
import { useExportAuditLogs } from "../hooks/useExportAuditLogs";
import type {
    AuditLog,
    AuditLogFilters as Filters,
} from "../types/audit-logs.types";

export default function AuditLogsPage() {
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        limit: 10,
    });

    const [selected, setSelected] = useState<AuditLog | null>(null);
    const [openDetail, setOpenDetail] = useState(false);

    const { data: statsResponse } = useAuditStats();

    const exportMutation = useExportAuditLogs();

    const stats = statsResponse?.data;

    const handleFilterChange = (value: Partial<Filters>) => {
        setFilters((prev) => ({
            ...prev,
            ...value,
            page: 1,
        }));
    };

    const handleReset = () => {
        setFilters({
            page: 1,
            limit: 10,
        });
    };

    const handleView = (item: AuditLog) => {
        setSelected(item);
        setOpenDetail(true);
    };

    const handleExport = () => {
        const exportFilters = { ...filters };
        delete exportFilters.page;
        delete exportFilters.limit;
        exportMutation.mutate(exportFilters);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Activity Logs</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor system activity and user actions
                    </p>
                </div>

                <Button
                    onClick={handleExport}
                    disabled={exportMutation.isPending}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {exportMutation.isPending ? "Exporting..." : "Export CSV"}
                </Button>
            </div>

            <AuditLogStats stats={stats} />

            <AuditLogFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
            />

            <AuditLogsTable
                onView={handleView}
            />

            <AuditLogDetailDialog
                open={openDetail}
                log={selected}
                onOpenChange={setOpenDetail}
            />
        </div>
    );
}