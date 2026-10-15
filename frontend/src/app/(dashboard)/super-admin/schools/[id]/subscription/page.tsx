import SchoolSubscriptionPage from "@/features/super-admin/subscriptions/pages/SchoolSubscriptionPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <SchoolSubscriptionPage
      schoolId={id}
    />
  );
}