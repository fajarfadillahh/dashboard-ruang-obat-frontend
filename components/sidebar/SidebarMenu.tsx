import {
  Article,
  BookBookmark,
  Books,
  ChartLine,
  ChatCircleDots,
  ChatCircleText,
  ClipboardText,
  Icon,
  Microscope,
  Robot,
  TextT,
  User,
  UserList,
  Users,
  Video,
} from "@phosphor-icons/react";

type SidebarMenuType = {
  label?: string;
  key?: string;
  title?: string;
  path?: string;
  icon: Icon;
  items?: {
    label: string;
    path: string;
  }[];
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

export function SidebarMenuClass(): SidebarMenuType[] {
  return [
    {
      key: "videocourse",
      title: "Video Pembelajaran",
      icon: Video,
      path: "/videocourse",
      items: [
        { label: "Kategori", path: "/videocourse/categories" },
        { label: "Kuis", path: "/videocourse/quiz" },
        { label: "Flashcard", path: "/videocourse/flashcard" },
        { label: "Konten", path: "/videocourse/content" },
        { label: "Paket Berlangganan", path: "/videocourse/subscriptions" },
        { label: "Access List", path: "/videocourse/accesses" },
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
        { label: "Kuis", path: "/apotekerclass/quiz" },
        { label: "Flashcard", path: "/apotekerclass/flashcard" },
        { label: "Konten", path: "/apotekerclass/content" },
        { label: "Tryout", path: "/apotekerclass/tryout" },
        { label: "Universitas", path: "/apotekerclass/university" },
        { label: "Paket Berlangganan", path: "/apotekerclass/subscriptions" },
        { label: "Access List", path: "/apotekerclass/accesses" },
      ],
    },
  ];
}

export function SidebarMenuArticle(): SidebarMenuType[] {
  return [
    {
      label: "Artikel",
      path: "/articles",
      icon: Article,
    },
    {
      label: "Topik",
      path: "/topics",
      icon: TextT,
    },
    {
      label: "Ads",
      path: "/ads",
      icon: ClipboardText,
    },
  ];
}

export function SidebarOtherMenu(adminId?: string): SidebarMenuType[] {
  const isSuperAdmin = adminId?.startsWith("ROSA");

  return [
    {
      key: "statistics",
      title: "Statistik",
      icon: ChartLine,
      path: "/statistics",
      items: [
        { label: "Aktivitas Produk", path: "/statistics/products" },
        { label: "Aktivitas Login", path: "/statistics/login" },
        { label: "Aktivitas Pendaftar", path: "/statistics/registered" },
        { label: "Aktivitas ROSA (AI)", path: "/statistics/ai" },
      ],
    },
    {
      label: "Rosa (AI)",
      path: "/ai",
      icon: Robot,
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
    {
      label: "Pengguna",
      path: "/users",
      icon: User,
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
    {
      label: "Testimoni",
      path: "/testimonials",
      icon: UserList,
    },
  ];
}
