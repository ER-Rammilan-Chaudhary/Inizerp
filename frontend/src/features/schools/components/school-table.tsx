"use client";

import {
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { School } from "@/types/school";

interface SchoolTableProps {
  schools: School[];
  loading?: boolean;
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
}

export default function SchoolTable({
  schools,
  loading = false,
  onEdit,
  onDelete,
}: SchoolTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Loading schools...
        </p>
      </div>
    );
  }

  if (!schools.length) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center">
        <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

        <h3 className="text-lg font-semibold">
          No Schools Found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Create your first school to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                School
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Principal
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Working Hours
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {schools.map((school) => (
              <tr
                key={school.id}
                className="border-b transition-colors hover:bg-muted/40 last:border-none"
              >
                <td className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <h4 className="font-semibold">
                        {school.name}
                      </h4>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {school.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />

                      <span>
                        {school.email || "-"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />

                      <span>
                        {school.phone || "-"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />

                      <span>
                        {school.address || "-"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />

                    <span>
                      {school.principal || "-"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {school.startHour && school.closeHour ? (
                    <span>
                      {school.startHour} - {school.closeHour}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(school)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(school)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}