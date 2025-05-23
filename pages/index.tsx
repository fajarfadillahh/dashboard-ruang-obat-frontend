import { customStyleInput } from "@/utils/customStyleInput";
import { getError } from "@/utils/getError";
import { handleKeyDown } from "@/utils/handleKeyDown";
import { Button, Input } from "@nextui-org/react";
import {
  Eye,
  EyeSlash,
  IconContext,
  Lock,
  UserCircle,
} from "@phosphor-icons/react";
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
  const [passwordType, setPasswordType] = useState("password");
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
        toast.success("Yeay, anda berhasil login!");
        return router.push("/dashboard");
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <>
      <Head>
        <title>Login | Ruangobat.id</title>
      </Head>

      <main className="flex h-screen w-full items-center justify-center py-20">
        <div className="grid w-max gap-8 justify-self-center">
          <div className="grid gap-1 text-center">
            <h1 className="text-4xl font-bold -tracking-wide text-black">
              Hi, Admin RuangObat 👋
            </h1>

            <p className="font-medium text-gray">
              Silakan login dulu untuk bisa mengatur semuanya
            </p>
          </div>

          <IconContext.Provider
            value={{
              weight: "duotone",
              size: 22,
              className: "text-gray",
            }}
          >
            <div className="grid gap-2">
              <Input
                type="text"
                variant="flat"
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
                startContent={<UserCircle />}
                classNames={customStyleInput}
              />

              <Input
                type={passwordType}
                variant="flat"
                labelPlacement="outside"
                placeholder="Kata Sandi"
                name="password"
                endContent={
                  <button
                    onClick={() =>
                      setPasswordType((prevType) =>
                        prevType === "password" ? "text" : "password",
                      )
                    }
                  >
                    {passwordType === "password" ? <Eye /> : <EyeSlash />}
                  </button>
                }
                onChange={(e) =>
                  setInput({
                    ...input,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                startContent={<Lock />}
                classNames={customStyleInput}
              />
            </div>
          </IconContext.Provider>

          <Button
            isLoading={loading}
            isDisabled={
              !Object.values(input).every((value) => value.trim() !== "") ||
              loading
            }
            color="secondary"
            onClick={handleLogin}
            className="font-semibold"
          >
            {loading ? "Tunggu Sebentar..." : "Masuk Sekarang"}
          </Button>
        </div>
      </main>
    </>
  );
}
