import Link from "next/link";

const activity = [
  { title: "School Created", time: "2026-07-01" },
  { title: "Admin Added", time: "2026-07-03" },
  { title: "Attendance Enabled", time: "2026-07-05" },
  { title: "Subscription Renewed", time: "2026-07-07" },
];

export default async function SchoolActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
        <div>
          <p className="text-sm font-medium text-slate-300">Activity</p>
          <h1 className="text-2xl font-semibold text-white">Recent School Activity</h1>
        </div>
        <Link href={`/super-admin/schools/${id}`} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20">Back</Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-4">
          {activity.map((item) => (
            <div key={item.title} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <h2 className="font-medium text-slate-900 dark:text-slate-100">{item.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Recorded for this school in the admin log.</p>
              </div>
              <span className="text-sm text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
