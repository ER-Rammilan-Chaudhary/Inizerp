"use client";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-background">

      <Sidebar />

      <MobileSidebar />

      <div className="flex flex-1 flex-col">

        <Header />

        <main className="flex-1 bg-muted/20 p-6">

          {children}

        </main>

      </div>

    </div>
  );
}