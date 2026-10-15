import NotificationDetailPage from "@/features/super-admin/notifications/pages/NotificationDetailPage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <NotificationDetailPage id={id} />;
}