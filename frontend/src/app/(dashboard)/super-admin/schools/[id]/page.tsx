
import { getSchoolById, } from "@/api/school.api";
import SchoolActions from "@/features/schools/components/school-actions";
import SchoolHeader from "@/features/schools/components/school-header";
import SchoolInfo from "@/features/schools/components/school-info";
import SchoolStats from "@/features/schools/components/school-stat";

interface SchoolDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SchoolDetailsPage({
  params,
}: SchoolDetailsPageProps) {
  const { id } = await params;

  const school = await getSchoolById(id);

  return (
    <div className="space-y-8">
      <SchoolHeader school={school} />

      <SchoolStats
        students={0}
        teachers={0}
        classes={0}
        subjects={0}
      />

      <SchoolInfo school={school} />

      <SchoolActions schoolId={school.id} />
    </div>
  );
}
