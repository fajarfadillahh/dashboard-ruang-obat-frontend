import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { Mentor } from "@/types/mentor.type";
import { formatDate } from "@/utils/formatDate";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export default function DetailsMentorPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<Mentor>>({
    url: `/admin/mentors/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title="Detail Mentor">
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
    <Layout title="Detail Mentor" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack href="/mentors" />

          <div className="grid gap-8 pb-12">
            <TitleText
              title="Detail Mentor 🧑🏽"
              text="Anda bisa melihat data mentor lebih detail disini"
            />

            <div className="grid grid-cols-[600px_1fr] items-start gap-16">
              <div className="grid gap-10 rounded-xl border-2 border-l-8 border-gray/20 p-8">
                <div className="grid flex-1 gap-1.5">
                  {[
                    ["ID Mentor", `${data?.data.mentor_id}`],
                    ["Nama Lengkap", `${data?.data.fullname}`],
                    ["Nama Panggilan", `${data?.data.nickname}`],
                    ["Mentor", `${data?.data.mentor_title}`],
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

                <div className="grid gap-1">
                  <h1 className="font-bold text-black">Deskripsi Mentor</h1>
                  <p
                    className="text-sm font-medium leading-[170%] text-black"
                    dangerouslySetInnerHTML={{
                      __html: data?.data.description as string,
                    }}
                  ></p>
                </div>
              </div>

              <Image
                priority
                src={data?.data.img_url as string}
                alt={"mentor img"}
                width={500}
                height={500}
                className="aspect-square size-[300px] rounded-xl object-cover object-center"
              />
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
