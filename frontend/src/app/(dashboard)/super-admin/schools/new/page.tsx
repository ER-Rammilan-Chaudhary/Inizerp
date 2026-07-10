import Link from "next/link";

export default function NewSchoolPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div>
          <p className="text-sm font-medium text-slate-500">Create School</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Add a new school</h1>
        </div>
        <Link
          href="/super-admin/schools"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Back to list
        </Link>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">School name</label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" placeholder="Enter school name" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
            <input type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" placeholder="admin@school.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" placeholder="08012345678" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Subscription plan</label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900">
              <option>Starter</option>
              <option>Growth</option>
              <option>Enterprise</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
          <textarea className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" placeholder="School address" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/super-admin/schools" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">Cancel</Link>
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900">Create School</button>
        </div>
      </form>
    </div>
  );
}
