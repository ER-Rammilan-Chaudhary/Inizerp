"use client";

import Link from "next/link";
import {
    Ban,
    CheckCircle,
    Eye,
    MoreHorizontal,
    Pencil,
} from "lucide-react";

import type { School } from "@/features/super-admin/schools/types/school";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUpdateSchoolStatus } from "../hooks/useUpdateSchoolStatus";
import {
    useResetSchoolPassword
} from "../hooks/useResetSchoolPassword";


interface SchoolActionsProps {
    school: School;
    onEdit: (school: School) => void;
}

export function SchoolActions({ school, onEdit, }: SchoolActionsProps) {
     const { mutate: updateStatus, isPending: statusLoading, } = useUpdateSchoolStatus();


    const {
        mutate: resetPassword,
        isPending: resetLoading
    } = useResetSchoolPassword();


    const loading = statusLoading || resetLoading;


    const handleResetPassword = () => {
        const confirmReset =
            window.confirm(
                `Reset admin password for "${school.name}"?`
            );
        if (!confirmReset)
            return;
        resetPassword(
            school.id
        );

    };


    // Backend status -> boolean
    const isActive = school.status === "ACTIVE";

    const handleStatus = () => {
        updateStatus({
            schoolId: school.id,
            status: isActive
                ? "SUSPENDED"
                : "ACTIVE",
        });

    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                disabled={loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-accent disabled:opacity-50"
            >
                <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                    <Link
                        href={`/super-admin/schools/${school.id}`}
                        className="flex w-full items-center"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit(school)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleStatus}>
                    {isActive ? (
                        <>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend
                        </>
                    ) : (
                        <> <CheckCircle className="mr-2 h-4 w-4" />Activate </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}