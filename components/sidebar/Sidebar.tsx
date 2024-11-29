import SidebarMenu from "@/components/sidebar/SidebarMenu";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { IconContext } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();

  const adminId = session.data?.user.admin_id || "";
  const route = SidebarMenu(adminId);

  return (
    <div className="static left-0 top-0 z-50 grid h-screen min-w-[250px] grid-rows-[24px_1fr] gap-[30px] border-r border-gray/15 bg-gray/5 px-[20px] py-[30px]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 justify-self-center"
      >
        <LogoRuangobat className="h-auto w-[32px] text-gray/20" />
        <h1 className="text-[20px] font-extrabold -tracking-wide text-black">
          RuangObat<span className="text-purple">.</span>
        </h1>
      </Link>

      <div className="flex flex-1 flex-col overflow-y-scroll scrollbar-hide">
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
                className={`flex h-10 items-center justify-between rounded-xl px-3 py-2 ${
                  router.asPath.includes(item.path)
                    ? "bg-purple text-white hover:bg-purple/90"
                    : "bg-transparent text-gray hover:bg-gray/10"
                }`}
              >
                <div className="flex flex-1 items-center gap-2">
                  <item.icon
                    weight={router.asPath.includes(item.path) ? "fill" : "bold"}
                  />
                  <div className="text-sm font-bold">{item.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </IconContext.Provider>
      </div>
    </div>
  );
}
