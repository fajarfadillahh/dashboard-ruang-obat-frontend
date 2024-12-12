import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { SuccessResponse } from "@/types/global.type";
import { DetailsUserResponse } from "@/types/user.type";
import { getErrorMessage } from "@/utils/ errorHandler";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { Button, Checkbox, Input } from "@nextui-org/react";
import {
  ArrowClockwise,
  EnvelopeSimple,
  PencilLine,
  Phone,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  email: string;
  phone_number: string;
};

export default function DetailsUserPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsUserResponse>
  >({
    url: `/admin/users/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputType>({
    email: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<any>();
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEditDataUser(user_id: string, data: InputType) {
    setLoading(true);

    try {
      await fetcher({
        url: "/admin/users",
        method: "PATCH",
        data: {
          user_id,
          type: "edit",
          ...data,
        },
        token,
      });

      mutate();
      toast.success("Data User Berhasil DiPerbarui");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      if (error?.status_code) {
        const customMessages = {
          400: "Email atau Nomor Telpon Sudah Digunakan",
        };

        toast.error(getErrorMessage(error?.status_code, customMessages), {
          duration: 6000,
        });
      }
    }
  }

  async function handleResetPassword(user_id: string) {
    setLoading(true);

    try {
      await fetcher({
        url: "/admin/users",
        method: "PATCH",
        data: {
          user_id,
          type: "reset",
        },
        token,
      });

      mutate();
      toast.success("Password User Berhasil Direset", {
        duration: 6000,
      });
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      if (error?.status_code) {
        return toast.error(getErrorMessage(error?.status_code));
      }
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
      <Container>
        <section className="grid gap-8">
          <ButtonBack href="/users" />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="grid gap-8 pb-12">
              <TitleText
                title="Detail Pengguna 🧑🏽‍💻"
                text="Anda bisa melihat data pengguna lebih detail disini"
              />

              <div className="grid grid-cols-[650px_auto] items-center gap-16">
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
                      [
                        "Dibuat Pada",
                        `${formatDate(data?.data.created_at ?? "-")}`,
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
                        variant="solid"
                        color="secondary"
                        size="sm"
                        startContent={<PencilLine weight="bold" size={16} />}
                        className="font-bold"
                      >
                        Edit Data
                      </Button>
                    }
                    header={
                      <h1 className="font-bold text-black">Edit Data User</h1>
                    }
                    body={
                      <div className="grid gap-4">
                        <p className="max-w-[400px] text-sm font-medium leading-[170%] text-gray">
                          Pastikan Anda mengisi data dengan lengkap dan benar
                          sebelum melakukan perubahan pada akun pengguna.
                        </p>

                        <div className="grid gap-2 pb-6">
                          <Input
                            autoComplete="off"
                            type="email"
                            variant="flat"
                            labelPlacement="outside"
                            placeholder="Alamat Email"
                            name="email"
                            value={input.email}
                            onChange={(e) => {
                              const email = e.target.value;
                              const emailRegex =
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                              const isValidEmail = emailRegex.test(
                                email.toLowerCase(),
                              );

                              setInput({
                                ...input,
                                [e.target.name]: email.toLowerCase(),
                              });

                              setErrors({
                                ...errors,
                                email: isValidEmail
                                  ? null
                                  : "Email Tidak Valid",
                              });
                            }}
                            startContent={
                              <EnvelopeSimple
                                weight="bold"
                                size={18}
                                className="text-gray"
                              />
                            }
                            classNames={{
                              input:
                                "font-semibold placeholder:font-semibold placeholder:text-gray",
                            }}
                            isInvalid={!!errors?.email}
                            errorMessage={errors?.email}
                          />

                          <Input
                            autoComplete="off"
                            type="text"
                            inputMode="numeric"
                            variant="flat"
                            labelPlacement="outside"
                            placeholder="Nomor Telpon"
                            name="phone_number"
                            value={input.phone_number}
                            onChange={(e) => {
                              const { value, name } = e.target;
                              setInput({ ...input, [name]: value });

                              if (name === "phone_number") {
                                const phoneNumberRegex =
                                  /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
                                setErrors({
                                  ...errors,
                                  phone_number: value
                                    ? phoneNumberRegex.test(value)
                                      ? null
                                      : "Nomor Telpon Tidak Valid"
                                    : null,
                                });
                              }
                            }}
                            startContent={
                              <Phone
                                weight="bold"
                                size={18}
                                className="text-gray"
                              />
                            }
                            classNames={{
                              input:
                                "font-semibold placeholder:font-semibold placeholder:text-gray",
                            }}
                            isInvalid={!!errors?.phone_number}
                            errorMessage={errors?.phone_number}
                          />
                        </div>
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
                          Simpan Data Terbaru
                        </Button>
                      </>
                    )}
                  />
                </div>

                <LogoRuangobat className="h-[200px] w-auto justify-self-center text-gray/20 grayscale" />
              </div>
            </div>

            <div className="pt-8">
              <div className="flex items-center justify-between gap-20 rounded-xl border-2 border-warning bg-warning/20 [padding:1rem_2rem]">
                <h4 className="font-bold leading-[120%] text-black">
                  Reset Password Pengguna?
                </h4>

                <ModalConfirm
                  hideCloseButton={true}
                  trigger={
                    <Button
                      variant="solid"
                      color="warning"
                      size="sm"
                      startContent={<ArrowClockwise weight="bold" size={18} />}
                      className="font-bold"
                    >
                      Reset Password
                    </Button>
                  }
                  header={
                    <h1 className="font-bold text-black">Reset Password!</h1>
                  }
                  body={
                    <div className="grid gap-8">
                      <p className="text-sm font-medium leading-[170%] text-gray">
                        Apakah anda yakin ingin me-reset password pada akun ini?{" "}
                        <br />
                        Jika ya, maka password akun ini menjadi{" "}
                        <strong className="font-black text-purple">
                          default#ruangobat.id
                        </strong>
                      </p>

                      <Checkbox
                        size="md"
                        color="secondary"
                        isSelected={isSelected}
                        onValueChange={setIsSelected}
                      >
                        <span className="text-sm font-medium leading-[170%] text-gray">
                          Ya, saya ingin me-reset password pada akun ini
                        </span>
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
                        className="font-bold"
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
                        className="font-bold"
                      >
                        Reset Sekarang
                      </Button>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  params: ParsedUrlQuery;
}> = async ({ req, params }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
    },
  };
};
