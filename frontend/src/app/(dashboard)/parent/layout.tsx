import ProtectedRoute from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ParentAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["PARENT"]}>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </ProtectedRoute>
    );
}