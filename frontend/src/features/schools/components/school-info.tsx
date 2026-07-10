"use client";

import {
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
 User,
} from "lucide-react";

import { School } from "@/types/school";

interface SchoolInfoProps {
  school: School;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <div className="mt-1 text-primary">{icon}</div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 font-medium">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function SchoolInfo({
  school,
}: SchoolInfoProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />

        <h2 className="text-lg font-semibold">
          School Information
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InfoItem
          icon={<User size={18} />}
          label="Principal"
          value={school.principal}
        />

        <InfoItem
          icon={<Mail size={18} />}
          label="Email"
          value={school.email}
        />

        <InfoItem
          icon={<Phone size={18} />}
          label="Phone"
          value={school.phone}
        />

        <InfoItem
          icon={<MapPin size={18} />}
          label="Address"
          value={school.address}
        />

        <InfoItem
          icon={<Clock3 size={18} />}
          label="Working Hours"
          value={
            school.startHour && school.closeHour
              ? `${school.startHour} - ${school.closeHour}`
              : "-"
          }
        />

        <InfoItem
          icon={<Building2 size={18} />}
          label="Slug"
          value={school.slug}
        />
      </div>

      {(school.slogan ||
        school.missionStatement ||
        school.visionStatement) && (
        <div className="mt-8 space-y-5">
          {school.slogan && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                Slogan
              </h3>

              <p className="text-sm text-muted-foreground">
                {school.slogan}
              </p>
            </div>
          )}

          {school.missionStatement && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                Mission
              </h3>

              <p className="text-sm text-muted-foreground">
                {school.missionStatement}
              </p>
            </div>
          )}

          {school.visionStatement && (
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                Vision
              </h3>

              <p className="text-sm text-muted-foreground">
                {school.visionStatement}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}