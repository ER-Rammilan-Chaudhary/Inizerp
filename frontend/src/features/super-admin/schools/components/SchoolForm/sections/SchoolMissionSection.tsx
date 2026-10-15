"use client";

import { Target, Eye } from "lucide-react";
import {
    Control,
    FieldPath,
    FieldValues,
} from "react-hook-form";

import FormCard from "../components/FormCard";

import { Textarea } from "@/components/ui/textarea";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


interface SchoolMissionSectionProps<T extends FieldValues> {
    control: Control<T>;
}


export default function SchoolMissionSection<
    T extends FieldValues,
>({
    control,
}: SchoolMissionSectionProps<T>) {


    return (
        <FormCard
            title="Mission & Vision"
            description="Define the purpose and future goals of the school."
            icon={
                <Target className="h-5 w-5 text-orange-600" />
            }
        >


            {/* Mission */}


            <FormField
                control={control}
                name={"missionStatement" as FieldPath<T>}
                render={({ field }) => (
                    <FormItem>


                        <FormLabel className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Mission Statement
                        </FormLabel>


                        <FormControl>

                            <Textarea
                                rows={5}
                                placeholder="Provide quality education and build future leaders..."
                                {...field}
                                value={field.value ?? ""}
                            />

                        </FormControl>


                        <FormMessage />


                    </FormItem>
                )}
            />



            {/* Vision */}


            <FormField
                control={control}
                name={"visionStatement" as FieldPath<T>}
                render={({ field }) => (
                    <FormItem>


                        <FormLabel className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Vision Statement
                        </FormLabel>


                        <FormControl>

                            <Textarea
                                rows={5}
                                placeholder="Our vision is to create innovative and responsible students..."
                                {...field}
                                value={field.value ?? ""}
                            />

                        </FormControl>


                        <FormMessage />


                    </FormItem>
                )}
            />



        </FormCard>
    );
}