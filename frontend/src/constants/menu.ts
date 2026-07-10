import {
  LayoutDashboard,
  School,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  FileText,
  Bell,
  Settings,
  User,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bus,
  Library,
  List,
  Plus,
} from "lucide-react";

import { SidebarItem } from "@/types/sidebar";

export const menu = {
  SUPER_ADMIN: [
    {
      title: "Dashboard",
      href: "/super-admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Schools",
      href: "/super-admin/schools",
      icon: School,
      children: [
        {
          title: "All Schools",
          href: "/super-admin/schools",
          icon: List,
        },
        {
          title: "Add School",
          href: "/super-admin/schools/create",
          icon: Plus,
        },
      ],
    },
    {
      title: "Users",
      href: "/super-admin/users",
      icon: Users,
      children: [
        {
          title: "All Users",
          href: "/super-admin/users",
          icon: List,
        },
        {
          title: "Create User",
          href: "/super-admin/users/create",
          icon: Plus,
        },
      ],
    },
    {
      title: "Analytics",
      href: "/super-admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Reports",
      href: "/super-admin/reports",
      icon: FileText,
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
  ] satisfies SidebarItem[],

  SCHOOL_ADMIN: [
    {
      title: "Dashboard",
      href: "/school-admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Students",
      href: "/school-admin/students",
      icon: GraduationCap,
    },
    {
      title: "Teachers",
      href: "/school-admin/teachers",
      icon: Users,
    },
    {
      title: "Attendance",
      href: "/school-admin/attendance",
      icon: ClipboardList,
    },
    {
      title: "Library",
      href: "/school-admin/library",
      icon: Library,
    },
    {
      title: "Transport",
      href: "/school-admin/transport",
      icon: Bus,
    },
    {
      title: "Settings",
      href: "/school-admin/settings",
      icon: Settings,
    },
  ] satisfies SidebarItem[],

  TEACHER: [
    {
      title: "Dashboard",
      href: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Classes",
      href: "/teacher/classes",
      icon: BookOpen,
    },
    {
      title: "Attendance",
      href: "/teacher/attendance",
      icon: ClipboardList,
    },
  ] satisfies SidebarItem[],

  STUDENT: [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Subjects",
      href: "/student/subjects",
      icon: BookOpen,
    },
  ] satisfies SidebarItem[],

  PARENT: [
    {
      title: "Dashboard",
      href: "/parent/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Children",
      href: "/parent/children",
      icon: Users,
    },
  ] satisfies SidebarItem[],
};
