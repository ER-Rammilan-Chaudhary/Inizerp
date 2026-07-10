import Link from "next/link";

export default async function EditSchoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div>
          <p className="text-sm font-medium text-slate-500">Edit school</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Update school #{id}</h1>
        </div>
        <Link href={`/super-admin/schools/${id}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">View school</Link>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">School name</label>
            <input defaultValue={`School ${id}`} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Contact email</label>
            <input defaultValue="contact@school.com" type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea defaultValue="This school is managed by the super admin and has an active subscription package." className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link href={`/super-admin/schools/${id}`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">Cancel</Link>
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900">Save changes</button>
        </div>
      </form>
    </div>
  );
}
