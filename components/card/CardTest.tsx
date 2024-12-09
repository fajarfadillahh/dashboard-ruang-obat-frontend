import { TestType } from "@/types/test.type";
import { formatDateWithoutTime } from "@/utils/formatDate";
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

interface TestProps {
  test: TestType;
  onStatusChange?: () => void;
}

export default function CardTest({ test, onStatusChange }: TestProps) {
  const router = useRouter();

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
          <ClipboardText weight="bold" size={28} className="text-purple" />
        ) : (
          <Prohibit weight="bold" size={28} className="text-danger" />
        )}

        <div className="grid gap-6">
          <Link
            href={`/tests/details/${test.test_id}`}
            className={`line-clamp-1 text-[20px] font-bold leading-[120%] text-black ${test.is_active ? "hover:text-purple" : "hover:text-danger"}`}
          >
            {test.title}
          </Link>

          <div className="inline-flex items-start gap-6">
            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Tanggal Mulai:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {formatDateWithoutTime(test.start)}
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Tanggal Selesai:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {formatDateWithoutTime(test.end)}
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Durasi Pengerjaan:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {test.duration} Menit
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
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
                    content: "font-semibold capitalize",
                  }}
                >
                  {test.status}
                </Chip>

                {test.is_active ? null : (
                  <Chip
                    variant="flat"
                    color="danger"
                    size="sm"
                    startContent={<XCircle weight="fill" size={16} />}
                    classNames={{
                      base: "px-2 gap-1",
                      content: "font-semibold capitalize",
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
        {router.pathname === "/tests" ? (
          <>
            {test.status !== "Berakhir" && (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                color="secondary"
                onClick={() => router.push(`/tests/edit/${test.test_id}`)}
              >
                <PencilLine weight="bold" size={18} />
              </Button>
            )}

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
                    {test.is_active ? "Non-aktifkan Ujian" : "Aktifkan Ujian"}
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <Button
            variant="solid"
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
