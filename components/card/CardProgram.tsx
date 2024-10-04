import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
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
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import { DotsThreeOutlineVertical } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/router";

interface ProgramProps {
  program: ProgramType;
  handleDeleteProgram: () => void;
  onStatusChange: () => void;
}

export default function CardProgram({
  program,
  handleDeleteProgram,
  onStatusChange,
}: ProgramProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-[1fr_max-content] items-center gap-6 rounded-xl border-2 border-gray/20 p-6 hover:cursor-pointer hover:border-gray/40 hover:bg-gray/10">
      <div className="flex items-start gap-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-gray/20 text-gray">
          <ClipboardText weight="bold" size={20} />
        </div>

        <div className="grid gap-4">
          <Link
            href={`/programs/details/${encodeURIComponent(program.program_id)}`}
            className="line-clamp-1 text-[20px] font-bold leading-[120%] text-black hover:text-purple"
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
              ) : (
                <h5 className="text-sm font-extrabold text-purple">
                  {formatRupiah(program.price)}
                </h5>
              )}
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

        <ModalConfirmDelete
          id={program.program_id}
          header="Program"
          title={program.title}
          handleDelete={handleDeleteProgram}
        />

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm">
              <DotsThreeOutlineVertical
                weight="fill"
                size={18}
                className="text-black"
              />
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Actions"
            itemClasses={{
              base: "font-semibold",
            }}
          >
            <DropdownSection aria-label="action zone" title="Anda Yakin?">
              <DropdownItem
                startContent={<Power weight="bold" size={18} />}
                onClick={onStatusChange}
                className="text-black"
              >
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
