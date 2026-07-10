import {
  LayoutDashboard,
  School,
  Users,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react";

export const superAdminSidebar = [
  {
    title: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schools",
    href: "/super-admin/schools",
    icon: School,
  },
  {
    title: "Users",
    href: "/super-admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/super-admin/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
];