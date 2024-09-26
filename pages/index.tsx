import { handleKeyDown } from "@/utils/handleKeyDown";
import { Button, Input } from "@nextui-org/react";
import { Lock, User } from "@phosphor-icons/react";
import Head from "next/head";
import { useState } from "react";

export default function LoginPage() {
  const [input, setInput] = useState({});
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 3000);
  }

  return (
    <>
      <Head>
        <title>Login | Ruangobat.id</title>
      </Head>

      <main className="mx-auto flex h-screen max-w-[1200px] items-center justify-center py-20">
        <div className="grid w-[480px] gap-8 justify-self-center">
          <div className="text-center">
            <h1 className="text-[42px] font-bold -tracking-wide text-black">
              Hi, Admin Ruangobat 👋
            </h1>
            <p className="font-medium text-gray">
              Silakan login dulu untuk bisa mengatur semuanya
            </p>
          </div>

          <div className="grid gap-2">
            <Input
              type="text"
              variant="flat"
              color="default"
              labelPlacement="outside"
              placeholder="Username"
              name="username"
              onChange={(e) =>
                setInput({
                  ...input,
                  [e.target.name]: e.target.value,
                })
              }
              startContent={
                <User weight="bold" size={18} className="text-gray" />
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
              name="password"
              onChange={(e) =>
                setInput({
                  ...input,
                  [e.target.name]: e.target.value,
                })
              }
              onKeyDown={(e) => handleKeyDown(e, handleLogin)}
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
            isLoading={loading ? true : false}
            isDisabled={Object.keys(input).length < 2 || loading ? true : false}
            variant="solid"
            color="secondary"
            onClick={handleLogin}
            className="font-bold"
          >
            {loading ? "Tunggu Sebentar..." : "Masuk Sekarang"}
          </Button>
        </div>
      </main>
    </>
  );
}
