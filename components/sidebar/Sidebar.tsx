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
import { useEffect, useState } from "react";

const defaultItemClasses = {
  trigger: "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl hover:bg-gray/10",
  title: "font-bold text-gray text-sm",
};

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();

  const adminId = session.data?.user.admin_id || "";
  const route = SidebarMainMenu(adminId);
  const otherRoute = SidebarOtherMenu();

  const [subjectActive, setSubjectActive] = useState<{
    trigger: string;
    title: string;
  }>({
    trigger: "",
    title: "",
  });

  const [LearningVideoActive, setLearningVideoActive] = useState<{
    trigger: string;
    title: string;
  }>({
    trigger: "",
    title: "",
  });

  const [privateActive, setPrivateActive] = useState<{
    trigger: string;
    title: string;
  }>({
    trigger: "",
    title: "",
  });

  const [pharmacistAdmissionActive, setPharmacistAdmissionActive] = useState<{
    trigger: string;
    title: string;
  }>({
    trigger: "",
    title: "",
  });

  const [thesisActive, setThesisActive] = useState<{
    trigger: string;
    title: string;
  }>({
    trigger: "",
    title: "",
  });

  const [researchActive, setResearchActive] = useState<{
    trigger: string;
    title: string;
  }>({
    trigger: "",
    title: "",
  });

  useEffect(() => {
    setColor();

    function setColor() {
      const trigger =
        "pl-4 pr-[4px] h-10 items-center gap-2 rounded-xl bg-purple hover:bg-purple/90";
      const title = "font-bold text-white text-sm";

      if (router.pathname.startsWith("/learningvideo")) {
        setSubjectActive({
          trigger,
          title,
        });

        setLearningVideoActive({
          trigger,
          title,
        });
      }

      if (router.pathname.startsWith("/private")) {
        setSubjectActive({
          trigger,
          title,
        });

        setPrivateActive({
          trigger,
          title,
        });
      }

      if (router.pathname.startsWith("/research")) {
        setResearchActive({
          trigger,
          title,
        });
      }

      if (router.pathname.startsWith("/theses")) {
        setThesisActive({
          trigger,
          title,
        });
      }

      if (router.pathname.startsWith("/pharmacistadmission")) {
        setPharmacistAdmissionActive({
          trigger,
          title,
        });
      }
    }
  }, [router]);

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
                    trigger: subjectActive.trigger
                      ? subjectActive.trigger
                      : defaultItemClasses.trigger,
                    title: subjectActive.title
                      ? subjectActive.title
                      : defaultItemClasses.title,
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Matkul"
                    indicator={
                      <CaretRight
                        size={14}
                        className={
                          subjectActive.trigger ? "text-white" : "text-gray"
                        }
                      />
                    }
                    startContent={
                      <BookBookmark
                        className={
                          subjectActive.trigger ? "text-white" : "text-gray"
                        }
                      />
                    }
                    className="grid gap-1"
                  >
                    <Accordion
                      isCompact
                      className="p-0"
                      itemClasses={{
                        trigger: LearningVideoActive.trigger
                          ? LearningVideoActive.trigger
                          : defaultItemClasses.trigger,
                        title: LearningVideoActive.title
                          ? LearningVideoActive.title
                          : defaultItemClasses.title,
                      }}
                    >
                      <AccordionItem
                        aria-label="button"
                        title="Video Pembelajaran"
                        indicator={
                          <CaretRight
                            size={14}
                            className={
                              LearningVideoActive.trigger
                                ? "text-white"
                                : "text-gray"
                            }
                          />
                        }
                        className="mx-4 grid gap-1"
                      >
                        <ButtonSidebar
                          label="Konten"
                          path="/learningvideo/content"
                          icon={<Circle weight="fill" size={6} />}
                          className="ml-4"
                        />

                        <ButtonSidebar
                          label="Mentor"
                          path="/learningvideo/mentor"
                          icon={<Circle weight="fill" size={6} />}
                          className="ml-4"
                        />
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      isCompact
                      className="p-0"
                      itemClasses={{
                        trigger: privateActive.trigger
                          ? privateActive.trigger
                          : defaultItemClasses.trigger,
                        title: privateActive.title
                          ? privateActive.title
                          : defaultItemClasses.title,
                      }}
                    >
                      <AccordionItem
                        aria-label="button"
                        title="Private Farmasi"
                        indicator={
                          <CaretRight
                            size={14}
                            className={
                              privateActive.trigger ? "text-white" : "text-gray"
                            }
                          />
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
                    trigger: pharmacistAdmissionActive.trigger
                      ? pharmacistAdmissionActive.trigger
                      : defaultItemClasses.trigger,
                    title: pharmacistAdmissionActive.title
                      ? pharmacistAdmissionActive.title
                      : defaultItemClasses.title,
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Apoteker"
                    indicator={
                      <CaretRight
                        size={14}
                        className={
                          pharmacistAdmissionActive.trigger
                            ? "text-white"
                            : "text-gray"
                        }
                      />
                    }
                    startContent={
                      <BookBookmark
                        className={
                          pharmacistAdmissionActive.trigger
                            ? "text-white"
                            : "text-gray"
                        }
                      />
                    }
                    className="grid gap-1"
                  >
                    <ButtonSidebar
                      label="Universitas"
                      path="/pharmacistadmission/university"
                      icon={<Circle weight="fill" size={6} />}
                      className="mx-4"
                    />

                    <ButtonSidebar
                      label="Produk"
                      path="/pharmacistadmission/product"
                      icon={<Circle weight="fill" size={6} />}
                      className="mx-4"
                    />
                  </AccordionItem>
                </Accordion>

                <Accordion
                  isCompact
                  className="p-0"
                  itemClasses={{
                    trigger: researchActive.trigger
                      ? researchActive.trigger
                      : defaultItemClasses.trigger,
                    title: researchActive.title
                      ? researchActive.title
                      : defaultItemClasses.title,
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Riset"
                    indicator={
                      <CaretRight
                        size={14}
                        className={
                          researchActive.trigger ? "text-white" : "text-gray"
                        }
                      />
                    }
                    startContent={
                      <BookBookmark
                        className={
                          researchActive.trigger ? "text-white" : "text-gray"
                        }
                      />
                    }
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
                    trigger: thesisActive.trigger
                      ? thesisActive.trigger
                      : defaultItemClasses.trigger,
                    title: thesisActive.title
                      ? thesisActive.title
                      : defaultItemClasses.title,
                  }}
                >
                  <AccordionItem
                    aria-label="button"
                    title="Kelas Skripsi"
                    indicator={
                      <CaretRight
                        size={14}
                        className={
                          thesisActive.trigger ? "text-white" : "text-gray"
                        }
                      />
                    }
                    startContent={
                      <BookBookmark
                        className={
                          thesisActive.trigger ? "text-white" : "text-gray"
                        }
                      />
                    }
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
