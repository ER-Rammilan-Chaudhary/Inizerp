"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    TimetableDay,
    TimetableListParams,
    TimetableTeacher,
    TimetableSubject,
} from "../types/timetables.types";

interface TimetableFiltersProps {
    filters: TimetableListParams;
    teachers: TimetableTeacher[];
    subjects: TimetableSubject[];
    classes: {
        id: string;
        name: string;
    }[];
    sections: {
        id: string;
        name: string;
    }[];
    academicYears: {
        id: string;
        name: string;
        code: string;
    }[];
    onChange: (filters: TimetableListParams) => void;
    onClear: () => void;
}

const days: TimetableDay[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
];

const dayLabels: Record<TimetableDay, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
};

export default function TimetableFilters({
    filters,
    teachers,
    subjects,
    classes,
    sections,
    academicYears,
    onChange,
    onClear,
}: TimetableFiltersProps) {
    const updateFilter = (
        key: keyof TimetableListParams,
        value: string,
    ) => {
        onChange({
            ...filters,
            page: 1,
            [key]: value || undefined,
        });
    };

    const hasFilters =
        Boolean(filters.academicYearId) ||
        Boolean(filters.classId) ||
        Boolean(filters.sectionId) ||
        Boolean(filters.subjectId) ||
        Boolean(filters.teacherId) ||
        Boolean(filters.day) ||
        Boolean(filters.period);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <Select
                value={filters.academicYearId ?? "all"}
                onValueChange={(value) =>
                    updateFilter(
                        "academicYearId",
                        value === "none" || value === null ? "" : value,
                    )
                }
            >
                <SelectTrigger className="w-[210px]">
                    <SelectValue placeholder="Academic year" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All academic years</SelectItem>

                    {academicYears.map((academicYear) => (
                        <SelectItem
                            key={academicYear.id}
                            value={academicYear.id}
                        >
                            {academicYear.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.classId ?? "all"}
                onValueChange={(value) =>
                    updateFilter("classId", value === "none" || value === null ? "" : value,
                    )
                }
            >
                <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Class" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All classes</SelectItem>

                    {classes.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.sectionId ?? "all"}
                onValueChange={(value) =>
                    updateFilter(
                        "sectionId",
                        value === "none" || value === null ? "" : value,
                    )
                }
            >
                <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Section" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>

                    {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                            {section.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.subjectId ?? "all"}
                onValueChange={(value) =>
                    updateFilter(
                        "subjectId",
                        value === "none" || value === null ? "" : value,
                    )
                }
            >
                <SelectTrigger className="w-[190px]">
                    <SelectValue placeholder="Subject" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All subjects</SelectItem>

                    {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.teacherId ?? "all"}
                onValueChange={(value) =>
                    updateFilter(
                        "teacherId",
                        value === "none" || value === null ? "" : value,
                    )
                }
            >
                <SelectTrigger className="w-[210px]">
                    <SelectValue placeholder="Teacher">
                        {filters.teacherId
                            ? teachers.find(
                                (teacher) => teacher.id === filters.teacherId,
                            )?.user.fullName ?? "Teacher"
                            : "All teachers"}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All teachers</SelectItem>

                    {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.user.fullName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.day ?? "all"}
                onValueChange={(value) =>
                    updateFilter(
                        "day",
                        value === "none" || value === null ? "" : value,
                    )
                }
            >
                <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Day">
                        {filters.day
                            ? dayLabels[filters.day]
                            : "All days"}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All days</SelectItem>

                    {days.map((day) => (
                        <SelectItem key={day} value={day}>
                            {dayLabels[day]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={
                    filters.period !== undefined
                        ? String(filters.period)
                        : "all"
                }
                onValueChange={(value) =>
                    onChange({
                        ...filters,
                        page: 1,
                        period:
                            value === "all" ? undefined : Number(value),
                    })
                }
            >
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Period" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All periods</SelectItem>

                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                        (period) => (
                            <SelectItem key={period} value={String(period)}>
                                Period {period}
                            </SelectItem>
                        ),
                    )}
                </SelectContent>
            </Select>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}