"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  school: string;
  status: "Active" | "Inactive";
}

const users: User[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "School Admin",
    school: "Green Valley School",
    status: "Active",
  },
  {
    id: 2,
    name: "Amit Singh",
    email: "amit@gmail.com",
    role: "Teacher",
    school: "Oxford School",
    status: "Active",
  },
  {
    id: 3,
    name: "Neha Kapoor",
    email: "neha@gmail.com",
    role: "Student",
    school: "Modern Academy",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Pooja Verma",
    email: "pooja@gmail.com",
    role: "Parent",
    school: "Delhi Public School",
    status: "Active",
  },
];

export default function RecentUsersTable() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">

      <div className="border-b border-border p-6">

        <h2 className="text-xl font-bold">
          Recent Users
        </h2>

        <p className="text-sm text-muted-foreground">
          Latest Registered Users
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-muted/40">

              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">School</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t border-border hover:bg-muted/30"
              >

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">

                      {user.name.charAt(0)}

                    </div>

                    <span className="font-medium">

                      {user.name}

                    </span>

                  </div>

                </td>

                <td className="px-6 py-4">

                  {user.email}

                </td>

                <td className="px-6 py-4">

                  {user.role}

                </td>

                <td className="px-6 py-4">

                  {user.school}

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button className="rounded-lg p-2 hover:bg-muted">
                      <Eye size={18} />
                    </button>

                    <button className="rounded-lg p-2 hover:bg-muted">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-950">
                      <Trash2 size={18} />
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