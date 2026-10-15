import ProtectedRoute from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SchoolAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["SCHOOL_ADMIN"]}>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}