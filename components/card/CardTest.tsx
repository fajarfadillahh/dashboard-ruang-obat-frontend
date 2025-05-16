import { SuccessResponse } from "@/types/global.type";
import { DetailsProgramResponse } from "@/types/program.type";
import { Test, TestsResponse } from "@/types/test.type";
import { fetcher } from "@/utils/fetcher";
import { formatDateWithoutTime } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import { getStatusColor, getStatusIcon } from "@/utils/getStatus";
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
  ClipboardText,
  PencilLine,
  Power,
  Prohibit,
  XCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { KeyedMutator } from "swr";
import CustomTooltip from "../CustomTooltip";

interface TestProps {
  test: Test;
  token: string;
  mutate:
    | KeyedMutator<SuccessResponse<TestsResponse>>
    | KeyedMutator<SuccessResponse<DetailsProgramResponse>>;
}

export default function CardTest({ test, token, mutate }: TestProps) {
  const router = useRouter();

  async function handleUpdateStatus(
    test_id: string,
    is_active: boolean = true,
  ) {
    try {
      const payload = {
        test_id: test_id,
        is_active: !is_active,
      };

      await fetcher({
        url: "/admin/tests/status",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      is_active
        ? toast.success("Ujian berhasil dinonaktifkan")
        : toast.success("Ujian berhasil diaktifkan");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-12 rounded-xl border-2 p-6 ${
        test.is_active
          ? "border-purple/10 hover:border-purple hover:bg-purple/10"
          : "border-danger bg-danger/5 hover:bg-danger/10"
      }`}
    >
      <div className="inline-flex flex-1 items-start gap-3">
        {test.is_active ? (
          <ClipboardText weight="duotone" size={28} className="text-purple" />
        ) : (
          <Prohibit weight="duotone" size={28} className="text-danger" />
        )}

        <div className="grid gap-6">
          <Link
            href={`/tests/details/${test.test_id}`}
            className={`line-clamp-1 text-xl font-bold leading-[120%] text-black ${test.is_active ? "hover:text-purple" : "hover:text-danger"}`}
          >
            {test.title}
          </Link>

          <div className="inline-flex items-start gap-6">
            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Tanggal Mulai:
              </span>

              <h1 className="text-sm font-semibold text-black">
                {formatDateWithoutTime(test.start)}
              </h1>
            </div>

            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Tanggal Selesai:
              </span>

              <h1 className="text-sm font-semibold text-black">
                {formatDateWithoutTime(test.end)}
              </h1>
            </div>

            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Durasi Pengerjaan:
              </span>

              <h1 className="text-sm font-semibold text-black">
                {test.duration} Menit
              </h1>
            </div>

            <div className="grid gap-1">
              <span className="text-xs font-medium text-gray">
                Status Ujian:
              </span>

              <div className="inline-flex items-center gap-2">
                <Chip
                  variant="flat"
                  size="sm"
                  color={getStatusColor(test.status)}
                  startContent={getStatusIcon(test.status)}
                  classNames={{
                    base: "px-2 gap-1",
                    content: "font-bold capitalize",
                  }}
                >
                  {test.status}
                </Chip>

                {test.is_active ? null : (
                  <Chip
                    variant="flat"
                    color="danger"
                    size="sm"
                    startContent={<XCircle weight="duotone" size={16} />}
                    classNames={{
                      base: "px-2 gap-1",
                      content: "font-bold capitalize",
                    }}
                  >
                    Tidak Aktif
                  </Chip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          color="secondary"
          onClick={() => router.push(`/tests/edit/${test.test_id}`)}
        >
          <CustomTooltip content="Edit Ujian">
            <PencilLine weight="duotone" size={18} />
          </CustomTooltip>
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm">
              <CustomTooltip content="Aktif/Nonaktif Ujian">
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
                onClick={() => handleUpdateStatus(test.test_id, test.is_active)}
              >
                {test.is_active ? "Nonaktifkan ujian" : "Aktifkan ujian"}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        {router.pathname !== "/tests" && (
          <Button
            size="sm"
            color="secondary"
            onClick={() => router.push(`/tests/grades/${test.test_id}`)}
            className="px-6 font-bold"
          >
            Lihat Nilai
          </Button>
        )}
      </div>
    </div>
  );
}
