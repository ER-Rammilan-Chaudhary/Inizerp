"use client";

import {
    useEffect,
    useState,
} from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ClassSection } from "../types/classes.types";

export interface SectionFormPayload {
    name: string;
    capacity: number | null;
}

interface SectionFormProps {
    section?: ClassSection | null;
    loading?: boolean;
    onSubmit: (
        payload: SectionFormPayload,
    ) => void | Promise<void>;
    onCancel: () => void;
}

export default function SectionForm({
    section,
    loading = false,
    onSubmit,
    onCancel,
}: SectionFormProps) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] =
        useState("");

    useEffect(() => {
        setName(section?.name ?? "");
        setCapacity(
            section?.capacity != null
                ? String(section.capacity)
                : "",
        );
    }, [section]);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        const trimmedCapacity =
            capacity.trim();

        const parsedCapacity =
            trimmedCapacity === ""
                ? null
                : Number(trimmedCapacity);

        if (
            parsedCapacity !== null &&
            (!Number.isInteger(parsedCapacity) ||
                parsedCapacity <= 0 ||
                parsedCapacity > 100000)
        ) {
            return;
        }

        await onSubmit({
            name: trimmedName,
            capacity: parsedCapacity,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Label htmlFor="section-name">
                    Section Name
                </Label>
                <Input
                    id="section-name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    placeholder="Example: A"
                    maxLength={100}
                    disabled={loading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="section-capacity">
                    Capacity
                </Label>
                <Input
                    id="section-capacity"
                    type="number"
                    min={1}
                    max={100000}
                    step={1}
                    value={capacity}
                    onChange={(event) =>
                        setCapacity(event.target.value)
                    }
                    placeholder="Example: 40"
                    disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                    Leave empty for unlimited
                    capacity.
                </p>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        loading || !name.trim()
                    }
                >
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {section
                        ? "Update Section"
                        : "Add Section"}
                </Button>
            </div>
        </form>
    );
}

