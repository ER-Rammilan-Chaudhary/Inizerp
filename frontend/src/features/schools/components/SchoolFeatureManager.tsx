"use client";

import { useEffect, useMemo, useState } from "react";

export type SchoolFeature = {
  key: string;
  label: string;
  enabled: boolean;
};

const baseFeatures: SchoolFeature[] = [
  { key: "attendance", label: "Attendance", enabled: true },
  { key: "fees", label: "Fees", enabled: true },
  { key: "transport", label: "Transport", enabled: false },
  { key: "library", label: "Library", enabled: true },
  { key: "homework", label: "Homework", enabled: false },
  { key: "inventory", label: "Inventory", enabled: false },
  { key: "hostel", label: "Hostel", enabled: true },
  { key: "exams", label: "Exams", enabled: true },
  { key: "notifications", label: "Notifications", enabled: true },
  { key: "admissions", label: "Admissions", enabled: false },
  { key: "onlineClasses", label: "Online Classes", enabled: true },
  { key: "mobileApp", label: "Mobile App", enabled: true },
];

function getStorageKey(schoolId: string) {
  return `school-feature-state-${schoolId}`;
}

export default function SchoolFeatureManager({
  schoolId,
  compact = false,
}: {
  schoolId: string;
  compact?: boolean;
}) {
  const [features, setFeatures] = useState<SchoolFeature[]>(baseFeatures);

  const syncFeatures = (nextFeatures: SchoolFeature[]) => {
    setFeatures(nextFeatures);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(getStorageKey(schoolId), JSON.stringify(nextFeatures));
      window.dispatchEvent(
        new CustomEvent("school-feature-updated", {
          detail: { schoolId, features: nextFeatures },
        })
      );
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(getStorageKey(schoolId));
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as SchoolFeature[];
      if (Array.isArray(parsed) && parsed.length) {
        setFeatures(parsed);
      }
    } catch {
      window.localStorage.removeItem(getStorageKey(schoolId));
    }
  }, [schoolId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ schoolId: string; features: SchoolFeature[] }>;
      if (customEvent.detail?.schoolId === schoolId && Array.isArray(customEvent.detail.features)) {
        setFeatures(customEvent.detail.features);
      }
    };

    window.addEventListener("school-feature-updated", handleUpdated as EventListener);
    return () => window.removeEventListener("school-feature-updated", handleUpdated as EventListener);
  }, [schoolId]);

  const enabledFeatures = useMemo(() => features.filter((feature) => feature.enabled), [features]);

  const toggleFeature = (key: string) => {
    syncFeatures(
      features.map((feature) => (feature.key === key ? { ...feature, enabled: !feature.enabled } : feature))
    );
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">Enabled Modules</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{enabledFeatures.length}</p>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white shadow-sm">
              Live
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {enabledFeatures.map((feature) => (
            <span
              key={feature.key}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              {feature.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Feature Access</h2>
          <p className="mt-1 text-sm text-slate-500">Turn modules on or off for this school. Enabled modules appear dynamically on the school overview.</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {enabledFeatures.length} enabled
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">{feature.label}</h3>
              <p className="text-sm text-slate-500">{feature.enabled ? "Visible to this school" : "Hidden from this school"}</p>
            </div>
            <button
              type="button"
              aria-pressed={feature.enabled}
              onClick={() => toggleFeature(feature.key)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none ${feature.enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${feature.enabled ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
