"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type CellContext,
} from "@tanstack/react-table";

import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Skeleton,
} from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

import { Subscription } from "../types/subscription";

interface SubscriptionTableProps {
    data: Subscription[];
    loading?: boolean;

    onView?: (subscription: Subscription) => void;

    onEdit?: (subscription: Subscription) => void;

    onRenew?: (subscription: Subscription) => void;

    onDelete?: (subscription: Subscription) => void;
}

const columns: ColumnDef<Subscription>[] = [
    {
        accessorKey: "school",

        header: "School",

        cell: ({ row }) =>
            <div className="font-medium">
                {row.original.school?.name ?? "-"}
            </div>
    },

    {
        accessorKey: "plan",

        header: "Plan",

        cell: ({ row }) =>
            <span className="font-medium">
                {row.original.plan?.name ?? "-"}
            </span>
    },

    {
        accessorKey: "status",

        header: "Status",

        cell: ({ row }) => (
            <SubscriptionStatusBadge
                status={row.original.status}
            />
        ),
    },

    {
        accessorKey: "finalAmount",

        header: "Amount",

        cell: ({ row }) => (
            <>
                ₹
                {row.original.finalAmount.toLocaleString(
                    "en-IN",
                )}
            </>
        ),
    },

    {
        accessorKey: "startDate",

        header: "Start",

        cell: ({ row }) =>
            format(
                new Date(
                    row.original.startDate,
                ),
                "dd MMM yyyy",
            ),
    },

    {
        accessorKey: "endDate",

        header: "End",

        cell: ({ row }) =>
            format(
                new Date(
                    row.original.endDate,
                ),
                "dd MMM yyyy",
            ),
    },

    {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => (
            <SubscriptionRowActions
                subscription={row.original}
            />
        ),
    },
];

function SubscriptionRowActions({
    subscription,
    onView,
    onEdit,
    onRenew,
    onDelete,
}: {
    subscription: Subscription;
    onView?: (subscription: Subscription) => void;
    onEdit?: (subscription: Subscription) => void;
    onRenew?: (subscription: Subscription) => void;
    onDelete?: (subscription: Subscription) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    />
                }
            >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">
                    Open subscription actions
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {onView && (
                    <DropdownMenuItem
                        onClick={() => onView(subscription)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                )}

                {onEdit && (
                    <DropdownMenuItem
                        onClick={() => onEdit(subscription)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                )}

                {onRenew && (
                    <DropdownMenuItem
                        onClick={() => onRenew(subscription)}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renew
                    </DropdownMenuItem>
                )}

                {onDelete && (
                    <DropdownMenuItem
                        onClick={() => onDelete(subscription)}
                        className="text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function SubscriptionTable({
    data,
    loading = false,
    onView,
    onEdit,
    onRenew,
    onDelete,
}: SubscriptionTableProps) {
    const table = useReactTable({
        data,

        columns: columns.map((column): ColumnDef<Subscription> => {
            if (column.id === "actions") {
                return {
                    ...column,

                    cell: ({ row }: CellContext<Subscription, unknown>) => (
                        <SubscriptionRowActions
                            subscription={row.original}
                            onView={onView}
                            onEdit={onEdit}
                            onRenew={onRenew}
                            onDelete={onDelete}
                        />
                    ),
                };
            }

            return column;
        }),

        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return (
            <Card>
                <CardContent className="space-y-4 p-6">
                    {Array.from({
                        length: 8,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-12 w-full"
                        />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (!data.length) {
        return (
            <Card className="overflow-hidden">
                <CardContent className="flex h-64 flex-col items-center justify-center gap-3">

                    <div className="rounded-full bg-muted p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <rect
                                x="3"
                                y="5"
                                width="18"
                                height="14"
                                rx="2"
                            />

                            <path d="M3 10h18" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-semibold">
                        No Subscriptions
                    </h3>

                    <p className="text-center text-sm text-muted-foreground">
                        There are no subscriptions available.
                    </p>

                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map(
                                            (header) => (
                                                <TableHead
                                                    key={header.id}
                                                    className="whitespace-nowrap"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                ))}

                        </TableHeader>

                        <TableBody>

                            {table
                                .getRowModel()
                                .rows
                                .map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="hover:bg-muted/40"
                                    >

                                        {row
                                            .getVisibleCells()
                                            .map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className="whitespace-nowrap"
                                                >
                                                    {flexRender(
                                                        cell.column
                                                            .columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            ))}

                                    </TableRow>
                                ))}

                        </TableBody>

                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}