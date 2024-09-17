import ButtonSidebar from "@/components/button/ButtonSidebar";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { ClipboardText, House, ListChecks, User } from "@phosphor-icons/react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="border-gray/10 bg-gray/5 static left-0 top-0 z-50 grid h-screen min-w-[250px] grid-rows-[24px_1fr] gap-[30px] border-r px-[20px] py-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <Link href="/" className="inline-flex items-center gap-2">
        <LogoRuangobat className="text-gray/20 h-auto w-[32px]" />
        <h1 className="text-[20px] font-extrabold -tracking-wide text-black">
          Ruang Obat<span className="text-[#73C5FF]">.</span>
        </h1>
      </Link>

      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-scroll">
        <div className="grid gap-1">
          <ButtonSidebar
            label="Dashboard"
            path="/"
            icon={<House weight="bold" size={20} />}
          />

          <ButtonSidebar
            label="Program"
            path="/programs"
            icon={<ListChecks weight="bold" size={20} />}
          />

          <ButtonSidebar
            label="Ujian"
            path="/tests"
            icon={<ClipboardText weight="bold" size={20} />}
          />

          <ButtonSidebar
            label="Pengguna"
            path="/users"
            icon={<User weight="bold" size={20} />}
          />
        </div>
      </div>
    </div>
  );
}
