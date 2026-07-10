import Link from "next/link";

const admins = [
  { name: "Aisha Bello", role: "School Admin", status: "Active" },
  { name: "Musa Yusuf", role: "Finance Admin", status: "Pending" },
  { name: "Grace Thomas", role: "Operations Admin", status: "Active" },
];

export default async function SchoolAdminsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div>
          <p className="text-sm font-medium text-slate-500">School admins</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Admins for school #{id}</h1>
        </div>
        <Link href={`/super-admin/schools/${id}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">Back</Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin.name} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <h2 className="font-medium text-slate-900 dark:text-slate-100">{admin.name}</h2>
                <p className="text-sm text-slate-500">{admin.role}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">{admin.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
