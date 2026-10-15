"use client";

import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { useState } from "react";
import FormCard from "../components/FormCard";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface SchoolAdminSectionProps<T extends FieldValues> {
    control: Control<T>;
}

export default function SchoolAdminSection<
    T extends FieldValues,
>({
    control,
}: SchoolAdminSectionProps<T>) {


    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormCard
            title="School Administrator"
            description="Create the primary administrator account for this school."
            icon={<User className="h-5 w-5 text-emerald-600" />}
        >
            {/* Admin Name */}

            <FormField
                control={control}
                name={"ownerName" as FieldPath<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Administrator Name</FormLabel>

                        <FormControl>
                            <Input
                                placeholder="Rahul Sharma"
                                {...field}
                                value={field.value ?? ""}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Email + Phone */}

            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    control={control}
                    name={"ownerEmail" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </FormLabel>

                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="admin@school.com"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={"ownerPhone" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                            </FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="+91 9876543210"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Password section Part 2 me add hoga */}
            {/* Password */}

            <FormField
                control={control}
                name={"ownerPassword" as FieldPath<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password
                        </FormLabel>

                        <FormControl>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter administrator password"
                                    {...field}
                                    value={field.value ?? ""}
                                    className="pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </FormControl>

                        <p className="text-xs text-muted-foreground">
                            Password must contain at least 6 characters.
                        </p>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </FormCard>
    );
}