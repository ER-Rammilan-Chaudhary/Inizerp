"use client";

import { Palette } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function ColorPicker({
    label,
    value,
    onChange,
    disabled = false,
}: ColorPickerProps) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            <div className="flex items-center gap-3">
                {/* Color Preview */}
                <label className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-background shadow-sm transition hover:scale-105">
                    <input
                        type="color"
                        value={value || "#2563eb"}
                        disabled={disabled}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                    />

                    <div
                        className="h-full w-full"
                        style={{
                            backgroundColor: value || "#2563eb",
                        }}
                    />
                </label>

                {/* Hex Value */}
                <div className="relative flex-1">
                    <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={value}
                        disabled={disabled}
                        placeholder="#2563eb"
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10 uppercase"
                    />
                </div>
            </div>
        </div>
    );
}