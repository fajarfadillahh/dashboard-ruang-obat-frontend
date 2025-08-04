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
  DropdownTrigger,
} from "@nextui-org/react";
import {
  ClipboardText,
  Eye,
  Gear,
  IconContext,
  PencilLine,
  Power,
  Prohibit,
} from "@phosphor-icons/react";
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

  const from =
    router.pathname === "/tests"
      ? "tests_page"
      : /^\/programs\/.+$/.test(router.pathname)
        ? "programs_detail"
        : "";

  return (
    <div
      className={`relative isolate grid grid-cols-[1fr_max-content] items-center overflow-hidden rounded-xl border-2 p-6 hover:cursor-pointer ${
        test.is_active
          ? "border-purple/10 hover:border-purple hover:bg-purple/10"
          : "border-danger bg-danger/5 hover:bg-danger/10"
      }`}
      onClick={() =>
        router.push({
          pathname: `/tests/${test.test_id}`,
          query: { from },
        })
      }
    >
      <div className="flex items-start gap-4">
        <IconContext.Provider
          value={{
            weight: "duotone",
            size: 32,
            className: test.is_active ? "text-purple" : "text-danger",
          }}
        >
          {test.is_active ? <ClipboardText /> : <Prohibit />}
        </IconContext.Provider>

        <div className="grid flex-1 gap-4">
          <CustomTooltip content={test.title}>
            <h1
              className={`line-clamp-1 text-lg font-bold leading-[120%] text-black ${test.is_active ? "hover:text-purple" : "hover:text-danger"}`}
            >
              {test.title}
            </h1>
          </CustomTooltip>

          <div className="flex items-start justify-between gap-2">
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
                Status Ujian:
              </span>

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
            </div>
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
            key="detail_test"
            startContent={<Eye weight="duotone" size={18} />}
            onClick={() =>
              router.push({
                pathname: `/tests/${test.test_id}`,
                query: { from },
              })
            }
          >
            Detail Ujian
          </DropdownItem>

          <DropdownItem
            key="edit_test"
            startContent={<PencilLine weight="duotone" size={18} />}
            onClick={() => router.push(`/tests/${test.test_id}/edit`)}
          >
            Edit Ujian
          </DropdownItem>

          {/* <DropdownItem
            key="grades_test"
            startContent={<Eye weight="duotone" size={18} />}
            onClick={() => router.push(`/tests/${test.test_id}/grades`)}
          >
            Lihat Nilai Ujian
          </DropdownItem> */}

          <DropdownItem
            key="active_inactive"
            color={test.is_active ? "danger" : "secondary"}
            startContent={<Power weight="duotone" size={18} />}
            onClick={() => handleUpdateStatus(test.test_id, test.is_active)}
            className={
              test.is_active
                ? "bg-danger/10 text-danger"
                : "bg-purple/10 text-purple"
            }
          >
            {test.is_active ? "Nonaktifkan Ujian" : "Aktifkan Ujian"}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
