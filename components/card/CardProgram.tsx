import { ProgramType } from "@/types/program.type";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  CheckCircle,
  ClipboardText,
  PencilLine,
  Power,
  Prohibit,
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface ProgramProps {
  program: ProgramType;
  onStatusChange: () => void;
}

export default function CardProgram({ program, onStatusChange }: ProgramProps) {
  const router = useRouter();

  return (
    <div
      className={`grid grid-cols-[1fr_max-content] items-center gap-6 rounded-xl border-2 p-6 ${
        program.is_active
          ? "border-purple/10 hover:border-purple hover:bg-purple/10"
          : "border-danger bg-danger/5 hover:bg-danger/10"
      }`}
    >
      <div className="flex items-start gap-6">
        {program.is_active ? (
          <ClipboardText weight="bold" size={28} className="text-purple" />
        ) : (
          <Prohibit weight="bold" size={28} className="text-danger" />
        )}

        <div className="grid gap-4">
          <Link
            href={`/programs/details/${encodeURIComponent(program.program_id)}`}
            className={`line-clamp-1 text-[20px] font-bold leading-[120%] text-black ${program.is_active ? "hover:text-purple" : "hover:text-danger"}`}
          >
            {program.title}
          </Link>

          <div className="grid grid-cols-[repeat(3,120px),max-content] items-start gap-2">
            <div className="grid gap-1">
              <span className="text-[12px] font-medium text-gray">
                Harga Program:
              </span>
              {program.type == "free" ? (
                <Chip
                  variant="flat"
                  color="default"
                  size="sm"
                  startContent={
                    <Tag weight="bold" size={16} className="text-black" />
                  }
                  classNames={{
                    base: "px-2 gap-1",
                    content: "font-semibold text-black",
                  }}
                >
                  Gratis
                </Chip>
              ) : program.price ? (
                <h5
                  className={`text-sm font-extrabold ${program.is_active ? "text-purple" : "text-danger"}`}
                >
                  {formatRupiah(program.price)}
                </h5>
              ) : null}
            </div>

            <div className="grid gap-1">
              <span className="text-[12px] font-medium text-gray">
                Jumlah Ujian:
              </span>
              <h5 className="text-sm font-semibold text-black">
                {program.total_tests} Modul Ujian
              </h5>
            </div>

            <div className="grid gap-1">
              <span className="text-[12px] font-medium text-gray">
                Status Program:
              </span>
              <Chip
                variant="flat"
                color={program.is_active ? "success" : "danger"}
                size="sm"
                startContent={
                  program.is_active ? (
                    <CheckCircle weight="fill" size={16} />
                  ) : (
                    <XCircle weight="fill" size={16} />
                  )
                }
                classNames={{
                  base: "px-2 gap-1",
                  content: "font-semibold",
                }}
              >
                {program.is_active ? "Aktif" : "Tidak Aktif"}
              </Chip>
            </div>

            <div className="grid gap-1">
              <span className="text-[12px] font-medium text-gray">
                Dibuat Pada:
              </span>
              <h5 className="text-sm font-semibold text-black">
                {formatDate(program.created_at)}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-1">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          color="secondary"
          onClick={() => router.push(`/programs/edit/${program.program_id}`)}
        >
          <PencilLine weight="bold" size={18} />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm">
              <Power weight="bold" size={18} className="text-danger" />
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="actions"
            itemClasses={{
              title: "font-semibold text-black",
            }}
          >
            <DropdownSection aria-label="action zone" title="Anda Yakin?">
              <DropdownItem onClick={onStatusChange}>
                {program.is_active
                  ? "Non-aktifkan Program"
                  : "Aktifkan Program"}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
