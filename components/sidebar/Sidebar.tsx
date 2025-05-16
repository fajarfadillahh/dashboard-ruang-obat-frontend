import ButtonSidebar from "@/components/button/ButtonSidebar";
import {
  SidebarMainMenu,
  SidebarOtherMenu,
} from "@/components/sidebar/SidebarMenu";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  BookBookmark,
  Books,
  CaretRight,
  ChatCircleDots,
  Circle,
  IconContext,
  Microscope,
  Video,
} from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const defaultItemClasses = {
  trigger: "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
  title: "font-semibold text-gray text-sm",
};

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();

  const adminId = session.data?.user.admin_id || "";
  const route = SidebarMainMenu(adminId);
  const otherRoute = SidebarOtherMenu();

  const defaultStyle = {
    trigger: "",
    title: "",
  };

  const [activeMenu, setActiveMenu] = useState<{
    [key: string]: { trigger: string; title: string };
  }>({
    learningvideo: defaultStyle,
    private: defaultStyle,
    theses: defaultStyle,
    research: defaultStyle,
    pharmacistadmission: defaultStyle,
  });

  useEffect(() => {
    const trigger =
      "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl bg-purple hover:bg-purple/90";
    const title = "font-semibold text-white text-sm";

    const pathMap = [
      "learningvideo",
      "private",
      "research",
      "theses",
      "pharmacistadmission",
    ];

    const updatedState: typeof activeMenu = { ...activeMenu };

    pathMap.forEach((key) => {
      if (router.pathname.startsWith(`/${key}`)) {
        updatedState[key] = { trigger, title };
      } else {
        updatedState[key] = defaultStyle;
      }
    });

    setActiveMenu(updatedState);
  }, [router]);

  const sidebarConfig = [
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

  return (
    <div className="static left-0 top-0 z-50 grid h-screen min-w-[250px] grid-rows-[24px_1fr] gap-8 border-r border-gray/15 bg-gray/5 [padding:2rem_1rem]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 justify-self-center"
      >
        <LogoRuangobat className="h-auto w-[32px] text-gray/20" />
        <h1 className="text-xl font-extrabold -tracking-wide text-black">
          RuangObat<span className="text-purple">.</span>
        </h1>
      </Link>

      <div className="overflow-y-scroll scrollbar-hide">
        <div className="mb-16 flex flex-1 flex-col gap-8">
          <IconContext.Provider
            value={{
              size: 18,
            }}
          >
            <div className="grid gap-1">
              {route.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className={`flex h-10 items-center justify-between rounded-xl [padding:0.5rem_1rem] ${
                    router.asPath.includes(item.path)
                      ? "bg-purple text-white hover:bg-purple/90"
                      : "bg-transparent text-gray hover:bg-gray/10"
                  }`}
                >
                  <div className="flex flex-1 items-center gap-2">
                    <item.icon
                      weight={
                        router.asPath.includes(item.path) ? "fill" : "duotone"
                      }
                    />
                    <div className="text-sm font-semibold">{item.label}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-gray">
                Menu Lainnya
              </span>

              <div className="grid gap-1">
                {sidebarConfig.map(
                  ({ key, title, icon: Icon, path, items }) => (
                    <Accordion
                      key={key}
                      isCompact
                      className="p-0"
                      itemClasses={{
                        trigger:
                          activeMenu[key]?.trigger ||
                          defaultItemClasses.trigger,
                        title:
                          activeMenu[key]?.title || defaultItemClasses.title,
                      }}
                    >
                      <AccordionItem
                        aria-label="button"
                        title={title}
                        indicator={
                          <CaretRight
                            size={14}
                            className={
                              activeMenu[key].trigger
                                ? "text-white"
                                : "text-gray"
                            }
                          />
                        }
                        startContent={
                          <Icon
                            className={
                              activeMenu[key].trigger
                                ? "text-white"
                                : "text-gray"
                            }
                            weight={
                              router.asPath.includes(path) ? "fill" : "duotone"
                            }
                          />
                        }
                        className="grid gap-1"
                      >
                        {items.map(({ label, path }) => (
                          <ButtonSidebar
                            key={path}
                            label={label}
                            path={path}
                            icon={<Circle weight="fill" size={6} />}
                            className="ml-4"
                          />
                        ))}
                      </AccordionItem>
                    </Accordion>
                  ),
                )}

                {otherRoute.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className={`flex h-10 items-center justify-between rounded-xl [padding:0.5rem_1rem] ${
                      router.asPath.includes(item.path)
                        ? "bg-purple text-white hover:bg-purple/90"
                        : "bg-transparent text-gray hover:bg-gray/10"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <item.icon
                        weight={
                          router.asPath.includes(item.path) ? "fill" : "duotone"
                        }
                      />
                      <div className="text-sm font-semibold">{item.label}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
