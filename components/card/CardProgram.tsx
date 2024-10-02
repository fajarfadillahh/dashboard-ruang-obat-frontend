import { ProgramType } from "@/types/program.type";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Button, Chip } from "@nextui-org/react";
import { ClipboardText, PencilLine, Tag } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalConfirmDelete from "../modal/ModalConfirmDelete";

export default function CardProgram({
  program,
  handleDeleteProgram,
}: {
  program: ProgramType;
  handleDeleteProgram: () => void;
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-[1fr_max-content] items-center gap-6 rounded-xl border-2 border-gray/20 p-6 hover:cursor-pointer hover:border-gray/40 hover:bg-gray/10">
      <div className="flex items-start gap-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-gray/20 text-gray">
          <ClipboardText weight="bold" size={20} />
        </div>

        <div className="grid gap-4">
          <Link
            href={`/programs/details/${encodeURIComponent(program.id_program)}`}
            className="line-clamp-1 text-[20px] font-bold leading-[120%] text-black hover:text-purple"
          >
            {program.title_program}
          </Link>

          <div className="grid grid-cols-[repeat(2,160px),max-content] items-start">
            <div className="grid gap-1">
              <span className="text-[12px] font-medium text-gray">
                Harga Program:
              </span>
              {program.status_program == "free" ? (
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
                  Program Gratis
                </Chip>
              ) : (
                <h5 className="text-sm font-extrabold text-purple">
                  {formatRupiah(program.price_program)}
                </h5>
              )}
            </div>

            <div className="grid gap-1">
              <span className="text-[12px] font-medium text-gray">
                Jumlah Ujian:
              </span>
              <h5 className="text-sm font-semibold text-black">
                {program.amount_test} Modul Ujian
              </h5>
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
          onClick={() => router.push(`/programs/edit/${program.id_program}`)}
        >
          <PencilLine weight="bold" size={18} />
        </Button>

        <ModalConfirmDelete
          id={program.id_program}
          header="Program"
          title={program.title_program}
          handleDelete={handleDeleteProgram}
        />
      </div>
    </div>
  );
}
