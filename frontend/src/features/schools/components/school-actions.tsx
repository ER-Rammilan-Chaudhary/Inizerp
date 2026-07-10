"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CreditCard,
  Settings2,
  ShieldCheck,
} from "lucide-react";

interface SchoolActionsProps {
  schoolId: string;
}

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function ActionCard({
  href,
  title,
  description,
  icon,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default function SchoolActions({
  schoolId,
}: SchoolActionsProps) {
  const actions = [
    {
      title: "School Features",
      description:
        "Enable or disable ERP modules for this school.",
      href: `/super-admin/schools/${schoolId}/features`,
      icon: <Settings2 className="h-6 w-6" />,
    },
    {
      title: "Subscription",
      description:
        "Manage plans, limits and renewal details.",
      href: `/super-admin/schools/${schoolId}/subscription`,
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      title: "School Admins",
      description:
        "Manage school administrators and permissions.",
      href: `/super-admin/schools/${schoolId}/admins`,
      icon: <ShieldCheck className="h-6 w-6" />,
    },
    {
      title: "Activity Logs",
      description:
        "View login history and administrative activities.",
      href: `/super-admin/schools/${schoolId}/activity`,
      icon: <Activity className="h-6 w-6" />,
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          Management
        </h2>

        <p className="text-sm text-muted-foreground">
          Manage every aspect of this school.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <ActionCard
            key={action.title}
            {...action}
          />
        ))}
      </div>
    </section>
  );
}