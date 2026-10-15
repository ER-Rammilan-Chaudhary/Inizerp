import ProtectedRoute from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
