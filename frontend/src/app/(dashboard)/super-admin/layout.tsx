// app/(dashboard)/super-admin/layout.tsx

import ProtectedRoute from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}