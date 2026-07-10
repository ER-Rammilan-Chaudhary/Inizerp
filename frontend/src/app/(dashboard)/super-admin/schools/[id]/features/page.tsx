import Link from "next/link";
import SchoolFeatureManager from "@/features/schools/components/SchoolFeatureManager";

export default async function SchoolFeaturesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
        <div>
          <p className="text-sm font-medium text-slate-300">Features</p>
          <h1 className="text-2xl font-semibold text-white">School Features</h1>
        </div>
        <Link href={`/super-admin/schools/${id}`} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20">Back</Link>
      </div>

      <SchoolFeatureManager schoolId={id} />
    </div>
  );
}
