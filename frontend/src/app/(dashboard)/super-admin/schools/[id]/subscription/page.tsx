import Link from "next/link";

export default async function SchoolSubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
        <div>
          <p className="text-sm font-medium text-slate-300">Subscription</p>
          <h1 className="text-2xl font-semibold text-white">Subscription Management</h1>
        </div>
        <Link href={`/super-admin/schools/${id}`} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20">Back</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Plan</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Premium Plan</h2>
            </div>
            <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400">Renew</button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500">Expire Date</p>
              <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">2026-12-31</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">Active</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">History</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">Renewed on 2026-06-01</div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">Plan upgraded on 2026-03-15</div>
          </div>
        </div>
      </div>
    </div>
  );
}
