import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { validateFullname, validatePassword } from "@/utils/formValidator";
import { getError } from "@/utils/getError";
import { handleKeyDown } from "@/utils/handleKeyDown";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FloppyDisk, Lock, User, UserGear } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputState = {
  fullname: string;
  role: string;
  password: string;
  access_key: string;
};

type ErrorState = {
  fullname?: string;
  password?: string;
};

export default function CreateAdminPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [input, setInput] = useState<InputState>({
    fullname: "",
    role: "",
    password: "",
    access_key: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    customValidator?: (value: string) => string | null,
  ) {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (customValidator) {
      const error = customValidator(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }

  async function handleCreateAdmin() {
    setLoading(true);

    try {
      await fetcher({
        url: "/auth/register/admins",
        method: "POST",
        token,
        data: input,
      });

      toast.success("Admin berhasil dibuat");
      router.push("/admins");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      if (error?.status_code === 400) return toast.error("Kunci akses salah!");
      if (error?.status_code === 403)
        return toast.error("Kunci akses ditolak! silakan coba lagi");
      toast.error(getError(error));
    }
  }

  useEffect(() => {
    const isFormValid =
      input.fullname && input.role && input.password && input.access_key;

    setIsButtonDisabled(!isFormValid);
  }, [input]);

  return (
    <Layout title="Buat Admin" className="scrollbar-hide">
      <Container>
        <section className="grid">
          <ButtonBack />

          <TitleText
            title="Buat Admin 🧑🏽"
            text="Tambahkan admin untuk dapat membantu yang lain"
            className="border-b-2 border-dashed border-gray/20 py-8"
          />

          <div className="grid max-w-[700px] gap-8 pt-8">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Nama Lengkap"
                  labelPlacement="outside"
                  placeholder="Masukan Nama Lengkap"
                  name="fullname"
                  onChange={(e) => handleInputChange(e, validateFullname)}
                  startContent={
                    <User
                      weight="bold"
                      size={18}
                      className="text-default-600"
                    />
                  }
                  classNames={customStyleInput}
                  isInvalid={!!errors.fullname}
                  errorMessage={errors.fullname}
                />

                <Select
                  isRequired
                  aria-label="select role"
                  variant="flat"
                  label="Role"
                  labelPlacement="outside"
                  placeholder="Pilih Role"
                  name="role"
                  selectedKeys={[input.role]}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      [e.target.name]: e.target.value,
                    })
                  }
                  startContent={
                    <UserGear weight="bold" size={18} className="text-gray" />
                  }
                  classNames={{
                    value: "font-semibold text-gray",
                  }}
                >
                  <SelectItem key="admin">Admin</SelectItem>
                  <SelectItem key="superadmin">Superadmin</SelectItem>
                </Select>
              </div>

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Kata Sandi"
                labelPlacement="outside"
                placeholder="Masukan Kata Sandi"
                name="password"
                onChange={(e) => handleInputChange(e, validatePassword)}
                startContent={
                  <Lock weight="bold" size={18} className="text-default-600" />
                }
                classNames={customStyleInput}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
              />

              <Input
                isRequired
                type="password"
                variant="flat"
                label="Kunci Akses"
                labelPlacement="outside"
                placeholder="Masukan Kunci Akses"
                name="access_key"
                onChange={(e) =>
                  setInput({
                    ...input,
                    [e.target.name]: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, handleCreateAdmin)}
                startContent={
                  <Lock weight="bold" size={18} className="text-default-600" />
                }
                classNames={customStyleInput}
              />
            </div>

            <Button
              isLoading={loading}
              isDisabled={isButtonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleCreateAdmin}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Buat Admin"}
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
