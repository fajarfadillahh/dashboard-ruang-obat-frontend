import { Button } from "@nextui-org/react";
import { ArrowClockwise } from "@phosphor-icons/react";
import Image from "next/image";

type ErrorProps = {
  status_code: number;
  name: string;
  message: string;
};

export default function ErrorPage({ status_code, message, name }: ErrorProps) {
  return (
    <section className="grid w-full grid-cols-2 items-center gap-8 pt-8">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-[42px] font-black capitalize leading-[120%] -tracking-wide text-black">
            Telah terjadi kesalahan sistem atau server
          </h1>
          <p className="font-medium leading-[170%] text-gray">
            Sepertinya telah terjadi kesalahan pada sistem. Silakan{" "}
            <strong className="font-black text-purple">muat ulang</strong>{" "}
            halaman atau hubungi tim developer jika masalah ini terus berlanjut.
          </p>
        </div>

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

        <Button
          variant="solid"
          color="secondary"
          startContent={<ArrowClockwise weight="bold" size={18} />}
          onClick={() => window.location.reload()}
          className="mt-4 w-max px-4 font-bold"
        >
          Muat Ulang Halaman
        </Button>
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
