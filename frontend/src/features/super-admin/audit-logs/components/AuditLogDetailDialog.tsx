// features/audit-logs/components/AuditLogDetailDialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "../types/audit-logs.types";

interface Props {
    open: boolean;
    log: AuditLog | null;
    onOpenChange: (open: boolean) => void;
}

export default function AuditLogDetailDialog({
    open,
    log,
    onOpenChange,
}: Props) {
    if (!log) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Audit Log Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                        <p className="text-muted-foreground">Action</p>
                        <div className="mt-1">
                            <Badge variant="outline">{log.action}</Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Module</p>
                        <div className="mt-1">
                            <Badge variant="secondary">{log.module}</Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Entity</p>
                        <p className="mt-1 font-medium">{log.entity}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Entity ID</p>
                        <p className="mt-1 font-medium">{log.entityId ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">User</p>
                        <p className="mt-1 font-medium">
                            {log.user?.fullName ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="mt-1 font-medium">
                            {log.user?.email ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">School</p>
                        <p className="mt-1 font-medium">
                            {log.school?.name ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Created At</p>
                        <p className="mt-1 font-medium">
                            {new Date(log.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Browser</p>
                        <p className="mt-1 font-medium">
                            {log.browser ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Device</p>
                        <p className="mt-1 font-medium">
                            {log.device ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">IP Address</p>
                        <p className="mt-1 font-medium">
                            {log.ipAddress ?? "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">User Agent</p>
                        <p className="mt-1 break-all font-medium">
                            {log.userAgent ?? "-"}
                        </p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="text-muted-foreground">Metadata</p>
                        <pre className="mt-1 max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs">
                            {log.meta
                                ? JSON.stringify(log.meta, null, 2)
                                : "-"}
                        </pre>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}