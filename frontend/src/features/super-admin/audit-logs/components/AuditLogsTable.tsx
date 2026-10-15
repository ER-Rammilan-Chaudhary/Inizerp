"use client";

import { Eye, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Loader from "@/components/common/Loader";
import Pagination from "@/components/tables/Pagination";

import { useSearchParams } from "next/navigation";
import { useSearchStore } from "@/store/search.store";

import { useAuditLogs } from "@/features/super-admin/audit-logs/hooks/useAuditLogs";

import type { AuditLog } from "../types/audit-logs.types";

interface Props {
    onView: (item: AuditLog) => void;
}

export default function AuditLogsTable({
    onView,
}: Props) {
    const searchParams = useSearchParams();

    const search = useSearchStore(
        (state) => state.search
    );

    const page =
        Number(searchParams.get("page")) || 1;

    const limit = 2;

    const {
        data,
        isLoading,
        error,
    } = useAuditLogs({
        page,
        limit,
        search,
    });

    // API response ke andar actual array
    const auditLogs = data?.data ?? [];

    const pagination = data?.pagination;

    if (isLoading && !data) {
        return (
            <Loader text="Loading audit logs..." />
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border py-12 text-center">
                <h3 className="font-semibold">
                    Unable to load audit logs
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    No activity matches your current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-10">

            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full text-sm">

                    <thead className="bg-muted/40">
                        <tr>
                            <th className="p-3 text-left">
                                Action
                            </th>

                            <th className="p-3 text-left">
                                Entity
                            </th>

                            <th className="p-3 text-left">
                                Module
                            </th>

                            <th className="p-3 text-left">
                                School
                            </th>

                            <th className="p-3 text-left">
                                User
                            </th>

                            <th className="p-3 text-left">
                                Created
                            </th>

                            <th className="w-20 p-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {auditLogs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-10 text-center text-muted-foreground"
                                >
                                    No audit logs found.
                                </td>
                            </tr>
                        ) : (
                            auditLogs.map(
                                (item: AuditLog) => (
                                    <tr
                                        key={item.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="p-3">
                                            <Badge variant="outline">
                                                {item.action}
                                            </Badge>
                                        </td>

                                        <td className="p-3 font-medium">
                                            {item.entity}
                                        </td>

                                        <td className="p-3">
                                            <Badge variant="secondary">
                                                {item.module}
                                            </Badge>
                                        </td>

                                        <td className="p-3">
                                            {item.school?.name ?? "-"}
                                        </td>

                                        <td className="p-3">
                                            <div className="font-medium">
                                                {item.user?.fullName ?? "-"}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {item.user?.email ?? ""}
                                            </div>
                                        </td>

                                        <td className="p-3 text-sm text-muted-foreground">
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString()}
                                        </td>

                                        <td className="p-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onView(item)
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="px-6">
                    <Pagination pagination={pagination} />
                </div>
            )}

        </div>
    );
}

