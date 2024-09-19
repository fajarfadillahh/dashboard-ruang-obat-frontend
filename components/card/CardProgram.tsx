import { ProgramType } from "@/types/program.type";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Button, Chip, Tooltip } from "@nextui-org/react";
import { ClipboardText, PencilLine, Tag, Trash } from "@phosphor-icons/react";
import Link from "next/link";

export default function CardProgram(program: ProgramType) {
  return (
    <div className="grid grid-cols-[1fr_repeat(2,150px)_200px_68px] items-center gap-4 rounded-xl border-2 border-gray/20 p-6 hover:cursor-pointer hover:border-gray/40 hover:bg-gray/10">
      <div className="flex items-center gap-4 justify-self-start">
        <div className="flex size-10 items-center justify-center rounded-full bg-gray/20 text-gray">
          <ClipboardText weight="bold" size={20} />
        </div>

        <div>
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
          <p className="mt-1 text-[12px] font-semibold text-gray">
            ID Program : {program.id_program}
          </p>
        </div>
      </div>

      <div className="text-sm font-semibold text-black">
        {program.amout_proram} Modul Ujian
      </div>

      {program.status_program == "free" ? (
        <Chip
          variant="flat"
          color="default"
          size="sm"
          startContent={<Tag weight="bold" size={16} />}
          classNames={{
            base: "px-2 gap-1",
            content: "font-bold",
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

      <div className="inline-flex items-center gap-1">
        <Button isIconOnly variant="light" size="sm" className="text-gray">
          <PencilLine weight="bold" size={18} />
        </Button>

        <Button
          isIconOnly
          variant="light"
          size="sm"
          color="danger"
          onClick={() => confirm("Apakah anda yakin?")}
        >
          <Trash weight="bold" size={18} />
        </Button>
      </div>
    </div>
  );
}
