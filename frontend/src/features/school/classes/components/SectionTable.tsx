"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ClassSection } from "../types/classes.types";

interface SectionTableProps {
  sections: ClassSection[];
  onEdit: (section: ClassSection) => void;
  onDelete: (section: ClassSection) => void;
}

export default function SectionTable({
  sections,
  onEdit,
  onDelete,
}: SectionTableProps) {
  if (!sections.length) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No sections found.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add a section to start assigning
          students to this class.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="w-16 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sections.map((section) => {
            const students =
              section.studentCount;
            const capacity =
              section.capacity;

            const isFull =
              capacity !== null &&
              students >= capacity;

            const availability =
              capacity === null
                ? "Unlimited"
                : isFull
                  ? "Full"
                  : `${ capacity - students } seats`;

            return (
              <TableRow key={section.id}>
                <TableCell>
                  <span className="font-medium">
                    {section.name}
                  </span>
                </TableCell>

                <TableCell>
                  {students}
                </TableCell>

                <TableCell>
                  {capacity ?? "Unlimited"}
                </TableCell>

                <TableCell>
                  {availability}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">
                        Open section actions
                      </span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onEdit(section)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          onDelete(section)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

