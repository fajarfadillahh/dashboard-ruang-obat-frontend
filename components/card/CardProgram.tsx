import { SuccessResponse } from "@/types/global.type";
import { Program, ProgramsResponse } from "@/types/program.type";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { getError } from "@/utils/getError";
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
  BookBookmark,
  CheckCircle,
  PencilLine,
  Power,
  Prohibit,
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { KeyedMutator } from "swr";
import CustomTooltip from "../CustomTooltip";

interface ProgramProps {
  program: Program;
  token: string;
  mutate: KeyedMutator<SuccessResponse<ProgramsResponse>>;
}

export default function CardProgram({ program, token, mutate }: ProgramProps) {
  const router = useRouter();

  async function handleUpdateStatus(
    program_id: string,
    is_active: boolean = true,
  ) {
    try {
      const paylod = {
        program_id: program_id,
        is_active: !is_active,
      };

      await fetcher({
        url: "/admin/programs/status",
        method: "PATCH",
        data: paylod,
        token,
      });

      mutate();
      is_active
        ? toast.success("Program berhasil dinonaktifkan")
        : toast.success("Program berhasil diaktifkan");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <div
      className={`grid grid-cols-[1fr_max-content] items-center gap-12 rounded-xl border-2 p-6 ${
        program.is_active
          ? "border-purple/10 hover:border-purple hover:bg-purple/10"
          : "border-danger bg-danger/5 hover:bg-danger/10"
      }`}
    >
      <div className="flex items-start gap-6">
        {program.is_active ? (
          <BookBookmark weight="duotone" size={28} className="text-purple" />
        ) : (
          <Prohibit weight="duotone" size={28} className="text-danger" />
        )}

        <div className="grid gap-4">
          <Link
            href={`/programs/details/${encodeURIComponent(program.program_id)}`}
            className={`line-clamp-1 text-xl font-bold leading-[120%] text-black ${program.is_active ? "hover:text-purple" : "hover:text-danger"}`}
          >
            {program.title}
          </Link>

          <div className="grid grid-cols-[repeat(3,120px),max-content] items-start gap-2">
            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Harga Program:
              </span>

              {program.type == "free" ? (
                <Chip
                  variant="flat"
                  size="sm"
                  startContent={
                    <Tag weight="duotone" size={16} className="text-black" />
                  }
                  classNames={{
                    base: "px-2 gap-1",
                    content: "font-bold text-black",
                  }}
                >
                  Gratis
                </Chip>
              ) : (
                <h5
                  className={`text-sm font-extrabold ${program.is_active ? "text-purple" : "text-danger"}`}
                >
                  {formatRupiah(program.price as number)}
                </h5>
              )}
            </div>

            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Jumlah Ujian:
              </span>

              <h5 className="text-sm font-semibold text-black">
                {program.total_tests} Modul Ujian
              </h5>
            </div>

            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Status Program:
              </span>

              <Chip
                variant="flat"
                color={program.is_active ? "success" : "danger"}
                size="sm"
                startContent={
                  program.is_active ? (
                    <CheckCircle weight="duotone" size={16} />
                  ) : (
                    <XCircle weight="duotone" size={16} />
                  )
                }
                classNames={{
                  base: "px-2 gap-1",
                  content: "font-bold",
                }}
              >
                {program.is_active ? "Aktif" : "Tidak Aktif"}
              </Chip>
            </div>

            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
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
          <CustomTooltip content="Edit Program">
            <PencilLine weight="duotone" size={18} />
          </CustomTooltip>
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm">
              <CustomTooltip content="Aktif/Nonaktif Program">
                <Power weight="duotone" size={18} className="text-danger" />
              </CustomTooltip>
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="actions"
            itemClasses={{
              title: "font-semibold text-black",
            }}
          >
            <DropdownSection aria-label="action zone" title="Anda Yakin?">
              <DropdownItem
                onClick={() =>
                  handleUpdateStatus(program.program_id, program.is_active)
                }
              >
                {program.is_active ? "Nonaktifkan program" : "Aktifkan program"}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
