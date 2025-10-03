import ButtonSidebar from "@/components/button/ButtonSidebar";
import {
  SidebarMenuArticle,
  SidebarMenuClass,
  SidebarMenuTryout,
  SidebarOtherMenu,
} from "@/components/sidebar/SidebarMenu";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  CaretRight,
  Circle,
  IconContext,
  Monitor,
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

  const tryoutMenu = SidebarMenuTryout();
  const classMenu = SidebarMenuClass();
  const articleMenu = SidebarMenuArticle();
  const otherMenu = SidebarOtherMenu(session.data?.user.admin_id || "");

  const defaultStyle = {
    trigger: "",
    title: "",
  };

  const [activeMenu, setActiveMenu] = useState<{
    [key: string]: { trigger: string; title: string };
  }>({
    videocourse: defaultStyle,
    private: defaultStyle,
    theses: defaultStyle,
    research: defaultStyle,
    apotekerclass: defaultStyle,
    statistics: defaultStyle,
  });

  useEffect(() => {
    const trigger =
      "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl bg-purple hover:bg-purple/90";
    const title = "font-semibold text-white text-sm";

    const pathMap = [
      "videocourse",
      "private",
      "research",
      "theses",
      "apotekerclass",
      "statistics",
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

  const currentPath = router.asPath.split("?")[0];

  return (
    <div className="static left-0 top-0 z-50 grid h-screen min-w-[250px] grid-rows-[24px_1fr] gap-8 border-r border-gray/15 bg-gray/5 [padding:2rem_1rem_0]">
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
        <div className="mb-24 flex flex-1 flex-col gap-8">
          <IconContext.Provider
            value={{
              size: 18,
            }}
          >
            <ButtonSidebar
              key="dashboard"
              label="Dashboard"
              path="/dashboard"
              icon={
                <Monitor
                  weight={
                    router.asPath.includes("/dashboard") ? "fill" : "duotone"
                  }
                />
              }
            />

            <div className="grid gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-gray">
                Menu UKMPPAI & OSCE
              </span>

              <div className="grid gap-0.5">
                {tryoutMenu.map((item, index) => (
                  <ButtonSidebar
                    key={index}
                    label={item.label as string}
                    path={item.path as string}
                    icon={
                      <item.icon
                        weight={
                          currentPath === item.path ||
                          currentPath.startsWith(item.path + "/")
                            ? "fill"
                            : "duotone"
                        }
                      />
                    }
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-gray">
                Menu Kelas
              </span>

              <div className="grid gap-0.5">
                {classMenu.map(({ key, title, icon: Icon, path, items }) => (
                  <Accordion
                    key={key}
                    isCompact
                    className="p-0"
                    itemClasses={{
                      trigger:
                        activeMenu[key as string]?.trigger ||
                        defaultItemClasses.trigger,
                      title:
                        activeMenu[key as string]?.title ||
                        defaultItemClasses.title,
                    }}
                  >
                    <AccordionItem
                      aria-label="button"
                      title={title}
                      indicator={
                        <CaretRight
                          size={14}
                          className={
                            activeMenu[key as string].trigger
                              ? "text-white"
                              : "text-gray"
                          }
                        />
                      }
                      startContent={
                        <Icon
                          className={
                            activeMenu[key as string].trigger
                              ? "text-white"
                              : "text-gray"
                          }
                          weight={
                            currentPath === path ||
                            currentPath.startsWith(path + "/")
                              ? "fill"
                              : "duotone"
                          }
                        />
                      }
                      className="grid gap-1"
                    >
                      {items?.map(({ label, path }) => (
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
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-gray">
                Menu Artikel
              </span>

              <div className="grid gap-0.5">
                {articleMenu.map((item, index) => (
                  <ButtonSidebar
                    key={index}
                    label={item.label as string}
                    path={item.path as string}
                    icon={
                      <item.icon
                        weight={
                          currentPath === item.path ||
                          currentPath.startsWith(item.path + "/")
                            ? "fill"
                            : "duotone"
                        }
                      />
                    }
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-gray">
                Menu Lainnya
              </span>

              <div className="grid gap-0.5">
                {otherMenu.map((item, index) => {
                  if (item.items?.length) {
                    return (
                      <Accordion
                        key={item.key}
                        isCompact
                        className="p-0"
                        itemClasses={{
                          trigger:
                            activeMenu[item.key as string]?.trigger ||
                            defaultItemClasses.trigger,
                          title:
                            activeMenu[item.key as string]?.title ||
                            defaultItemClasses.title,
                        }}
                      >
                        <AccordionItem
                          aria-label="button"
                          title={item.title}
                          indicator={
                            <CaretRight
                              size={14}
                              className={
                                activeMenu[item.key as string].trigger
                                  ? "text-white"
                                  : "text-gray"
                              }
                            />
                          }
                          startContent={
                            <item.icon
                              className={
                                activeMenu[item.key as string].trigger
                                  ? "text-white"
                                  : "text-gray"
                              }
                              weight={
                                currentPath === item.path ||
                                currentPath.startsWith(item.path + "/")
                                  ? "fill"
                                  : "duotone"
                              }
                            />
                          }
                          className="grid gap-1"
                        >
                          {item.items?.map(({ label, path }) => (
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
                    );
                  } else {
                    return (
                      <ButtonSidebar
                        key={index}
                        label={item?.label as string}
                        path={item?.path as string}
                        icon={
                          <item.icon
                            weight={
                              currentPath === item.path ||
                              currentPath.startsWith(item.path + "/")
                                ? "fill"
                                : "duotone"
                            }
                          />
                        }
                      />
                    );
                  }
                })}
              </div>
            </div>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
