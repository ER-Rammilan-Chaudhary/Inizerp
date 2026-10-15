import ProtectedRoute from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TeacherAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["TEACHER"]}>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </ProtectedRoute>
    );
}