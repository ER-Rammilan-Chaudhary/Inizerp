"use client";

import { Palette, ImageIcon } from "lucide-react";
import {
    Control,
    FieldPath,
    FieldValues,
} from "react-hook-form";

import FormCard from "../components/FormCard";
import ColorPicker from "../components/ColorPicker";

import { Input } from "@/components/ui/input";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface SchoolBrandingSectionProps<T extends FieldValues> {
    control: Control<T>;
}

export default function SchoolBrandingSection<
    T extends FieldValues,
>({
    control,
}: SchoolBrandingSectionProps<T>) {

    return (
        <FormCard
            title="School Branding"
            description="Customize school appearance and identity."
            icon={
                <Palette className="h-5 w-5 text-purple-600" />
            }
        >

            {/* Logo Upload */}

            <FormField
                control={control}
                name={"logo" as FieldPath<T>}
                render={({ field: { onChange } }) => (
                    <FormItem>

                        <FormLabel className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            School Logo
                        </FormLabel>

                        <FormControl>

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                }}
                            />

                        </FormControl>

                        <p className="text-xs text-muted-foreground">
                            Upload PNG, JPG or WEBP logo.
                        </p>

                        <FormMessage />

                    </FormItem>
                )}
            />

            {/* Colors */}

            <div className="grid gap-6 md:grid-cols-2">

                <FormField
                    control={control}
                    name={"primaryColor" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>

                            <FormControl>

                                <ColorPicker
                                    label="Primary Color"
                                    value={field.value ?? "#2563eb"}
                                    onChange={field.onChange}
                                />

                            </FormControl>

                            <FormMessage />

                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={"secondaryColor" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>

                            <FormControl>

                                <ColorPicker
                                    label="Secondary Color"
                                    value={field.value ?? "#ffffff"}
                                    onChange={field.onChange}
                                />

                            </FormControl>

                            <FormMessage />

                        </FormItem>
                    )}
                />

            </div>

            {/* Slogan */}

            <FormField
                control={control}
                name={"slogan" as FieldPath<T>}
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>
                            School Slogan
                        </FormLabel>

                        <FormControl>

                            <Input
                                placeholder="Knowledge is Power"
                                {...field}
                                value={field.value ?? ""}
                            />

                        </FormControl>

                        <FormMessage />

                    </FormItem>
                )}
            />

            {/* Live Preview */}

            <div className="rounded-xl border bg-muted/40 p-5">

                <p className="mb-3 text-sm font-medium">
                    Branding Preview
                </p>

                <div className="flex items-center gap-4">

                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl text-white"
                        style={{
                            backgroundColor: "#2563eb"
                        }}
                    >

                        <Palette
                            className="h-7 w-7"
                        />

                    </div>

                    <div>

                        <h3 className="font-semibold">
                            School Name
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Your slogan appears here
                        </p>

                    </div>

                </div>

            </div>

        </FormCard>
    );
}