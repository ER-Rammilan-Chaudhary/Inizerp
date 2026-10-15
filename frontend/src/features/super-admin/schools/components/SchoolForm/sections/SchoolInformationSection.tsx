"use client";

import { School, Mail, Phone } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import FormCard from "../components/FormCard";

import { Input } from "@/components/ui/input";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface SchoolInformationSectionProps<T extends FieldValues> {
    control: Control<T>;
}

export default function SchoolInformationSection<T extends FieldValues,>({ control, }: SchoolInformationSectionProps<T>) {

    return (
        <FormCard
            title="School Information"
            description="Basic details about the school."
            icon={<School className="h-5 w-5 text-primary" />}
        >
            {/* School Name */}

            <FormField
                control={control}
                name={"name" as FieldPath<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>School Name</FormLabel>

                        <FormControl>
                            <Input placeholder="Delhi Public School"
                                {...field} value={field.value ?? ""}
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
                    name={"email" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                School Email
                            </FormLabel>

                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="info@school.com"
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
                    name={"phone" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                School Phone
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

                {/* Address */}

                <FormField
                    control={control}
                    name={"address" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>School Address</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="Enter school physical address"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Principal */}

                <FormField
                    control={control}
                    name={"principal" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Principal Name</FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="e.g. Dr. Ramesh Sharma"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </FormCard>
    );
}

