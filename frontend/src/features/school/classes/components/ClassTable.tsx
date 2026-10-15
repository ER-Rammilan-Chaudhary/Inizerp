"use client";

import {
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import type { Class } from "../types/classes.types";

interface ClassTableProps {
    classes: Class[];
    onDelete: (classItem: Class) => void;
}

export default function ClassTable({
    classes,
    onDelete,
}: ClassTableProps) {
    const router = useRouter();

    if (!classes.length) {
        return (
            <div className="rounded-lg border bg-card p-10 text-center">
                <p className="text-muted-foreground">
                    No classes found.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Sections</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Class Teacher</TableHead>
                        <TableHead className="w-16 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {classes.map((classItem) => {
                        const studentCount =
                            classItem.sections.reduce(
                                (total, section) =>
                                    total + section.studentCount,
                                0,
                            );

                        return (
                            <TableRow key={classItem.id}>
                                <TableCell>
                                    <span className="font-medium">
                                        {classItem.name}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    {classItem.sections.length}
                                </TableCell>

                                <TableCell>
                                    {studentCount}
                                </TableCell>

                                <TableCell>
                                    {classItem.classTeacher?.user
                                        .fullName ?? "Not Assigned"}
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Open actions
                                            </span>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(
                                                        `/school-admin/classes/${classItem.id} `,
                                                    )
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(
                                                        `/school-admin/classes/${classItem.id}/edit`,
                                                    )
                                                }
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem >

                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() =>
                                                    onDelete(classItem)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent >
                                    </DropdownMenu >
                                </TableCell >
                            </TableRow >
                        );
                    })}
                </TableBody >
            </Table >
        </div >
    );
}
