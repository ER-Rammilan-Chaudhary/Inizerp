"use client";

import { useEffect, useState } from "react";
import { Briefcase, DollarSign, Eye, EyeOff, Loader2, Mail, MapPin, Phone, Shield, User, Users, } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/features/school/students/hooks/useStudents";
import type { CreateParentPayload, Parent, UpdateParentPayload, } from "../types/parents.types";

interface ParentFormProps {
    parentItem?: Parent | null;
    loading?: boolean;
    onSubmit: (payload: CreateParentPayload | UpdateParentPayload,) => void | Promise<void>;
    onCancel?: () => void;
}

export default function ParentForm({
    parentItem,
    loading = false,
    onSubmit,
    onCancel,
}: ParentFormProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [occupation, setOccupation] = useState("");
    const [address, setAddress] = useState("");
    const [annualIncome, setAnnualIncome] = useState<string>("");
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    const studentsQuery = useStudents({ limit: 100 });
    const students = studentsQuery.data?.data.items ?? [];

    useEffect(() => {
        if (parentItem) {
            setFullName(parentItem.user.fullName ?? "");
            setEmail(parentItem.user.email ?? "");
            setPhone(parentItem.user.phone ?? "");
            setOccupation(parentItem.occupation ?? "");
            setAddress(parentItem.address ?? "");
            setAnnualIncome(parentItem.annualIncome !== null && parentItem.annualIncome !== undefined ? String(parentItem.annualIncome) : "",);
            setSelectedStudentIds(parentItem.students?.map((s) => s.id) ?? []);
            setPassword("");
        } else {
            setFullName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setOccupation("");
            setAddress("");
            setAnnualIncome("");
            setSelectedStudentIds([]);
        }
    }, [parentItem]);

    const handleToggleStudent = (studentId: string) => {
        setSelectedStudentIds((prev) => prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = fullName.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName || !trimmedEmail) return;

        const incomeNumber = annualIncome.trim() ? Number(annualIncome) : null;

        if (parentItem) {
            const payload: UpdateParentPayload = {
                fullName: trimmedName,
                email: trimmedEmail,
                phone: phone.trim() || null,
                occupation: occupation.trim() || null,
                address: address.trim() || null,
                annualIncome: incomeNumber,
                studentIds: selectedStudentIds,
                ...(password.trim() ? { password } : {}),
            };
            await onSubmit(payload);
        } else {
            if (!password.trim()) return;

            const payload: CreateParentPayload = {
                fullName: trimmedName,
                email: trimmedEmail,
                phone: phone.trim() || null,
                password,
                occupation: occupation.trim() || null,
                address: address.trim() || null,
                annualIncome: incomeNumber,
                studentIds: selectedStudentIds,
            };
            await onSubmit(payload);
        }
    };

    const isSubmitting = loading;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
                {/* Personal & Account Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="parent-fullName" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <User className="h-3.5 w-3.5 text-primary" />
                            Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="parent-fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Robert Smith"
                            required
                            disabled={isSubmitting}
                            className="h-10 text-sm bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent-email" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <Mail className="h-3.5 w-3.5 text-primary" />
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="parent-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="parent@example.com"
                            required
                            disabled={isSubmitting}
                            className="h-10 text-sm bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent-phone" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            Contact Phone
                        </Label>
                        <Input
                            id="parent-phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            disabled={isSubmitting}
                            className="h-10 text-sm bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent-password" className="text-xs font-semibold flex items-center justify-between text-foreground">
                            <span>
                                {parentItem ? "New Password" : "Password"}{" "}
                                {!parentItem && <span className="text-destructive">*</span>}
                            </span>
                            {parentItem && (
                                <span className="text-[11px] text-muted-foreground font-normal">Leave blank to retain</span>
                            )}
                        </Label>
                        <div className="relative">
                            <Input
                                id="parent-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={parentItem ? "•••••••• (unchanged)" : "Min. 8 characters"}
                                required={!parentItem}
                                minLength={8}
                                disabled={isSubmitting}
                                className="h-10 pr-10 text-sm bg-background"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Professional & Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-2">
                        <Label htmlFor="parent-occupation" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            Occupation / Profession
                        </Label>
                        <Input
                            id="parent-occupation"
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            placeholder="e.g. Software Engineer, Doctor"
                            disabled={isSubmitting}
                            className="h-10 text-sm bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent-annualIncome" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            Annual Income ($)
                        </Label>
                        <Input
                            id="parent-annualIncome"
                            type="number"
                            min="0"
                            step="1000"
                            value={annualIncome}
                            onChange={(e) => setAnnualIncome(e.target.value)}
                            placeholder="e.g. 75000"
                            disabled={isSubmitting}
                            className="h-10 text-sm bg-background"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="parent-address" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Residential Address
                        </Label>
                        <Input
                            id="parent-address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street, City, Postal Code"
                            disabled={isSubmitting}
                            className="h-10 text-sm bg-background"
                        />
                    </div>
                </div>

                {/* Student Associations */}
                <div className="space-y-2.5 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            Associate Students ({selectedStudentIds.length} Selected)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">
                            Select one or more students
                        </span>
                    </div>

                    {studentsQuery.isLoading ? (
                        <div className="rounded-lg border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                            Loading student directory...
                        </div>
                    ) : students.length === 0 ? (
                        <div className="rounded-lg border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                            No students registered in the system yet.
                        </div>
                    ) : (
                        <div className="rounded-lg border bg-card p-3 max-h-48 overflow-y-auto space-y-1.5">
                            {students.map((st) => {
                                const isChecked = selectedStudentIds.includes(st.id);
                                return (
                                    <label
                                        key={st.id}
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition text-xs ${isChecked
                                            ? "bg-primary/10 border border-primary/20"
                                            : "hover:bg-muted/50 border border-transparent"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleStudent(st.id)}
                                                className="rounded border-input text-primary focus:ring-primary"
                                            />
                                            <div>
                                                <span className="font-semibold text-foreground">
                                                    {st.user.fullName}
                                                </span>
                                                <span className="text-muted-foreground ml-2 text-[11px]">
                                                    ({st.admissionNo})
                                                </span>
                                            </div>
                                        </div>
                                        {isChecked && (
                                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                                                Linked
                                            </Badge>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting || !fullName.trim() || !email.trim() || (!parentItem && !password.trim())}
                    className="min-w-[130px] shadow-sm font-medium"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {parentItem ? "Update Parent" : "Register Parent"}
                </Button>
            </div>
        </form>
    );
}
