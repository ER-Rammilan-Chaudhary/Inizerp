"use client";

import { Clock } from "lucide-react";
import {
    Control,
    FieldPath,
    FieldValues,
} from "react-hook-form";

import FormCard from "../components/FormCard";

import { Input } from "@/components/ui/input";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


interface SchoolTimingSectionProps<T extends FieldValues> {
    control: Control<T>;
}


export default function SchoolTimingSection<
    T extends FieldValues,
>({
    control,
}: SchoolTimingSectionProps<T>) {

    return (
        <FormCard
            title="School Timing"
            description="Set school opening and closing hours."
            icon={
                <Clock className="h-5 w-5 text-orange-600" />
            }
        >

            <div className="grid gap-6 md:grid-cols-2">


                {/* Opening Time */}

                <FormField
                    control={control}
                    name={"startHour" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>
                                Opening Time
                            </FormLabel>


                            <FormControl>

                                <Input
                                    type="time"
                                    {...field}
                                    value={field.value ?? "08:00"}
                                />

                            </FormControl>


                            <FormMessage />

                        </FormItem>
                    )}
                />



                {/* Closing Time */}

                <FormField
                    control={control}
                    name={"closeHour" as FieldPath<T>}
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>
                                Closing Time
                            </FormLabel>


                            <FormControl>

                                <Input
                                    type="time"
                                    {...field}
                                    value={field.value ?? "15:00"}
                                />

                            </FormControl>


                            <FormMessage />

                        </FormItem>
                    )}
                />


            </div>


            <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">

                <p>
                    Example: School operates from 08:00 AM to 03:00 PM.
                </p>

            </div>


        </FormCard>
    );
}