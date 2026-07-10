import {
  LayoutDashboard,
  School,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  FileText,
  Bell,
  Settings,
  User,
  Plus,
  List,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Schools",
    icon: School,

    children: [
      {
        title: "All Schools",
        href: "/super-admin/schools",
        icon: List,
      },
      {
        title: "Add School",
        href: "/super-admin/schools/new",
        icon: Plus,
      },
    ],
  },

  {
    title: "Users",
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
    title: "Subscriptions",
    href: "/super-admin/subscriptions",
    icon: CreditCard,
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

  {
    title: "Profile",
    href: "/super-admin/profile",
    icon: User,
  },
];








// import {
//   LayoutDashboard,
//   School,
//   Users,
//   Building2,
//   CreditCard,
//   BarChart3,
//   FileText,
//   Bell,
//   Settings,
//   User,
//   List,
//   Plus,
// } from "lucide-react";

// export const sidebarItems = [
//   {
//     title: "Dashboard",
//     href: "/super-admin/dashboard",
//     icon: LayoutDashboard,
//   },

//   {
//     title: "Schools",
//     icon: School,
//     children: [
//       {
//         title: "All Schools",
//         href: "/super-admin/schools",
//         icon: List,
//       },
//       {
//         title: "Add School",
//         href: "/super-admin/schools/create",
//         icon: Plus,
//       },
//     ],
//   },

//   {
//     title: "Users",
//     icon: Users,
//     children: [
//       {
//         title: "All Users",
//         href: "/super-admin/users",
//         icon: List,
//       },
//       {
//         title: "Create User",
//         href: "/super-admin/users/create",
//         icon: Plus,
//       },
//     ],
//   },

//   {
//     title: "Analytics",
//     href: "/super-admin/analytics",
//     icon: BarChart3,
//   },

//   {
//     title: "Settings",
//     href: "/super-admin/settings",
//     icon: Settings,
//   },
// ];