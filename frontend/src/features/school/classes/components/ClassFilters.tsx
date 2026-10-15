"use client";

import DataTableSort from "@/components/common/DataTableSort";

interface ClassFiltersProps {
  sortBy: "name" | "createdAt";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "name" | "createdAt",
    sortOrder: "asc" | "desc",
  ) => void;
  disabled?: boolean;
}

const sortOptions = [
  {
    value: "name:asc",
    label: "Name A–Z",
  },
  {
    value: "name:desc",
    label: "Name Z–A",
  },
  {
    value: "createdAt:desc",
    label: "Newest",
  },
  {
    value: "createdAt:asc",
    label: "Oldest",
  },
];

export default function ClassFilters({
  sortBy,
  sortOrder,
  onSortChange,
  disabled = false,
}: ClassFiltersProps) {
  return (
    <DataTableSort
      value={`${ sortBy }:${ sortOrder } `}
      options={sortOptions}
      onChange={(value) => {
        const [nextSortBy, nextSortOrder] =
          value.split(":");

        if (
          (nextSortBy === "name" ||
            nextSortBy === "createdAt") &&
          (nextSortOrder === "asc" ||
            nextSortOrder === "desc")
        ) {
          onSortChange(
            nextSortBy,
            nextSortOrder,
          );
        }
      }}
      disabled={disabled}
    />
  );
}

