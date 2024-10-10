import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import { TestType } from "@/types/test.type";
import { formatDate } from "@/utils/formatDate";
import { Button, Chip } from "@nextui-org/react";
import {
  CheckCircle,
  ClipboardText,
  ClockCountdown,
  HourglassLow,
  PencilLine,
} from "@phosphor-icons/react";
import { useRouter } from "next/router";

export default function CardTest({
  test,
  handleDeleteTest,
}: {
  test: TestType;
  handleDeleteTest?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border-2 border-purple/10 p-6 hover:border-purple hover:bg-purple/10">
      <div className="inline-flex flex-1 items-start gap-3">
        <ClipboardText weight="bold" size={28} className="text-purple" />

        <div className="grid gap-6">
          <h4 className="line-clamp-2 max-w-[620px] text-[20px] font-bold leading-[120%] -tracking-wide text-black">
            {test.title}
          </h4>

          <div className="inline-flex items-start gap-6">
            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Tanggal Mulai:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {formatDate(test.start)}
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Tanggal Selesai:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {formatDate(test.end)}
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

              <Chip
                variant="flat"
                color={
                  test.status === "Belum Mulai"
                    ? "default"
                    : test.status === "Berlangsung"
                      ? "warning"
                      : "success"
                }
                startContent={
                  test.status === "Belum Mulai" ? (
                    <ClockCountdown weight="fill" size={18} />
                  ) : test.status === "Berlangsung" ? (
                    <HourglassLow weight="fill" size={18} />
                  ) : (
                    <CheckCircle weight="fill" size={18} />
                  )
                }
                classNames={{
                  base: "px-2",
                  content: "font-semibold capitalize",
                }}
              >
                {test.status}
              </Chip>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center gap-2">
        <Button
          variant="solid"
          size="sm"
          color="secondary"
          onClick={() => router.push(`/tests/details/${test.test_id}`)}
          className="px-6 font-bold"
        >
          Lihat Ujian
        </Button>

        {router.pathname === "/tests" ? (
          <>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() => router.push(`/tests/edit/${test.test_id}`)}
            >
              <PencilLine weight="bold" size={18} />
            </Button>

            <ModalConfirmDelete
              id={test.test_id}
              header="Ujian"
              title={test.title}
              handleDelete={() => handleDeleteTest?.()}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
