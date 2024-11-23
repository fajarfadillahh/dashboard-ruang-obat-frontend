import { getErrorMessage } from "@/utils/ errorHandler";
import { handleKeyDown } from "@/utils/handleKeyDown";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeSlash, Lock, User } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  admin_id: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [input, setInput] = useState<InputType>({
    admin_id: "",
    password: "",
  });
  const [type, setType] = useState("password");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        ...input,
        redirect: false,
      });

      if (response?.error) {
        setLoading(false);
        const { error } = JSON.parse(response?.error);

        toast.error(error.message);
      }

      if (response?.ok) {
        toast.success("Yeay, Anda Berhasil Login!");
        return router.push("/dashboard");
      }
    } catch (error: any) {
      setLoading(false);

      if (error?.status_code) {
        return toast.error(getErrorMessage(error?.status_code));
      }
    }
  }

  function isFormEmpty() {
    return Object.values(input).every((value) => value.trim() !== "");
  }

  return (
    <>
      <Head>
        <title>Login | Ruangobat.id</title>
      </Head>

      <main className="flex h-screen w-full items-center justify-center py-20">
        <div className="grid w-max gap-8 justify-self-center">
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
              placeholder="ID Admin"
              name="admin_id"
              onChange={(e) =>
                setInput({
                  ...input,
                  [e.target.name]: e.target.value,
                })
              }
              onKeyDown={(e) => handleKeyDown(e, handleLogin)}
              startContent={
                <User weight="bold" size={18} className="text-gray" />
              }
              classNames={{
                input:
                  "font-semibold placeholder:font-semibold placeholder:text-gray",
              }}
            />

            <Input
              type={type}
              variant="flat"
              color="default"
              labelPlacement="outside"
              placeholder="Kata Sandi"
              name="password"
              endContent={
                <button
                  onClick={() =>
                    type == "password" ? setType("text") : setType("password")
                  }
                >
                  {type == "password" ? (
                    <Eye
                      weight="bold"
                      size={18}
                      className="cursor-pointer text-gray-600"
                    />
                  ) : (
                    <EyeSlash
                      weight="bold"
                      size={18}
                      className="cursor-pointer text-gray-600"
                    />
                  )}
                </button>
              }
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
            isLoading={loading}
            isDisabled={!isFormEmpty() || loading}
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
