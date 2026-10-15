"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { UserRole, UserStatus, } from "../types/user.types";


interface UserFiltersProps {
    role: UserRole | ""; schoolId: string; status: UserStatus | "";
    schools: { id: string; name: string; code: string; }[];
    onRoleChange: (value: UserRole | "",) => void;
    onSchoolChange: (value: string,) => void;
    onStatusChange: (value: UserStatus | "",) => void;
    onReset: () => void;

}

export default function UserFilters({ role, schoolId, status, schools, onRoleChange, onSchoolChange, onStatusChange, onReset, }: UserFiltersProps) {
    const hasFilters = role !== "" || schoolId !== "" || status !== "";

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* ================= ROLE ================= */}

            <Select value={role || "ALL"}
                onValueChange={(value) => { onRoleChange(value === "ALL" ? "" : (value as UserRole),); }}>

                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="ALL">
                        All Roles
                    </SelectItem>

                    <SelectItem value="SUPER_ADMIN">
                        Super Admin
                    </SelectItem>

                    <SelectItem value="SCHOOL_ADMIN">
                        School Admin
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* ================= SCHOOL ================= */}
            {/* SCHOOL */}
            <Select
                value={schoolId || "ALL"}
                onValueChange={(value) => {
                    if (!value || value === "ALL") {
                        onSchoolChange("");
                        return;
                    }

                    onSchoolChange(value);
                }}
            >
                <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="School" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="ALL">
                        All Schools
                    </SelectItem>

                    {schools.map((school) => (
                        <SelectItem
                            key={school.id}
                            value={school.id}
                        >
                            {school.name} ({school.code})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* ================= STATUS ================= */}

            <Select
                value={status || "ALL"}
                onValueChange={(value) => {
                    onStatusChange(value === "ALL" ? "" : (value as UserStatus),);
                }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="ALL">
                        All Status
                    </SelectItem>

                    <SelectItem value="ACTIVE">
                        Active
                    </SelectItem>

                    <SelectItem value="INACTIVE">
                        Inactive
                    </SelectItem>

                    <SelectItem value="SUSPENDED">
                        Suspended
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* ================= RESET ================= */}

            {
                hasFilters && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onReset}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset Filters
                    </Button>
                )
            }
        </div >
    );
}