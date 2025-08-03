import { SuccessResponse } from "@/types/global.type";
import { Program, ProgramsResponse } from "@/types/program.type";
import { fetcher } from "@/utils/fetcher";
import { formatRupiah } from "@/utils/formatRupiah";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  BookBookmark,
  Eye,
  Gear,
  IconContext,
  PencilLine,
  Power,
  Prohibit,
  Tag,
  Users,
} from "@phosphor-icons/react";
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
      className={`relative isolate grid grid-cols-[1fr_max-content] items-center overflow-hidden rounded-xl border-2 p-6 hover:cursor-pointer ${
        program.is_active
          ? "border-purple/10 hover:border-purple hover:bg-purple/10"
          : "border-danger bg-danger/5 hover:bg-danger/10"
      }`}
      onClick={() =>
        router.push(`/programs/${encodeURIComponent(program.program_id)}`)
      }
    >
      <div className="flex items-start gap-4">
        <IconContext.Provider
          value={{
            weight: "duotone",
            size: 32,
            className: program.is_active ? "text-purple" : "text-danger",
          }}
        >
          {program.is_active ? <BookBookmark /> : <Prohibit />}
        </IconContext.Provider>

        <div className="grid flex-1 gap-4">
          <CustomTooltip content={program.title}>
            <h1
              className={`line-clamp-1 text-lg font-bold leading-[120%] text-black ${program.is_active ? "hover:text-purple" : "hover:text-danger"}`}
            >
              {program.title}
            </h1>
          </CustomTooltip>

          <div className="flex items-start justify-between gap-2">
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

            {/* <div className="grid gap-1">
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
            </div> */}
          </div>
        </div>
      </div>

      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            color="secondary"
            className="absolute right-4 top-4 z-10"
          >
            <CustomTooltip content="Aksi Lainnya">
              <Gear weight="duotone" size={18} />
            </CustomTooltip>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Static Actions"
          itemClasses={{
            title: "font-semibold",
          }}
        >
          <DropdownItem
            key="detail_program"
            startContent={<Eye weight="duotone" size={18} />}
            onClick={() => router.push(`/programs/${program.program_id}`)}
          >
            Detail Program
          </DropdownItem>

          <DropdownItem
            key="detail_participant"
            startContent={<Users weight="duotone" size={18} />}
            onClick={() =>
              router.push(`/programs/${program.program_id}/participants`)
            }
          >
            Partisipan
          </DropdownItem>

          <DropdownItem
            key="edit_program"
            startContent={<PencilLine weight="duotone" size={18} />}
            onClick={() => router.push(`/programs/${program.program_id}/edit`)}
          >
            Edit Program
          </DropdownItem>

          <DropdownItem
            key="active_inactive"
            color={program.is_active ? "danger" : "secondary"}
            startContent={<Power weight="duotone" size={18} />}
            onClick={() =>
              handleUpdateStatus(program.program_id, program.is_active)
            }
            className={
              program.is_active
                ? "bg-danger/10 text-danger"
                : "bg-purple/10 text-purple"
            }
          >
            {program.is_active ? "Nonaktifkan program" : "Aktifkan program"}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
