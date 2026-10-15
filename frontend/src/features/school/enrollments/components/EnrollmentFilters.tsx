"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatClassName, formatSectionName } from "@/lib/utils";
import type { EnrollmentListParams, EnrollmentStatus } from "../types/enrollments.types";

interface AcademicYearOption {
  id: string;
  name: string;
  code: string;
  isCurrent: boolean;
}

interface ClassOption {
  id: string;
  name: string;
}

interface SectionOption {
  id: string;
  name: string;
  classId: string;
}

interface EnrollmentFiltersProps {
  filters: EnrollmentListParams;
  onChange: (filters: EnrollmentListParams) => void;
  academicYears: AcademicYearOption[];
  classes: ClassOption[];
  sections: SectionOption[];
}

export function EnrollmentFilters({
  filters,
  onChange,
  academicYears,
  classes,
  sections,
}: EnrollmentFiltersProps) {
  // If a class is selected, filter sections for that class.
  const filteredSections = useMemo(() => {
    if (!filters.classId) return [];
    return sections.filter((sec) => sec.classId === filters.classId);
  }, [sections, filters.classId]);

  // If no class is selected, get unique distinct section names so Section A doesn't repeat multiple times
  const uniqueSectionNames = useMemo(() => {
    const names = new Set<string>();
    sections.forEach((sec) => {
      const clean = sec.name?.trim();
      if (clean) names.add(clean);
    });
    return Array.from(names).sort();
  }, [sections]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, academicYearId: e.target.value || undefined });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value || undefined;
    onChange({
      ...filters,
      classId,
      sectionId: undefined,
      sectionName: undefined,
    });
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onChange({ ...filters, sectionId: undefined, sectionName: undefined });
    } else if (val.startsWith("id:")) {
      onChange({
        ...filters,
        sectionId: val.replace("id:", ""),
        sectionName: undefined,
      });
    } else if (val.startsWith("name:")) {
      onChange({
        ...filters,
        sectionId: undefined,
        sectionName: val.replace("name:", ""),
      });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      status: (e.target.value || undefined) as EnrollmentStatus | undefined,
    });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Boolean(
    filters.academicYearId ||
    filters.classId ||
    filters.sectionId ||
    filters.sectionName ||
    filters.status ||
    filters.search,
  );

  const currentSectionValue = filters.sectionId
    ? `id:${filters.sectionId}`
    : filters.sectionName
      ? `name:${filters.sectionName}`
      : "";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
      {/* Academic Session */}
      <div>
        <select
          value={filters.academicYearId ?? ""}
          onChange={handleYearChange}
          aria-label="Filter by Academic Session"
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Sessions</option>
          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              ({year.code}) {year.isCurrent ? "★ Current" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Class */}
      <div>
        <select
          value={filters.classId ?? ""}
          onChange={handleClassChange}
          aria-label="Filter by Class"
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Classes</option>
          {classes.map((c) => {
            // const secCount = sections.filter((s) => s.classId === c.id).length;
            return (
              <option key={c.id} value={c.id}>
                {formatClassName(c.name)}
              </option>
            );
          })}
        </select>
      </div>

      {/* Section */}
      <div>
        <select
          value={currentSectionValue}
          onChange={handleSectionChange}
          aria-label="Filter by Section"
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Sections</option>
          {filters.classId
            ? filteredSections.map((s) => (
              <option key={s.id} value={`id:${s.id}`}>
                {formatSectionName(s.name)}
              </option>
            ))
            : uniqueSectionNames.map((name) => (
              <option key={name} value={`name:${name}`}>
                {formatSectionName(name)}
              </option>
            ))}
        </select>
      </div>

      {/* Status */}
      <div className="flex gap-2">
        <select
          value={filters.status ?? ""}
          onChange={handleStatusChange}
          aria-label="Filter by Enrollment Status"
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed (Promoted)</option>
          <option value="WITHDRAWN">Withdrawn</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
