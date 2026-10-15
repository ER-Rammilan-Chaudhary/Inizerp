"use client";

import { GraduationCap, School2, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface SchoolStatsProps {
  students: number;
  teachers: number;
  users: number;
}

const stats = (
  students: number,
  teachers: number,
  users: number,
) => [
    {
      title: "Students",
      value: students,
      icon: GraduationCap,
    },
    {
      title: "Teachers",
      value: teachers,
      icon: School2,
    },
    {
      title: "Users",
      value: users,
      icon: Users,
    },
  ];

export default function SchoolStats({
  students,
  teachers,
  users,
}: SchoolStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats(students, teachers, users).map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{item.title}</p>

                <h2 className="text-3xl font-bold">{item.value}</h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}