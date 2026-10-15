"use client";

import { useState } from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";
import ErrorPage from "@/components/common/error/ErrorPage";

import NotificationFilters from "../components/NotificationFilters";
import NotificationStatsCards from "../components/NotificationStatsCards";
import NotificationTable from "../components/NotificationTable";
import DeleteNotificationDialog from "../components/DeleteNotificationDialog";

import { useNotifications } from "../hooks/useNotifications";
import { useNotificationStats } from "../hooks/useNotificationStats";
import { useDeleteNotification } from "../hooks/useDeleteNotification";

import Pagination from "@/components/tables/Pagination";

import type {
    Notification,
    NotificationFilters as Filters,
} from "../types/notification.types";

import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useBulkReadNotifications } from "../hooks/useBulkReadNotifications";
import { useBulkDeleteNotifications } from "../hooks/useBulkDeleteNotifications";

import { useSearchStore } from "@/store/search.store";

export default function NotificationManagementPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = useSearchStore(
        (state) => state.search
    );

    const [filters, setFilters] = useState<Filters>({
        page: 1,
        limit: 5,
        readStatus: "all",
    });

    const page =
        Number(searchParams.get("page")) ||
        filters.page ||
        1;

    const limit = filters.limit ?? 5;

    const {
        data,
        isLoading,
        isError,
        error,
    } = useNotifications({
        ...filters,
        page,
        limit,
        search,
    });

    const notifications = data?.data ?? [];
    const pagination = data?.pagination;

    const [selected, setSelected] =
        useState<Notification | null>(null);

    const [openDelete, setOpenDelete] =
        useState(false);

    const deleteMutation =
        useDeleteNotification();

    const { data: statsResponse } =
        useNotificationStats();

    const stats = statsResponse?.data;

    const readMutation =
        useMarkNotificationRead();

    const [selectedRows, setSelectedRows] =
        useState<string[]>([]);

    const bulkReadMutation =
        useBulkReadNotifications();

    const bulkDeleteMutation =
        useBulkDeleteNotifications();

    const handleFilterChange = (
        value: Partial<Filters>
    ) => {
        setFilters((prev) => ({
            ...prev,
            ...value,
            page: 1,
        }));

        // Filter change par URL page ko bhi reset karo
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("page", "1");

        router.push(`? ${params.toString()} `
        );
    };

    const handleReset = () => {
        setFilters({
            page: 1,
            limit: 5,
            readStatus: "all",
        });

        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("page", "1");

        router.push(`? ${params.toString()} `
        );
    };

    const handleDelete = (
        notification: Notification
    ) => {
        setSelected(notification);
        setOpenDelete(true);
    };

    const confirmDelete = () => {
        if (!selected) return;

        deleteMutation.mutate(
            selected.id,
            {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelected(null);
                },
            }
        );
    };

    const handleMarkRead = (
        notification: Notification
    ) => {
        readMutation.mutate(
            notification.id
        );
    };

    const handleBulkRead = () => {
        if (!selectedRows.length) return;

        bulkReadMutation.mutate({
            ids: selectedRows,
        });

        setSelectedRows([]);
    };

    const handleBulkDelete = () => {
        if (!selectedRows.length) return;

        bulkDeleteMutation.mutate({
            ids: selectedRows,
        });

        setSelectedRows([]);
    };

    if (isError) {
        return (
            <ErrorPage
                title="Unable to load notifications"
                message={
                    error instanceof Error
                        ? error.message
                        : "Please try again in a moment."
                }
                onRetry={() =>
                    window.location.reload()
                }
            />
        );
    }

    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Notifications
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage global and school notifications
                    </p>
                </div>

                <Button
                    onClick={() =>
                        router.push(
                            "/super-admin/notifications/id/new"
                        )
                    }
                >
                    Create Notification
                </Button>
            </div>

            <NotificationStatsCards
                stats={stats}
            />

            <NotificationFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
            />

            <NotificationTable
                data={notifications}
                loading={isLoading}
                selectedRows={selectedRows}
                onSelectionChange={
                    setSelectedRows
                }
                onView={(item) => router.push(`/super-admin/notifications/${item.id}`)}
                onEdit={(item) => router.push(`/super-admin/notifications/${item.id}/edit`)}

                onDelete={handleDelete}
                onMarkRead={handleMarkRead}
                onBulkDelete={
                    handleBulkDelete
                }
                onBulkRead={handleBulkRead}
            />

            {pagination && (
                <div className="px-6">
                    <Pagination pagination={pagination} />
                </div>
            )}

            <DeleteNotificationDialog
                open={openDelete}
                notification={selected}
                loading={
                    deleteMutation.isPending
                }
                onOpenChange={setOpenDelete}
                onConfirm={confirmDelete}
            />

        </div >
    );
}

