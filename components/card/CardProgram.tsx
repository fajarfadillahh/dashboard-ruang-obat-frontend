import { ProgramType } from "@/types/program.type";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Button, Chip, Tooltip } from "@nextui-org/react";
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
    <div className="grid grid-cols-[repeat(2,1fr)_80px] items-center gap-6 rounded-xl border-2 border-gray/20 p-6 hover:cursor-pointer hover:border-gray/40 hover:bg-gray/10">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-gray/20 text-gray">
          <ClipboardText weight="bold" size={20} />
        </div>

        <div className="grid flex-1 gap-1">
          <Tooltip
            content={program.title_proram}
            placement="top-start"
            classNames={{
              content: "max-w-[350px] font-semibold text-black",
            }}
          >
            <Link
              href={`/programs/details/${encodeURIComponent(program.id_program)}`}
              className="line-clamp-1 text-sm font-bold leading-[120%] text-black hover:text-purple"
            >
              {program.title_proram}
            </Link>
          </Tooltip>
          <p className="text-[12px] font-semibold text-gray">
            ID Program : {program.id_program}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[120px_150px_1fr] items-center gap-2">
        <div className="text-sm font-semibold text-black">
          {program.amout_proram} Modul Ujian
        </div>

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
              content: "font-bold text-black",
            }}
          >
            Program Gratis
          </Chip>
        ) : (
          <div className="text-sm font-bold text-purple">
            {formatRupiah(program.price_program)}
          </div>
        )}

        <div className="text-sm font-semibold text-black">
          {formatDate(program.created_at)}
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
          title={program.title_proram}
          handleDelete={handleDeleteProgram}
        />
      </div>
    </div>
  );
}
