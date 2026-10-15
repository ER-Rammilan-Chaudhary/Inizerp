"use client";
import { useState, } from "react";
import { Loader2, } from "lucide-react";
import { toast, } from "sonner";
import { Button, } from "@/components/ui/button";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { User, UserStatus, } from "../types/user.types";
import { useUpdateUser, } from "../hooks/useUsers";
import { getErrorMessage } from "@/lib/error-message";

interface School { id: string; name: string; code: string; }
interface UserEditFormProps { user: User; schools: School[]; onSuccess: () => void; onCancel: () => void; }
type FormData = { fullName: string; email: string; phone: string; avatar: string; status: UserStatus; schoolId: string; };

export default function UserEditForm({ user, schools, onSuccess, onCancel, }: UserEditFormProps) {
    const updateMutation = useUpdateUser();
    const [form, setForm] = useState<FormData>(() => ({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        avatar: user.avatar ?? "",
        status: user.status,
        schoolId: user.schoolId ?? "",
    }));

    // INPUT CHANGE
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>,) => {
        const { name, value, } = e.target;
        setForm((prev) => ({ ...prev, [name]: value, }));
    };
    // SUBMIT
    const handleSubmit = async (e: React.FormEvent,) => {
        e.preventDefault();
        if (!form.fullName.trim()) { toast.error("Full name is required",); return; }
        if (!form.email.trim()) { toast.error("Email is required",); return; }
        try {
            await updateMutation.mutateAsync({
                id: user.id, data: { fullName: form.fullName.trim(), email: form.email.trim().toLowerCase(), status: form.status, schoolId: form.schoolId || undefined, },
            });
            toast.success("User updated successfully",); onSuccess();
        }
        catch (error: unknown) { toast.error(getErrorMessage(error, "Failed to update user"),); }
    };


    // ====================================================
    // SUPER ADMIN
    // ====================================================

    if (user.role === "SUPER_ADMIN") {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="font-medium"> Super Admin editing is not supported. </p >
                    <p className="mt-2 text-sm text-muted-foreground"> Current backend update flow supports School Admin. </p >
                    <Button className="mt-4" variant="outline" onClick={onCancel}>
                        Back
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle > User Information </CardTitle >
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName"> Full Name </Label >
                        <Input
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                        />
                    </div>

                    {/* Email */}

                    <div className="space-y-2">
                        <Label htmlFor="email"> Email </Label >
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />
                    </div>

                    {/* Phone */}

                    <div className="space-y-2">
                        <Label htmlFor="phone"> Phone </Label >
                        <Input id="phone" name="phone" value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone"
                        />
                    </div>

                    {/* Avatar */}

                    <div className="space-y-2">
                        <Label htmlFor="avatar"> Avatar URL </Label >
                        <Input id="avatar" name="avatar" value={form.avatar}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    {/* Status */}

                    <div className="space-y-2">
                        <Label > Status </Label >
                        <Select value={form.status}
                            onValueChange={(value,) => {
                                if (!value) return;
                                setForm((prev) => ({ ...prev, status: value as UserStatus, }),);
                            }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
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
                    </div>

                    {/* School */}

                    <div className="space-y-2">
                        <Label > School </Label >
                        <Select value={form.schoolId || "NONE"}
                            onValueChange={(value,) => {
                                setForm((prev) => ({
                                    ...prev, schoolId: value === "NONE" ? "" : value ?? "",
                                }),);
                            }}>

                            <SelectTrigger>
                                <SelectValue placeholder="Select school" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="NONE">
                                    No School
                                </SelectItem>

                                {schools.map(
                                    (school) => (
                                        <SelectItem key={school.id}
                                            value={school.id}> {school.name}{" "}
                                            ( {school.code})
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="outline" disabled={updateMutation.isPending}
                            onClick={onCancel}> Cancel </Button >
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button >
                    </div>
                </CardContent>
            </Card>
        </form >
    );
}