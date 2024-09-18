import { Button, Input } from "@nextui-org/react";
import { EnvelopeSimple, Lock } from "@phosphor-icons/react";
import Head from "next/head";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login Admin Page</title>
      </Head>

      <main className="mx-auto flex h-screen max-w-[1200px] items-center justify-center py-20">
        <div className="grid w-[480px] gap-8 justify-self-center">
          <div className="text-center">
            <h1 className="text-[42px] font-bold -tracking-wide text-black">
              Hi, admin Ruangobat 👋
            </h1>
            <p className="font-medium text-gray">
              Silakan login dulu untuk bisa mengatur semuanya
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              type="email"
              variant="flat"
              color="default"
              labelPlacement="outside"
              placeholder="Alamat Email"
              startContent={
                <EnvelopeSimple weight="bold" size={18} className="text-gray" />
              }
              classNames={{
                input:
                  "font-semibold placeholder:font-semibold placeholder:text-gray",
              }}
            />

            <Input
              type="password"
              variant="flat"
              color="default"
              labelPlacement="outside"
              placeholder="Kata Sandi"
              startContent={
                <Lock weight="bold" size={18} className="text-gray" />
              }
              classNames={{
                input:
                  "font-semibold placeholder:font-semibold placeholder:text-gray",
              }}
            />
          </div>

          <Button
            variant="solid"
            color="secondary"
            onClick={() => (window.location.href = "/dashboard")}
            className="font-bold"
          >
            Masuk Sekarang
          </Button>
        </div>
      </main>
    </>
  );
}
