import { TestType } from "@/types/test.type";
import { Button, Chip } from "@nextui-org/react";
import { ClipboardText, ClockCountdown, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/router";

export default function CardTest(test: TestType) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border-2 border-gray/20 bg-transparent p-6 hover:bg-gray/10">
      <div className="inline-flex flex-1 items-start gap-3">
        <ClipboardText weight="bold" size={28} className="text-purple" />

        <div className="grid gap-6">
          <h4 className="line-clamp-2 max-w-[620px] text-[20px] font-bold leading-[120%] -tracking-wide text-black group-hover:text-purple">
            {test.title}
          </h4>

          <div className="inline-flex items-start gap-6">
            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Tanggal Mulai:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {test.start_test}
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Tanggal Selesai:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {test.end_test}
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Durasi Pengerjaan:
              </span>
              <h1 className="text-sm font-semibold text-black">
                {test.duration_test} Menit
              </h1>
            </div>

            <div className="grid gap-[2px]">
              <span className="text-[12px] font-medium text-gray">
                Status Program:
              </span>

              <Chip
                variant="flat"
                color="default"
                startContent={
                  <ClockCountdown
                    weight="bold"
                    size={18}
                    className="text-black"
                  />
                }
                classNames={{
                  base: "px-3 gap-1",
                  content: "font-semibold text-black capitalize",
                }}
              >
                {test.status_test}
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
          className="px-6 font-bold"
        >
          Lihat Ujian
        </Button>

        {router.pathname === "/tests" ? (
          <Button
            isIconOnly
            variant="flat"
            size="sm"
            color="danger"
            onClick={() => confirm("Apakah anda yakin?")}
          >
            <Trash weight="bold" size={18} className="text-danger" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
