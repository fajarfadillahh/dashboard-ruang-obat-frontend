import {
  BookBookmark,
  ChatCircleText,
  ClipboardText,
  Clock,
  House,
  Icon,
  User,
  Users,
} from "@phosphor-icons/react";

type SidebarMenuType = {
  label: string;
  path: string;
  icon: Icon;
};

export default function SidebarMenu(adminId: string): SidebarMenuType[] {
  const isSuperAdmin = adminId.startsWith("ROSA");

  return [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: House,
    },
    {
      label: "Program",
      path: "/programs",
      icon: BookBookmark,
    },
    {
      label: "Ujian",
      path: "/tests",
      icon: ClipboardText,
    },
    {
      label: "Pengguna",
      path: "/users",
      icon: User,
    },
    {
      label: "Session",
      path: "/sessions",
      icon: Clock,
    },
    {
      label: "Feedback",
      path: "/feedback",
      icon: ChatCircleText,
    },
    ...(isSuperAdmin
      ? [
          {
            label: "Admin",
            path: "/admins",
            icon: Users,
          },
        ]
      : []),
  ];
}
