"use client";

import {
    Briefcase,
    Calendar,
    DollarSign,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    User,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Parent } from "../types/parents.types";

interface ParentDetailsDialogProps {
    open: boolean;
    parentItem: Parent | null;
    onOpenChange: (open: boolean) => void;
    onEdit?: (parent: Parent) => void;
}

export default function ParentDetailsDialog({
    open,
    parentItem,
    onOpenChange,
    onEdit,
}: ParentDetailsDialogProps) {
    if (!parentItem) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
                            {parentItem.user.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground">
                                {parentItem.user.fullName}
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Parent / Guardian Profile • Role: {parentItem.user.role}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Contact & Professional Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div className="rounded-lg border bg-card p-3 space-y-1">
                            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                <Mail className="h-3.5 w-3.5 text-primary" />
                                Email Address
                            </span>
                            <p className="font-semibold text-foreground truncate">
                                {parentItem.user.email}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-3 space-y-1">
                            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                <Phone className="h-3.5 w-3.5 text-primary" />
                                Phone Number
                            </span>
                            <p className="font-semibold text-foreground">
                                {parentItem.user.phone || "--"}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-3 space-y-1">
                            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                <Briefcase className="h-3.5 w-3.5 text-primary" />
                                Profession
                            </span>
                            <p className="font-semibold text-foreground">
                                {parentItem.occupation || "Not Specified"}
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-3 space-y-1">
                            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                <DollarSign className="h-3.5 w-3.5 text-primary" />
                                Annual Income
                            </span>
                            <p className="font-semibold text-foreground">
                                {parentItem.annualIncome !== null && parentItem.annualIncome !== undefined
                                    ? `$${parentItem.annualIncome.toLocaleString()}`
                                    : "Not Disclosed"}
                            </p>
                        </div>

                        {parentItem.address && (
                            <div className="rounded-lg border bg-card p-3 sm:col-span-2 space-y-1">
                                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    Address
                                </span>
                                <p className="font-semibold text-foreground">
                                    {parentItem.address}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Associated Students */}
                    <div className="space-y-2.5 pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Associated Students ({parentItem.students?.length ?? 0})
                            </h4>
                        </div>

                        {parentItem.students?.length ? (
                            <div className="space-y-2">
                                {parentItem.students.map((st) => (
                                    <div
                                        key={st.id}
                                        className="rounded-lg border bg-card p-3 flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                {st.user.fullName.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {st.user.fullName}
                                                </p>
                                                <p className="text-muted-foreground text-[11px]">
                                                    Admission #{st.admissionNo} • Roll: {st.rollNo || "--"}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">
                                            {st.gender || "Student"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                                No students currently linked to this parent account.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-muted/20 border-t border-border flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    {onEdit && (
                        <Button
                            type="button"
                            onClick={() => {
                                onOpenChange(false);
                                onEdit(parentItem);
                            }}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
