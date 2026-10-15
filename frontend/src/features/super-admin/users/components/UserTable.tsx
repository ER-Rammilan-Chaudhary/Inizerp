"use client";
import { MoreHorizontal, Eye, Pencil, KeyRound, Trash2, } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { User } from "../types/user.types";



const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getAvatarUrl = (avatar?: string | null) => {
    if (!avatar) { return "/default-avatar.png"; }
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) { return avatar; }

    // Backend returned relative path:
    return `${API_URL}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
};


const statusClass: Record<User["status"], string> = {
    ACTIVE: "bg-green-100 text-green-700 hover:bg-green-100",
    INACTIVE: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    SUSPENDED: "bg-red-100 text-red-700 hover:bg-red-100",
};


const formatDate = (date: string | null) => {
    if (!date) {
        return "Never";
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(parsedDate);


};

const getInitials = (name: string) => {
    return (
        name?.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase() || "U")
};

interface UserTableProps { users: User[]; onView: (user: User) => void; onEdit: (user: User) => void; onResetPassword: (user: User) => void; onDelete: (user: User) => void; }


export default function UserTable({ users, onView, onEdit, onResetPassword, onDelete, }: UserTableProps) {
    return (
        <div className="rounded-xl border bg-background overflow-x-auto">
            <div className="min-w-[650px]">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="h-32 text-center text-muted-foreground"
                            >
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => {
                            const imageUrl = getAvatarUrl(
                                user.avatar,
                            );

                            return (
                                <TableRow key={user.id}>
                                    {/* USER */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage
                                                    src={imageUrl}
                                                    alt={user.fullName}
                                                />

                                                <AvatarFallback>
                                                    {getInitials(
                                                        user.fullName,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {user.fullName}
                                                </p>

                                                <p className="truncate text-sm text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* ROLE */}
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {user.role ===
                                                "SCHOOL_ADMIN"
                                                ? "School Admin"
                                                : "Super Admin"}
                                        </Badge>
                                    </TableCell>

                                    {/* SCHOOL */}
                                    <TableCell>
                                        {user.school ? (
                                            <div>
                                                <p className="font-medium">
                                                    {user.school.name}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {user.school.code}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <Badge
                                            className={
                                                statusClass[
                                                user.status
                                                ]
                                            }
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>

                                    {/* LAST LOGIN */}
                                    <TableCell>
                                        <span className="text-sm">
                                            {formatDate(
                                                user.lastLoginAt,
                                            )}
                                        </span>
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="User actions"
                                                    />
                                                }
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onView(user)
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onEdit(user)
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onResetPassword(
                                                            user,
                                                        )
                                                    }
                                                >
                                                    <KeyRound className="mr-2 h-4 w-4" />
                                                    Reset Password
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() =>
                                                        onDelete(user)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}


