"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AuditLogFilters } from "../types/audit-logs.types";

interface Props {
    filters: AuditLogFilters;
    onChange: (value: Partial<AuditLogFilters>) => void;
    onReset: () => void;
}

export default function AuditLogFilters({
    filters,
    onChange,
    onReset,
}: Props) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            {/* Action */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Action
                </label>

                <Select
                    value={filters.action ?? "all"}
                    onValueChange={(value) =>
                        onChange({
                            action: value === "all" ? undefined : value ?? undefined,
                        })
                    }
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Actions
                        </SelectItem>
                        <SelectItem value="CREATE">
                            Create
                        </SelectItem>
                        <SelectItem value="UPDATE">
                            Update
                        </SelectItem>
                        <SelectItem value="DELETE">
                            Delete
                        </SelectItem>
                        <SelectItem value="LOGIN">
                            Login
                        </SelectItem>
                        <SelectItem value="LOGOUT">
                            Logout
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Module */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Module
                </label>

                <Select
                    value={filters.module ?? "all"}
                    onValueChange={(value) =>
                        onChange({
                            module: value === "all" ? undefined : value ?? undefined,
                        })
                    }
                >

                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Modules
                        </SelectItem>
                        <SelectItem value="AUTH">
                            Auth
                        </SelectItem>
                        <SelectItem value="USER">
                            User
                        </SelectItem>
                        <SelectItem value="SCHOOL">
                            School
                        </SelectItem>
                        <SelectItem value="NOTIFICATION">
                            Notification
                        </SelectItem>
                        <SelectItem value="SUBSCRIPTION">
                            Subscription
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Start Date
                </label>

                <Input
                    type="date"
                    value={filters.from ?? ""}
                    onChange={(event) =>
                        onChange({
                            from: event.target.value || undefined,
                        })
                    }
                    className="w-full sm:w-40"
                />
            </div>

            {/* End Date */}
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    End Date
                </label>

                <Input
                    type="date"
                    value={filters.to ?? ""}
                    onChange={(event) =>
                        onChange({
                            to: event.target.value || undefined,
                        })
                    }
                    className="w-full sm:w-40"
                />
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={onReset}
            >
                Reset
            </Button>
        </div>
    );
}
