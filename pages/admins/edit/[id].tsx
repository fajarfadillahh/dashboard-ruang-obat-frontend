import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { AdminType } from "@/types/admin.type";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { handleKeyDown } from "@/utils/handleKeyDown";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FloppyDisk, Lock, User, UserGear } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  fullname: string;
  role: string;
  password: string;
  access_key: string;
};

type DataResponse = {
  admin?: AdminType;
  token?: string;
  error?: ErrorDataType;
};

export default function EditAdminPage({
  admin,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [input, setInput] = useState<InputType>({
    fullname: `${admin?.fullname}`,
    role: `${admin?.role}`,
    password: "",
    access_key: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  async function handleEditAdmin() {
    setLoading(true);

    try {
      await fetcher({
        url: "/admins",
        method: "PATCH",
        token,
        data: {
          admin_id: admin?.admin_id,
          ...input,
        },
      });

      toast.success("Berhasil Mengubah Data Admin");
      router.push("/admins");
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  useEffect(() => {
    const isFormValid =
      input.fullname && input.role && input.password && input.access_key;

    setIsButtonDisabled(!isFormValid);
  }, [input]);

  return (
    <Layout title="Edit Admin" className="scrollbar-hide">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="border-gray/200 grid gap-1 border-b-2 border-dashed py-8">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Edit Admin 🧑🏽
            </h1>
            <p className="font-medium text-gray">
              Sesuaikan kembali data admin yang sudah dibuat.
            </p>
          </div>

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
                  value={input.fullname}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      [e.target.name]: e.target.value,
                    })
                  }
                  startContent={
                    <User
                      weight="bold"
                      size={18}
                      className="text-default-600"
                    />
                  }
                  classNames={{
                    input:
                      "font-semibold placeholder:font-normal placeholder:text-default-600",
                  }}
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
                onChange={(e) => {
                  setInput({
                    ...input,
                    [e.target.name]: e.target.value,
                  });

                  if (e.target.value.length < 8) {
                    setErrors({
                      ...errors,
                      password: "Minimal 8 karakter",
                    });
                  } else {
                    setErrors({
                      ...errors,
                      password: null,
                    });
                  }
                }}
                isInvalid={
                  errors ? (errors.password ? true : false) : undefined
                }
                errorMessage={
                  errors ? (errors.password ? errors.password : null) : null
                }
                startContent={
                  <Lock weight="bold" size={18} className="text-default-600" />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
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
                onKeyDown={(e) => handleKeyDown(e, handleEditAdmin)}
                startContent={
                  <Lock weight="bold" size={18} className="text-default-600" />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
              />
            </div>

            <Button
              isLoading={loading}
              isDisabled={isButtonDisabled || loading}
              variant="solid"
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleEditAdmin}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Simpan Perubahan"}
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<DataResponse> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: `/admins/${encodeURIComponent(params?.id as string)}`,
      method: "GET",
      token,
    })) as SuccessResponse<AdminType>;

    return {
      props: {
        admin: response.data,
        token,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
