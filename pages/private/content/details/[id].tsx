import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { SubjectPrivateDetails } from "@/types/private.type";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Button, Chip } from "@nextui-org/react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export default function SubjectPrivateDetailsPage({
  params,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<
    SuccessResponse<SubjectPrivateDetails>
  >({
    url: `/admin/subjects/private/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title="Detail Paket Kelas Private Farmasi">
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
    <Layout
      title="Detail Paket Kelas Private Farmasi"
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-8 pb-12">
            <TitleText
              title="Detail Paket Kelas Private Farmasi 🔏"
              text="Anda bisa melihat data paket lebih detail disini"
            />

            <div className="grid max-w-[600px] gap-10 rounded-xl border-2 border-l-8 border-gray/20 p-8">
              <div className="grid flex-1 gap-1.5">
                {[
                  ["ID Paket", `${data?.data.subject_id}`],
                  ["Nama Paket", `${data?.data.title}`],
                  [
                    "Dibuat Pada",
                    `${formatDate(data?.data.created_at ?? "-")}`,
                  ],
                  [
                    "Status",
                    <Chip
                      key={data?.data.subject_id}
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
                <h1 className="font-bold text-black">Deskripsi Paket</h1>
                <p className="text-sm leading-[170%] text-black">
                  {data?.data.description}
                </p>
              </div>

              <div className="grid gap-2">
                <h1 className="font-bold text-black">Daftar Harga</h1>

                <div className="grid gap-[2px]">
                  {data?.data.subject_part.map((part, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[repeat(2,max-content)_1fr_max-content] items-center gap-2"
                    >
                      <h4 className="text-sm font-bold text-purple">
                        {formatRupiah(part.price)}
                      </h4>
                      <p className="text-sm leading-[170%] text-black">
                        {part.description}
                      </p>
                      <div className="h-1 w-full border-b-2 border-dashed border-gray/20" />
                      <Button
                        variant="light"
                        size="sm"
                        color="secondary"
                        onClick={() => window.open(part.link_order, "_blank")}
                        className="font-bold"
                      >
                        Pilih
                      </Button>
                    </div>
                  ))}
                </div>
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
