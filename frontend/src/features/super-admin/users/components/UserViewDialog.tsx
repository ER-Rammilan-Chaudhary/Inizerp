"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit } from "lucide-react";
import { User } from "../types/user.types";

interface Props {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UserViewDialog({ user, open, onOpenChange }: Props) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>User Summary</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3 py-2 text-sm">
                    <div className="flex justify-between border-b border-border/60 pb-2">
                        <span className="text-muted-foreground">Full Name</span>
                        <span className="font-semibold text-foreground">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium text-foreground">{user.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium text-foreground">{user.phone || "—"}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                        <span className="text-muted-foreground">Role</span>
                        <span className="font-medium text-foreground">
                            {user.role === "SUPER_ADMIN" ? "Super Admin" : "School Admin"}
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                        <span className="text-muted-foreground">Assigned School</span>
                        <span className="font-medium text-foreground">
                            {user.school?.name || "Global Scope"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-foreground">{user.status}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" asChild onClick={() => onOpenChange(false)}>
                        <Link href={`/super-admin/users/${user.id}/edit`}>
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                        </Link>
                    </Button>
                    <Button size="sm" asChild onClick={() => onOpenChange(false)}>
                        <Link href={`/super-admin/users/${user.id}`}>
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            Full Profile
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}