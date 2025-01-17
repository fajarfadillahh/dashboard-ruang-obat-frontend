import ButtonSidebar from "@/components/button/ButtonSidebar";
import {
  SidebarMainMenu,
  SidebarOtherMenu,
} from "@/components/sidebar/SidebarMenu";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  BookBookmark,
  CaretRight,
  Circle,
  IconContext,
} from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();

  const adminId = session.data?.user.admin_id || "";
  const route = SidebarMainMenu(adminId);
  const otherRoute = SidebarOtherMenu();

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
              weight: "bold",
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
                        router.asPath.includes(item.path) ? "fill" : "bold"
                      }
                    />
                    <div className="text-sm font-bold">{item.label}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-gray">
                Menu Lainnya
              </span>

              <div className="grid gap-1">
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
                          router.asPath.includes(item.path) ? "fill" : "bold"
                        }
                      />
                      <div className="text-sm font-bold">{item.label}</div>
                    </div>
                  </Link>
                ))}

                <Accordion
                  isCompact
                  className="p-0"
                  itemClasses={{
                    trigger:
                      "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
                    title: "font-bold text-gray text-sm",
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Matkul"
                    indicator={<CaretRight size={14} className="text-gray" />}
                    startContent={<BookBookmark className="text-gray" />}
                    className="grid gap-1"
                  >
                    <Accordion
                      isCompact
                      className="p-0"
                      itemClasses={{
                        trigger:
                          "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
                        title: "font-bold text-gray text-sm",
                      }}
                    >
                      <AccordionItem
                        aria-label="button"
                        title="Persiapan UTS/UAS"
                        indicator={
                          <CaretRight size={14} className="text-gray" />
                        }
                        className="mx-4 grid gap-1"
                      >
                        <ButtonSidebar
                          label="Konten"
                          path="/preparation/content"
                          icon={<Circle weight="fill" size={6} />}
                          className="ml-4"
                        />

                        <ButtonSidebar
                          label="Mentor"
                          path="/preparation/mentor"
                          icon={<Circle weight="fill" size={6} />}
                          className="ml-4"
                        />
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      isCompact
                      className="p-0"
                      itemClasses={{
                        trigger:
                          "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
                        title: "font-bold text-gray text-sm",
                      }}
                    >
                      <AccordionItem
                        aria-label="button"
                        title="Private Farmasi"
                        indicator={
                          <CaretRight size={14} className="text-gray" />
                        }
                        className="mx-4 grid gap-1"
                      >
                        <ButtonSidebar
                          label="Konten"
                          path="/private/content"
                          icon={<Circle weight="fill" size={6} />}
                          className="ml-4"
                        />

                        <ButtonSidebar
                          label="Mentor"
                          path="/private/mentor"
                          icon={<Circle weight="fill" size={6} />}
                          className="ml-4"
                        />
                      </AccordionItem>
                    </Accordion>
                  </AccordionItem>
                </Accordion>

                <Accordion
                  isCompact
                  className="p-0"
                  itemClasses={{
                    trigger:
                      "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
                    title: "font-bold text-gray text-sm",
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Riset"
                    indicator={<CaretRight size={14} className="text-gray" />}
                    startContent={<BookBookmark className="text-gray" />}
                    className="grid gap-1"
                  >
                    <ButtonSidebar
                      label="Konten"
                      path="/research/content"
                      icon={<Circle weight="fill" size={6} />}
                      className="mx-4"
                    />

                    <ButtonSidebar
                      label="Mentor"
                      path="/research/mentor"
                      icon={<Circle weight="fill" size={6} />}
                      className="mx-4"
                    />
                  </AccordionItem>
                </Accordion>

                <Accordion
                  isCompact
                  className="p-0"
                  itemClasses={{
                    trigger:
                      "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
                    title: "font-bold text-gray text-sm",
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Skripsi"
                    indicator={<CaretRight size={14} className="text-gray" />}
                    startContent={<BookBookmark className="text-gray" />}
                    className="grid gap-1"
                  >
                    <ButtonSidebar
                      label="Konten"
                      path="/theses/content"
                      icon={<Circle weight="fill" size={6} />}
                      className="mx-4"
                    />

                    <ButtonSidebar
                      label="Mentor"
                      path="/theses/mentor"
                      icon={<Circle weight="fill" size={6} />}
                      className="mx-4"
                    />
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
