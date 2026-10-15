import SchoolNotificationPage from "@/features/super-admin/notifications/pages/SchoolNotificationPage";


export default async function Page({ params, }:
    {
        params: Promise<{ id: string; }>;
    }) {
    const { id } = await params;
    return <SchoolNotificationPage schoolId={id} />;
}