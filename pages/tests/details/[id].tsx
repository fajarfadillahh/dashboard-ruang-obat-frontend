import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { DetailsTestResponse } from "@/types/test.type";
import { formatDateWithoutTime } from "@/utils/formatDate";
import { getStatusColor, getStatusIcon } from "@/utils/getStatus";
import { Button, Chip, Pagination } from "@nextui-org/react";
import { PencilLine } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery, id: string) {
  return `/admin/tests/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
}

export default function DetailsTestPage({
  token,
  params,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<
    SuccessResponse<DetailsTestResponse>
  >({
    url: getUrl(query, params?.id as string),
    method: "GET",
    token,
  });
  const [client, setClient] = useState<boolean>(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return;
  }

  if (error) {
    return (
      <Layout title={`${data?.data.title}`}>
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
    <Layout title={`${data?.data.title}`}>
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="grid grid-cols-[1fr_max-content] items-start gap-16">
              <div className="grid gap-6 pb-8">
                <div>
                  <h4 className="mb-2 text-3xl font-bold capitalize leading-[120%] -tracking-wide text-black">
                    {data?.data.title}
                  </h4>
                  <p className="max-w-[700px] font-medium leading-[170%] text-gray">
                    {data?.data.description}
                  </p>
                </div>

                <div className="flex items-start gap-8">
                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Tanggal Mulai:
                    </span>
                    <h1 className="font-semibold text-black">
                      {formatDateWithoutTime(`${data?.data.start}`)}
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Tanggal Selesai:
                    </span>
                    <h1 className="font-semibold text-black">
                      {formatDateWithoutTime(`${data?.data.end}`)}
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Durasi Pengerjaan:
                    </span>
                    <h1 className="font-semibold text-black">
                      {data?.data.duration} Menit
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Jumlah Soal:
                    </span>
                    <h1 className="font-semibold text-black">
                      {data?.data.total_questions} Butir
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Status Ujian:
                    </span>

                    <Chip
                      variant="flat"
                      size="sm"
                      color={getStatusColor(data?.data.status as string)}
                      startContent={getStatusIcon(data?.data.status as string)}
                      classNames={{
                        base: "px-2 gap-1",
                        content: "font-bold capitalize",
                      }}
                    >
                      {data?.data.status}
                    </Chip>
                  </div>
                </div>
              </div>

              <Button
                color="secondary"
                startContent={<PencilLine weight="bold" size={18} />}
                onClick={() => router.push(`/tests/edit/${data?.data.test_id}`)}
                className="font-bold"
              >
                Edit Ujian
              </Button>
            </div>

            <div className="grid pt-8">
              <div className="sticky left-0 top-0 z-50 bg-white py-4">
                <h5 className="font-bold text-black">Daftar Soal</h5>
              </div>

              <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
                {data?.data.questions.length === 0 ? (
                  <EmptyData text="Belum ada soal diujian ini" />
                ) : (
                  data?.data.questions.map((question) => (
                    <CardQuestionPreview
                      key={question.question_id}
                      index={question.number}
                      question={question}
                    />
                  ))
                )}
              </div>

              {data?.data.questions.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={data?.data.page as number}
                  total={data?.data.total_pages as number}
                  onChange={(e) => {
                    router.push({
                      pathname: `/tests/details/${id}`,
                      query: {
                        page: e,
                      },
                    });
                  }}
                  className="justify-self-center pt-8"
                  classNames={{
                    cursor: "bg-purple text-white",
                  }}
                />
              ) : null}
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  id: string;
  params: ParsedUrlQuery;
  query: ParsedUrlQuery;
}> = async ({ req, params, query }) => {
  const id = params?.id as string;

  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
      query,
      id,
    },
  };
};
