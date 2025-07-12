import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { SuccessResponse } from "@/types/global.type";
import { DetailsUserResponse } from "@/types/user.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import { Button, Checkbox, Chip, Input } from "@nextui-org/react";
import {
  ArrowClockwise,
  CheckCircle,
  EnvelopeSimple,
  PencilLine,
  Phone,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputState = {
  email: string;
  phone_number: string;
};

export default function DetailsUserPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsUserResponse>
  >({
    url: `/admin/users/${encodeURIComponent(id)}`,
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputState>({
    email: "",
    phone_number: "",
  });
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEditDataUser(user_id: string, data: InputState) {
    setLoading(true);

    try {
      const payload = {
        ...data,
        user_id,
        type: "edit",
      };

      await fetcher({
        url: "/admin/users",
        method: "PATCH",
        data: payload,
        token,
      });

      mutate();
      toast.success("Data pengguna berhasil diperbarui");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error), { duration: 5000 });
    }
  }

  async function handleResetPassword(user_id: string) {
    setLoading(true);

    try {
      const payload = {
        user_id,
        type: "reset",
      };

      await fetcher({
        url: "/admin/users",
        method: "PATCH",
        data: payload,
        token,
      });

      mutate();
      toast.success("Password pengguna berhasil direset", {
        duration: 6000,
      });
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  function isFormEmpty() {
    return Object.values(input).every((value) => value.trim() !== "");
  }

  if (error) {
    return (
      <Layout title="Detail Pengguna">
        <Container>
          <ErrorPage
            {...{
              status_code: error.status_code,
              message: error.error.message,
              name: error.error.name,
            }}
          />
        </Container>
      </Layout>
    );
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="Detail Pengguna" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="Detail Pengguna 🧑🏽‍💻"
          text="Anda bisa melihat data pengguna lebih detail disini"
        />

        <div className="mb-8 grid grid-cols-[650px_auto] items-center gap-16">
          <div className="flex items-start gap-4 rounded-xl border-2 border-l-8 border-gray/20 p-8">
            <div className="grid flex-1 gap-1.5">
              {[
                ["ID Pengguna", `${data?.data.user_id}`],
                ["Nama Lengkap", `${data?.data.fullname}`],
                ["Email", `${data?.data.email}`],
                [
                  "Jenis Kelamin",
                  `${data?.data.gender === "M" ? "Laki-Laki" : "Perempuan"}`,
                ],
                ["No. Telpon", `${data?.data.phone_number}`],
                ["Asal Kampus", `${data?.data.university}`],
                ["Dibuat Pada", `${formatDate(data?.data.created_at ?? "-")}`],
                [
                  "Status",
                  <Chip
                    key={data?.data.user_id as string}
                    variant="flat"
                    size="sm"
                    color={data?.data.is_verified ? "success" : "danger"}
                    startContent={
                      data?.data.is_verified ? (
                        <CheckCircle weight="duotone" size={18} />
                      ) : (
                        <XCircle weight="duotone" size={18} />
                      )
                    }
                    classNames={{
                      base: "px-2 gap-1",
                      content: "font-bold capitalize",
                    }}
                  >
                    {data?.data.is_verified
                      ? "Terverifikasi"
                      : "Belum Terverifikasi"}
                  </Chip>,
                ],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-[150px_2px_1fr] gap-4 text-sm font-medium text-black"
                >
                  <p>{label}</p>
                  <span>:</span>
                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </div>

            <ModalConfirm
              hideCloseButton={true}
              trigger={
                <Button
                  size="sm"
                  color="secondary"
                  variant="light"
                  startContent={<PencilLine weight="duotone" size={16} />}
                  className="font-semibold"
                >
                  Edit Data
                </Button>
              }
              header={<h1 className="font-bold text-black">Edit Data User</h1>}
              body={
                <div className="grid gap-6">
                  <p className="leading-[170%] text-gray">
                    Pastikan Anda mengisi data dengan lengkap dan benar sebelum
                    melakukan perubahan pada akun pengguna.
                  </p>

                  <Input
                    type="email"
                    variant="flat"
                    label="Alamat Email"
                    labelPlacement="outside"
                    placeholder="Contoh: ahmad@example.com"
                    name="email"
                    value={input.email}
                    onChange={(e) =>
                      setInput({ ...input, email: e.target.value })
                    }
                    startContent={
                      <EnvelopeSimple
                        weight="duotone"
                        size={18}
                        className="text-gray"
                      />
                    }
                    classNames={customStyleInput}
                  />

                  <Input
                    type="text"
                    inputMode="numeric"
                    variant="flat"
                    label="Nomor Telpon"
                    labelPlacement="outside"
                    placeholder="Contoh: 08XXXXXXXXXX"
                    name="phone_number"
                    value={input.phone_number}
                    onChange={(e) =>
                      setInput({ ...input, phone_number: e.target.value })
                    }
                    startContent={
                      <Phone weight="duotone" size={18} className="text-gray" />
                    }
                    classNames={customStyleInput}
                  />
                </div>
              }
              footer={(onClose: any) => (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      onClose();
                      setLoading(false);
                      setInput({
                        email: "",
                        phone_number: "",
                      });
                    }}
                    className="font-bold"
                  >
                    Tutup
                  </Button>

                  <Button
                    isLoading={loading}
                    isDisabled={!isFormEmpty() || loading}
                    color="secondary"
                    className="font-bold"
                    onClick={() => {
                      handleEditDataUser(data?.data.user_id as string, {
                        email: input.email,
                        phone_number: input.phone_number,
                      });
                      setTimeout(() => {
                        onClose();
                        setLoading(false);
                        setInput({
                          email: "",
                          phone_number: "",
                        });
                      }, 1000);
                    }}
                  >
                    Simpan Data
                  </Button>
                </>
              )}
            />
          </div>

          <LogoRuangobat className="h-[200px] w-auto justify-self-center text-gray/20 grayscale" />
        </div>

        <div className="flex items-center justify-between gap-20 rounded-xl border-2 border-warning bg-warning/50 [padding:1rem_2rem]">
          <h4 className="font-bold text-black">Reset Password Pengguna?</h4>

          <ModalConfirm
            hideCloseButton={true}
            trigger={
              <Button
                color="warning"
                size="sm"
                startContent={<ArrowClockwise weight="duotone" size={18} />}
                className="font-semibold"
              >
                Reset Password
              </Button>
            }
            header={<h1 className="font-bold text-black">Reset Password!</h1>}
            body={
              <div className="grid gap-8">
                <p className="leading-[170%] text-gray">
                  Apakah anda yakin ingin me-reset password pada akun ini?{" "}
                  <br />
                  Jika ya, maka password pada akun ini menjadi{" "}
                  <strong className="font-black text-purple">
                    default#ruangobat.id
                  </strong>
                </p>

                <Checkbox
                  size="md"
                  color="secondary"
                  isSelected={isSelected}
                  onValueChange={setIsSelected}
                  classNames={{
                    label: "leading-[170%] text-gray",
                  }}
                >
                  Ya, saya ingin me-reset password pada akun ini
                </Checkbox>
              </div>
            }
            footer={(onClose: any) => (
              <>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose(), setIsSelected(false);
                  }}
                  className="font-semibold"
                >
                  Tutup
                </Button>

                <Button
                  isLoading={loading}
                  isDisabled={!isSelected || loading}
                  color="danger"
                  onClick={() => {
                    handleResetPassword(data?.data.user_id as string),
                      setTimeout(() => {
                        onClose();
                        setLoading(false);
                        setIsSelected(false);
                      }, 1000);
                  }}
                  className="font-semibold"
                >
                  Reset Sekarang
                </Button>
              </>
            )}
          />
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      id,
    },
  };
});
