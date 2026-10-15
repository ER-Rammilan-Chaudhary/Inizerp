"use client";

import { Briefcase, Eye, MoreHorizontal, Pencil, Trash2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import type { Parent } from "../types/parents.types";

interface ParentTableProps {
    parents: Parent[];
    onView: (parent: Parent) => void;
    onEdit: (parent: Parent) => void;
    onDelete: (parent: Parent) => void;
}

const getInitials = (name?: string) => {
    if (!name) return "PT";
    return name.trim().split(/\s+/).slice(0, 2).map((item) => item.charAt(0).toUpperCase()).join("");
};

export default function ParentTable({
    parents,
    onView,
    onEdit,
    onDelete,
}: ParentTableProps) {
    if (!parents.length) {
        return (
            <div className="rounded-xl border bg-card p-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                    <Users className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">No Parents Found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    There are no parent records registered in this school or matching the filter.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="py-3.5 font-semibold text-foreground">Parent / Guardian</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Phone</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Occupation</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Linked Students</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Status</TableHead>
                            <TableHead className="w-16 text-right py-3.5 font-semibold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {parents.map((parent) => {
                            const initials = getInitials(parent.user.fullName);
                            const statusColor =
                                parent.user.status === "ACTIVE"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";

                            return (
                                <TableRow key={parent.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full border bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden font-semibold text-xs shadow-xs">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm leading-tight">
                                                    {parent.user.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {parent.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3 text-xs text-foreground">
                                        {parent.user.phone || <span className="text-muted-foreground">--</span>}
                                    </TableCell>

                                    <TableCell className="py-3 text-xs">
                                        {parent.occupation ? (
                                            <div className="flex items-center gap-1.5 text-foreground">
                                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <span>{parent.occupation}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Not provided</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="py-3">
                                        {parent.students?.length ? (
                                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                {parent.students.map((st) => (
                                                    <Badge
                                                        key={st.id}
                                                        variant="outline"
                                                        className="text-[11px] font-medium bg-muted/50 py-0.5 px-2"
                                                    >
                                                        {st.user.fullName}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">None linked</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusColor}`}
                                        >
                                            {parent.user.status}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    />
                                                }
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onView(parent)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => onEdit(parent)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Information
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => onDelete(parent)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Parent
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
