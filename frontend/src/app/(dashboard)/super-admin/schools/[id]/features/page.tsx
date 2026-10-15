"use client";
import { use } from "react";
import FeaturesPage from "@/features/super-admin/features/components/FeaturesPage";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
export default function Page({
  params,
}: PageProps) {

  const { id } = use(params);
  return (
    <div className="space-y-6">
      <FeaturesPage
        schoolId={id}
      />
    </div>
  );
}