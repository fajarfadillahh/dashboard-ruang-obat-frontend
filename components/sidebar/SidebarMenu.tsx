import {
  BookBookmark,
  Books,
  ChatCircleDots,
  ChatCircleText,
  ClipboardText,
  Clock,
  Icon,
  Microscope,
  Robot,
  User,
  Users,
  Video,
} from "@phosphor-icons/react";

type BaseMenuItem = {
  label: string;
  path: string;
};

type SidebarMenuType = BaseMenuItem & {
  icon: Icon;
};

type SidebarMenuClassType = {
  key: string;
  title: string;
  icon: Icon;
  path: string;
  items: BaseMenuItem[];
};

export function SidebarMenuTryout(): SidebarMenuType[] {
  return [
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
  ];
}

export function SidebarMenuClass(): SidebarMenuClassType[] {
  return [
    {
      key: "learningvideo",
      title: "Video Pembelajaran",
      icon: Video,
      path: "/learningvideo",
      items: [
        { label: "Konten", path: "/learningvideo/content" },
        { label: "Mentor", path: "/learningvideo/mentor" },
      ],
    },
    {
      key: "private",
      title: "Private 1 on 1",
      icon: ChatCircleDots,
      path: "/private",
      items: [
        { label: "Konten", path: "/private/content" },
        { label: "Mentor", path: "/private/mentor" },
      ],
    },
    {
      key: "theses",
      title: "Skripsi Farmasi",
      icon: Books,
      path: "/theses",
      items: [
        { label: "Konten", path: "/theses/content" },
        { label: "Mentor", path: "/theses/mentor" },
      ],
    },
    {
      key: "research",
      title: "Riset Farmasi",
      icon: Microscope,
      path: "/research",
      items: [
        { label: "Konten", path: "/research/content" },
        { label: "Mentor", path: "/research/mentor" },
      ],
    },
    {
      key: "pharmacistadmission",
      title: "Masuk Apoteker",
      icon: BookBookmark,
      path: "/pharmacistadmission",
      items: [
        { label: "Universitas", path: "/pharmacistadmission/university" },
        { label: "Produk", path: "/pharmacistadmission/product" },
      ],
    },
  ];
}

export function SidebarMenuUser(): SidebarMenuType[] {
  return [
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
  ];
}

export function SidebarOtherMenu(adminId?: string): SidebarMenuType[] {
  const isSuperAdmin = adminId?.startsWith("ROSA");

  return [
    ...(isSuperAdmin
      ? [
          {
            label: "Admin",
            path: "/admins",
            icon: Users,
          },
        ]
      : []),
    {
      label: "Rosa (AI)",
      path: "/ai",
      icon: Robot,
    },
    {
      label: "Mentor",
      path: "/mentors",
      icon: Users,
    },
    {
      label: "Feedback",
      path: "/feedback",
      icon: ChatCircleText,
    },
  ];
}
