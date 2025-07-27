import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { Mentor } from "@/types/mentor.type";
import { formatDate } from "@/utils/formatDate";
import { Chip, Skeleton } from "@nextui-org/react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import useSWR from "swr";

export default function DetailsMentorPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<Mentor>>({
    url: `/admin/mentors/${encodeURIComponent(id)}`,
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

  return (
    <Layout title="Detail Mentor" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack href="/mentors" />

        <div className="grid gap-8 pb-12">
          <TitleText
            title="Detail Mentor 🧑🏽"
            text="Anda bisa melihat data mentor lebih detail disini"
          />

          <div className="grid grid-cols-[600px_1fr] items-start gap-16">
            {isLoading ? (
              <Skeleton className="h-[275px] w-full rounded-xl" />
            ) : (
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
                    [
                      "Status",
                      <Chip
                        key={data?.data.mentor_id}
                        variant="flat"
                        size="sm"
                        color={data?.data.is_show ? "success" : "danger"}
                        startContent={
                          data?.data.is_show ? (
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
                        {data?.data.is_show
                          ? "Tampil di homepage"
                          : "Tidak tampil di homepage"}
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

                <div className="grid gap-1">
                  <h1 className="font-bold text-black">Deskripsi Mentor</h1>
                  <div
                    className="preventive-list preventive-table list-outside text-sm leading-[170%] text-black"
                    dangerouslySetInnerHTML={{
                      __html: data?.data.description as string,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {isLoading ? (
              <Skeleton className="h-full w-[300px] rounded-xl" />
            ) : (
              <Image
                priority
                src={data?.data.img_url as string}
                alt={"mentor img"}
                width={500}
                height={500}
                className="aspect-square size-[300px] rounded-xl object-cover object-center"
              />
            )}
          </div>
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
