// "use client";

// import Link from "next/link";
// import {
//   Building2,
//   Settings,
//   FileText,
//   UserPlus,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const actions = [
//   {
//     title: "Create School",
//     href: "/dashboard/schools/new",
//     icon: Building2,
//   },
//   {
//     title: "Add School Admin",
//     href: "/dashboard/users/new",
//     icon: UserPlus,
//   },
//   {
//     title: "Reports",
//     href: "/dashboard/reports",
//     icon: FileText,
//   },
//   {
//     title: "Settings",
//     href: "/dashboard/settings",
//     icon: Settings,
//   },
// ];

// export function QuickActions() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Quick Actions</CardTitle>
//       </CardHeader>

//       <CardContent className="grid gap-3">
//         {actions.map((action) => {
//           const Icon = action.icon;

//           return (
//             <Button
//               key={action.title}
//               asChild
//               variant="outline"
//               className="justify-start"
//             >
//               <Link href={action.href}>
//                 <Icon className="mr-2 h-4 w-4" />
//                 {action.title}
//               </Link>
//             </Button>
//           );
//         })}
//       </CardContent>
//     </Card>
//   );
// }