import EditNotificationPage from "@/features/super-admin/notifications/pages/EditNotificationPage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <EditNotificationPage id={id} />;
}