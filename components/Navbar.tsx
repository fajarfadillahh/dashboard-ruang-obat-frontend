import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { SignOut } from "@phosphor-icons/react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();

  return (
    <nav className="bg-white px-6">
      <div className="flex h-20 items-center justify-end">
        <Dropdown>
          <DropdownTrigger>
            <div className="inline-flex items-center gap-[10px] hover:cursor-pointer">
              <Avatar
                isBordered
                showFallback
                size="sm"
                src="/img/avatar.svg"
                classNames={{
                  base: "ring-purple bg-purple/20",
                  icon: "text-purple",
                }}
              />

              <div>
                <h6 className="text-sm font-bold text-black">
                  {session.status == "authenticated"
                    ? session.data.user.fullname
                    : ""}
                </h6>
                <p className="text-[12px] font-semibold uppercase text-gray">
                  {session.status == "authenticated"
                    ? session.data.user.admin_id
                    : ""}
                </p>
              </div>
            </div>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="profile actions"
            itemClasses={{
              base: "text-black",
            }}
          >
            <DropdownSection
              aria-label="danger zone section"
              title="Anda Yakin?"
            >
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<SignOut weight="bold" size={18} />}
                onClick={() => {
                  if (confirm("apakah anda yakin?")) {
                    signOut();
                  }
                }}
                className="text-danger-600"
              >
                Keluar
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
}
