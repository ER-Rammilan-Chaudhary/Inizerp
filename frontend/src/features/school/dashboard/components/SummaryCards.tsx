"use client";

import {
  Banknote,
  GraduationCap,
  UserCheck,
  UsersRound,
} from "lucide-react";

import type { SchoolSummary } from "../types/school.types";

interface SummaryCardsProps {
  summary: SchoolSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      key: "students",
      label: "Students",
      value: (summary.students ?? 0).toLocaleString(),
      icon: GraduationCap,
      circleBg: "bg-[#d1f3e0] text-[#00b074]",
    },
    {
      key: "teachers",
      label: "Teachers",
      value: (summary.teachers ?? 0).toLocaleString(),
      icon: UserCheck,
      circleBg: "bg-[#e1f1ff] text-[#3f78e0]",
    },
    {
      key: "parents",
      label: "Parents",
      value: (summary.parents ?? 0).toLocaleString(),
      icon: UsersRound,
      circleBg: "bg-[#fff2d8] text-[#ffa000]",
    },
    {
      key: "earnings",
      label: "Earnings",
      value: "₹1,93,000",
      icon: Banknote,
      circleBg: "bg-[#ffeae6] text-[#ff3838]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-border"
          >
            {/* Left: Soft-Colored Circular Icon Badge (Akkhor Exact Style) */}
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${card.circleBg} shadow-xs transition-transform duration-200 group-hover:scale-105`}
            >
              <Icon className="h-8 w-8" />
            </div>

            {/* Right: Label & Big Bold Count */}
            <div className="text-right min-w-0">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground truncate">
                {card.label}
              </p>
              <h3 className="text-3xl font-black tracking-tight text-foreground mt-1 truncate">
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

