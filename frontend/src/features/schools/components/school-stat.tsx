
import {
  BookOpen,
  GraduationCap,
  School2,
  Users,
} from "lucide-react";

interface SchoolStatsProps {
  students?: number;
  teachers?: number;
  classes?: number;
  subjects?: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SchoolStats({
  students = 0,
  teachers = 0,
  classes = 0,
  subjects = 0,
}: SchoolStatsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          Quick Statistics
        </h2>

        <p className="text-sm text-muted-foreground">
          Overview of your school's academic resources.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Students"
          value={students}
          icon={<GraduationCap className="h-7 w-7" />}
        />

        <StatCard
          title="Teachers"
          value={teachers}
          icon={<Users className="h-7 w-7" />}
        />

        <StatCard
          title="Classes"
          value={classes}
          icon={<School2 className="h-7 w-7" />}
        />

        <StatCard
          title="Subjects"
          value={subjects}
          icon={<BookOpen className="h-7 w-7" />}
        />
      </div>
    </section>
  );
} 