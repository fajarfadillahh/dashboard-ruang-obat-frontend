import Link from "next/link";
import { useRouter } from "next/router";

interface ButtonSidebarProps {
  label: string;
  path: string;
  className?: string;
  icon: React.ReactNode;
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
      className={`flex h-10 items-center justify-between rounded-xl px-3 py-2 ${
        router.asPath.includes(path)
          ? "bg-purple hover:bg-purple/90 text-white"
          : "text-gray hover:bg-gray-20 bg-transparent"
      } ${className}`}
    >
      <div className="flex flex-1 items-center gap-2">
        <>{icon}</>
        <div className="text-sm font-semibold">{label}</div>
      </div>
    </Link>
  );
}
