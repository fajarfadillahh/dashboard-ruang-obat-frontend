import ButtonSidebar from "@/components/button/ButtonSidebar";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import {
  ChatCircleText,
  ClipboardText,
  ClockClockwise,
  House,
  ListChecks,
  User,
  Users,
} from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Sidebar() {
  const session = useSession();

  return (
    <div className="static left-0 top-0 z-50 grid h-screen min-w-[250px] grid-rows-[24px_1fr] gap-[30px] border-r border-gray/10 bg-gray/5 px-[20px] py-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 justify-self-center"
      >
        <LogoRuangobat className="h-auto w-[32px] text-gray/20" />
        <h1 className="text-[20px] font-extrabold -tracking-wide text-black">
          Ruang Obat<span className="text-purple">.</span>
        </h1>
      </Link>

      <div className="flex flex-1 flex-col overflow-y-scroll scrollbar-hide">
        <div className="grid gap-1">
          <ButtonSidebar
            label="Dashboard"
            path="/dashboard"
            icon={<House weight="bold" size={18} />}
          />

          <ButtonSidebar
            label="Program"
            path="/programs"
            icon={<ListChecks weight="bold" size={18} />}
          />

          <ButtonSidebar
            label="Ujian"
            path="/tests"
            icon={<ClipboardText weight="bold" size={18} />}
          />

          <ButtonSidebar
            label="Pengguna"
            path="/users"
            icon={<User weight="bold" size={18} />}
          />

          <ButtonSidebar
            label="Session"
            path="/sessions"
            icon={<ClockClockwise weight="bold" size={18} />}
          />

          <ButtonSidebar
            label="Feedback"
            path="/feedback"
            icon={<ChatCircleText weight="bold" size={18} />}
          />

          {session.data?.user.admin_id.startsWith("ROSA") ? (
            <ButtonSidebar
              label="Admin"
              path="/admins"
              icon={<Users weight="bold" size={18} />}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
