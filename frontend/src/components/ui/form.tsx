import * as React from "react";
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return <Controller {...props} />;
};

const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
    />
));
FormItem.displayName = "FormItem";


const FormLabel = ({
    className,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label
        className={cn("text-sm font-medium", className)}
        {...props}
    />
);


const FormControl = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <div ref={ref} {...props} />
));
FormControl.displayName = "FormControl";


const FormMessage = () => {
    const { formState } = useFormContext();

    return (
        <p className="text-sm text-red-500">
            {formState.errors && ""}
        </p>
    );
};


export {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
};