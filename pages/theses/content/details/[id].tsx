import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import VideoComponent from "@/components/VideoComponent";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { Theses } from "@/types/theses.type";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Chip } from "@nextui-org/react";
import { CheckCircle, LinkSimple, XCircle } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export default function ThesesContentDetailsPage({
  params,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<Theses>>({
    url: `/admin/theses/${encodeURIComponent(params.id as string)}`,
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title="Detail Kelas">
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
    <Layout title="Detail Kelas">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-8 pb-12">
            <TitleText
              title="Detail Kelas 📖"
              text="Anda bisa melihat data kelas lebih detail disini"
            />

            <div className="grid grid-cols-[600px_1fr] items-start gap-16">
              <div className="grid gap-10 rounded-xl border-2 border-l-8 border-gray/20 p-8">
                <div className="grid flex-1 gap-1.5">
                  {[
                    ["ID Kelas", `${data?.data.thesis_id}`],
                    ["Nama Kelas", `${data?.data.title}`],
                    [
                      "Harga Kelas",
                      `${formatRupiah(data?.data.price as number)}`,
                    ],
                    [
                      "Dibuat Pada",
                      `${formatDate(data?.data.created_at ?? "-")}`,
                    ],
                    [
                      "Status",
                      <Chip
                        key={data?.data.thesis_id}
                        variant="flat"
                        size="sm"
                        color={data?.data.is_active ? "success" : "danger"}
                        startContent={
                          data?.data.is_active ? (
                            <CheckCircle weight="fill" size={16} />
                          ) : (
                            <XCircle weight="fill" size={16} />
                          )
                        }
                        classNames={{
                          base: "px-2 gap-1",
                          content: "font-bold capitalize",
                        }}
                      >
                        {data?.data.is_active
                          ? "Tampil di homepage"
                          : "Tidak tampil di homepage"}
                      </Chip>,
                    ],
                    [
                      "Link Order",
                      <Link
                        href={data?.data.link_order as string}
                        target="_blank"
                        className="text-purple hover:underline"
                      >
                        Lihat Link Order
                        <LinkSimple
                          weight="bold"
                          size={16}
                          className="ml-1 inline-flex"
                        />
                      </Link>,
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
                  <h1 className="font-bold text-black">Deskripsi Kelas</h1>
                  <p className="text-sm leading-[170%] text-black">
                    {data?.data.description}
                  </p>
                </div>
              </div>

              {data?.data.thumbnail_type === "image" ? (
                <Image
                  priority
                  src={data?.data.thumbnail_url as string}
                  alt={"thumbnail kelas"}
                  width={500}
                  height={500}
                  className="aspect-square size-[300px] rounded-xl object-cover object-center"
                />
              ) : (
                <VideoComponent
                  url={data?.data.thumbnail_url as string}
                  className="aspect-video h-auto w-full rounded-xl"
                />
              )}
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
