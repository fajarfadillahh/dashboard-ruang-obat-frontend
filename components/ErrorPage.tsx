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
    <section className="flex flex-col items-center justify-center gap-8 pt-8">
      <Image
        priority
        src="/img/500-img.svg"
        alt="500 img"
        width={1000}
        height={500}
        className="h-auto w-[450px]"
      />

      <div className="grid justify-center gap-6">
        <div className="text-center">
          <h1 className="mb-2 text-[38px] font-black leading-[120%] -tracking-wide text-black">
            Hmmm, sepertinya ada sesuatu yang error
          </h1>
          <div className="grid gap-2 rounded-xl border-2 border-l-8 border-gray/20 p-8">
            <div className="grid grid-cols-[150px_2px_1fr] gap-4 font-medium text-black">
              <p>Status Code</p>
              <span>:</span>
              <p className="font-extrabold text-red-500">{status_code}</p>
            </div>
            <div className="grid grid-cols-[150px_2px_1fr] gap-4 font-medium text-black">
              <p>Nama Error</p>
              <span>:</span>
              <p className="font-extrabold text-red-500">{name}</p>
            </div>
            <div className="grid grid-cols-[150px_2px_1fr] gap-4 font-medium text-black">
              <p>Pesan</p>
              <span>:</span>
              <p className="font-extrabold text-red-500">{message}</p>
            </div>
          </div>
          <p className="mx-auto max-w-[580px] font-medium leading-[170%] text-gray">
            Silahkan hubungi tim developer.
          </p>
        </div>

        <Button
          variant="solid"
          color="secondary"
          startContent={<ArrowClockwise weight="bold" size={18} />}
          onClick={() => window.location.reload()}
          className="w-max justify-self-center px-4 font-bold"
        >
          Muat Ulang Halaman
        </Button>
      </div>
    </section>
  );
}
