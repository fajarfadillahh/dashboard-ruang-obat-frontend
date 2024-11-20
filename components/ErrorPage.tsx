import { useErrorContent } from "@/components/ErrorContent";
import { Button } from "@nextui-org/react";
import { ArrowLeft } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/router";

type ErrorProps = {
  status_code: number;
  name: string;
  message: string;
};

export default function ErrorPage({ status_code, message, name }: ErrorProps) {
  const router = useRouter();
  const errorContent = useErrorContent();

  const { title, description, buttonText, buttonAction, buttonIcon } =
    errorContent[status_code as keyof typeof errorContent] ||
    errorContent.default;

  return (
    <section className="grid w-full grid-cols-2 items-center gap-8 pt-8">
      <div className="grid gap-6">
        {message ===
        "Cannot read properties of undefined (reading 'program_id')" ? (
          <div className="grid gap-2">
            <h1 className="text-[42px] font-black capitalize leading-[120%] -tracking-wide text-black">
              Uppss... Daftar nilai tidak di temukan
            </h1>
            <p className="font-medium leading-[170%] text-gray">
              Ujian ini belum digunakan pada Program mana pun. Silakan gunakan
              dulu ujian terkait untuk melihat daftar nilai.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            <h1 className="text-[42px] font-black capitalize leading-[120%] -tracking-wide text-black">
              {title}
            </h1>
            {description}
          </div>
        )}

        <div className="grid items-start gap-[2px]">
          {[
            ["Status Kode", `${status_code}`],
            ["Nama Error", `${name}`],
            ["Pesan Error", `${message}`],
          ].map(([text, value], index) => (
            <div key={index} className="grid grid-cols-[100px_2px_1fr] gap-4">
              <h4 className="font-medium text-gray">{text}</h4>
              <span className="font-medium text-gray">:</span>
              <h4 className="font-extrabold text-danger">{value}</h4>
            </div>
          ))}
        </div>

        {message ===
        "Cannot read properties of undefined (reading 'program_id')" ? (
          <Button
            variant="solid"
            color="secondary"
            startContent={<ArrowLeft weight="bold" size={18} />}
            onClick={() => router.push("/tests")}
            className="mt-4 w-max px-8 font-bold"
          >
            Halaman Daftar Ujian
          </Button>
        ) : (
          <Button
            variant="solid"
            color="secondary"
            startContent={buttonIcon}
            onClick={buttonAction}
            className="mt-4 w-max px-8 font-bold"
          >
            {buttonText}
          </Button>
        )}
      </div>

      <Image
        priority
        src="/img/error-img.svg"
        alt="error img"
        width={1000}
        height={1000}
        className="h-auto w-[400px] justify-self-end"
      />
    </section>
  );
}
