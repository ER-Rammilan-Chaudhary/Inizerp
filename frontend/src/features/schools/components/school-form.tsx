"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  CreateSchoolDto,
  School,
} from "@/types/school";

const schoolSchema = z.object({
  name: z.string().min(3, "School name is required"),

  email: z.string().email().optional().or(z.literal("")),

  phone: z.string().optional(),

  address: z.string().optional(),

  principal: z.string().optional(),

  logo: z.string().optional(),

  slogan: z.string().optional(),

  missionStatement: z.string().optional(),

  visionStatement: z.string().optional(),

  primaryColor: z.string().optional(),

  secondaryColor: z.string().optional(),

  startHour: z.string().optional(),

  closeHour: z.string().optional(),
});

type FormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  initialData?: School;

  loading?: boolean;

  onSubmit: (data: CreateSchoolDto) => Promise<void>;
}

export default function SchoolForm({
  initialData,
  loading = false,
  onSubmit,
}: SchoolFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schoolSchema),

    defaultValues: {
      name: "",

      email: "",

      phone: "",

      address: "",

      principal: "",

      logo: "",

      slogan: "",

      missionStatement: "",

      visionStatement: "",

      primaryColor: "#2563eb",

      secondaryColor: "#0f172a",

      startHour: "08:00",

      closeHour: "15:00",
    },
  });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      name: initialData.name,

      email: initialData.email ?? "",

      phone: initialData.phone ?? "",

      address: initialData.address ?? "",

      principal: initialData.principal ?? "",

      logo: initialData.logo ?? "",

      slogan: initialData.slogan ?? "",

      missionStatement:
        initialData.missionStatement ?? "",

      visionStatement:
        initialData.visionStatement ?? "",

      primaryColor:
        initialData.primaryColor ?? "#2563eb",

      secondaryColor:
        initialData.secondaryColor ?? "#0f172a",

      startHour: initialData.startHour ?? "",

      closeHour: initialData.closeHour ?? "",
    });
  }, [initialData, form]);

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="School Name"
          {...form.register("name")}
        />

        <Input
          placeholder="Email"
          {...form.register("email")}
        />

        <Input
          placeholder="Phone"
          {...form.register("phone")}
        />

        <Input
          placeholder="Principal"
          {...form.register("principal")}
        />

        <Input
          placeholder="Address"
          {...form.register("address")}
        />

        <Input
          placeholder="Logo URL"
          {...form.register("logo")}
        />

        <Input
          type="color"
          {...form.register("primaryColor")}
        />

        <Input
          type="color"
          {...form.register("secondaryColor")}
        />

        <Input
          type="time"
          {...form.register("startHour")}
        />

        <Input
          type="time"
          {...form.register("closeHour")}
        />
      </div>

      <Input
        placeholder="School Slogan"
        {...form.register("slogan")}
      />

      <textarea
        rows={3}
        placeholder="Mission Statement"
        className="min-h-24 w-full rounded-md border bg-background p-3 text-sm outline-none"
        {...form.register("missionStatement")}
      />

      <textarea
        rows={3}
        placeholder="Vision Statement"
        className="min-h-24 w-full rounded-md border bg-background p-3 text-sm outline-none"
        {...form.register("visionStatement")}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Saving..."
          : initialData
            ? "Update School"
            : "Create School"}
      </Button>
    </form>
  );
}