"use client";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const schools = [
  {
    id: 1,
    name: "Green Valley School",
    principal: "Rahul Sharma",
    students: 1250,
    plan: "Premium",
    status: "Active",
  },
  {
    id: 2,
    name: "Sunrise Public School",
    principal: "Anita Verma",
    students: 980,
    plan: "Standard",
    status: "Active",
  },
  {
    id: 3,
    name: "Modern Academy",
    principal: "Amit Singh",
    students: 760,
    plan: "Basic",
    status: "Pending",
  },
  {
    id: 4,
    name: "Oxford School",
    principal: "Neha Kapoor",
    students: 1420,
    plan: "Premium",
    status: "Active",
  },
  {
    id: 5,
    name: "Delhi International",
    principal: "Sanjay Kumar",
    students: 1860,
    plan: "Enterprise",
    status: "Active",
  },
];

export default function RecentSchoolsTable() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">

      <div className="flex items-center justify-between border-b border-border p-6">

        <div>

          <h2 className="text-xl font-bold">
            Recent Schools
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest Registered Schools
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-border bg-muted/40">

              <th className="px-6 py-4 text-left">School</th>

              <th className="px-6 py-4 text-left">Principal</th>

              <th className="px-6 py-4 text-left">Students</th>

              <th className="px-6 py-4 text-left">Plan</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {schools.map((school) => (

              <tr
                key={school.id}
                className="border-b border-border hover:bg-muted/30 transition"
              >

                <td className="px-6 py-4 font-medium">
                  {school.name}
                </td>
                <td className="px-6 py-4">
                  {school.principal}
                </td>
                <td className="px-6 py-4">
                  {school.students}
                </td>
                <td className="px-6 py-4">
                  {school.plan}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      school.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {school.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-3">

                    <button className="rounded-lg p-2 hover:bg-muted">
                      <Eye size={18} />
                    </button>

                    <button className="rounded-lg p-2 hover:bg-muted">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-950">
                      <Trash2 size={18} />
                    </button>

                    <button className="rounded-lg p-2 hover:bg-muted">
                      <MoreHorizontal size={18} />
                    </button>

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