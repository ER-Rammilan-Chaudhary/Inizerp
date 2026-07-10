"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {children: React.ReactNode;role: "SUPER_ADMIN";}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({children,role,}) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;