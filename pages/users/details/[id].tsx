import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { SuccessResponse } from "@/types/global.type";
import { formatDate } from "@/utils/formatDate";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
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
  const { data, error, isLoading } = useSWR<
    SuccessResponse<DetailsUserResponse>
  >({
    url: `/admin/users/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

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
                ["Dibuat Pada", `${formatDate(data?.data.created_at ?? "-")}`],
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
