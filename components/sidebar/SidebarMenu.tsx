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
      key: "videocourse",
      title: "Video Pembelajaran",
      icon: Video,
      path: "/videocourse",
      items: [
        { label: "Kategori", path: "/videocourse/categories" },
        { label: "Kuis", path: "/videocourse/kuis" },
        { label: "Flashcard", path: "/videocourse/flashcard" },
        { label: "Konten", path: "/videocourse/content" },
        { label: "Paket Berlangganan", path: "/videocourse/subscriptions" },
        { label: "Daftar Akses", path: "/videocourse/accesses" },
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
      key: "apotekerclass",
      title: "Masuk Apoteker",
      icon: BookBookmark,
      path: "/apotekerclass",
      items: [
        { label: "Kategori", path: "/apotekerclass/categories" },
        { label: "Tryout", path: "/apotekerclass/tryouts" },
        { label: "Kuis", path: "/apotekerclass/quizzes" },
        { label: "Flashcard", path: "/apotekerclass/cards" },
        { label: "Konten", path: "/apotekerclass/courses" },
        { label: "Universitas", path: "/apotekerclass/universities" },
        { label: "Paket Berlangganan", path: "/apotekerclass/subscriptions" },
        { label: "Daftar Akses", path: "/apotekerclass/accesses" },
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
