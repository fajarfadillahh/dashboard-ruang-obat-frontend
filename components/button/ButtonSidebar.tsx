import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface ButtonSidebarProps {
  label: string;
  path: string;
  className?: string;
  icon: ReactNode;
}

export default function ButtonSidebar({
  label,
  path,
  className,
  icon,
}: ButtonSidebarProps) {
  const router = useRouter();

  return (
    <Link
      href={path}
      className={`flex h-10 items-center justify-between rounded-xl [padding:0.5rem_1rem] ${className} ${
        router.asPath === path || router.asPath.startsWith(path + "/")
          ? "bg-purple text-white hover:bg-purple/90"
          : "bg-transparent text-gray hover:bg-gray/10"
      }`}
    >
      <div className="flex flex-1 items-center gap-2">
        <>{icon}</>
        <div className="text-sm font-semibold">{label}</div>
      </div>
    </Link>
  );
}
