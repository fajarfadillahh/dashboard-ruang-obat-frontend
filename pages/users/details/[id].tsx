import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { Button, Checkbox } from "@nextui-org/react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type DetailsUserResponse = {
  user_id: string;
  fullname: string;
  email: string;
  phone_number: string;
  gender: string;
  university: string;
  created_at: string;
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
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

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
      toast.success("Password User Berhasil Di Reset");
    } catch (error) {
      toast.error("Telah Terjadi Kesalahan, Silakan Coba Lagi");
      setLoading(false);
      console.error(error);
    }
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

              <div className="grid grid-cols-2 items-center gap-16">
                <div className="grid gap-[6px] rounded-xl border-2 border-l-8 border-gray/20 p-8">
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

                <LogoRuangobat className="h-[200px] w-auto justify-self-center text-gray/20 grayscale" />
              </div>
            </div>

            <div className="pt-8">
              <div className="flex items-center justify-between rounded-xl border-2 border-warning bg-warning/20 p-6">
                <h4 className="text-[18px] font-bold leading-[120%] text-black">
                  Reset Password Pengguna
                </h4>

                <ModalConfirm
                  trigger={
                    <Button
                      variant="solid"
                      color="warning"
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
