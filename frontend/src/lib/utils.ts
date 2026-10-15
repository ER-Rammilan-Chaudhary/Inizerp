import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatClassName(name?: string | null): string {
  if (!name) return "";
  const trimmed = name.trim();
  // Strip repeated "Class " prefixes if present (e.g., "Class Class 9" -> "9")
  const stripped = trimmed.replace(/^(class\s+)+/i, "");
  // If it starts with Grade/Standard/Std, preserve it
  if (/^(grade|standard|std)\b/i.test(trimmed)) {
    return trimmed;
  }
  return `Class ${stripped || trimmed}`;
}

export function formatSectionName(name?: string | null): string {
  if (!name) return "";
  const trimmed = name.trim();
  // Strip repeated "Section " prefixes if present (e.g., "Section Section A" -> "A")
  const stripped = trimmed.replace(/^(section\s+)+/i, "");
  return `Section ${stripped || trimmed}`;
}

