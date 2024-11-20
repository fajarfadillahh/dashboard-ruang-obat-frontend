import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import VideoComponent from "@/components/VideoComponent";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { formatDateWithoutTime } from "@/utils/formatDate";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Pagination,
} from "@nextui-org/react";
import {
  CheckCircle,
  ClipboardText,
  ClockCountdown,
  HourglassLow,
  PencilLine,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Suspense, useEffect, useState } from "react";
import useSWR from "swr";

type DetailsTestResponse = {
  status: string;
  test_id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  duration: number;
  questions: {
    question_id: string;
    type: string;
    number: number;
    text: string;
    explanation: string;
    options: {
      text: string;
      option_id: string;
      is_correct: boolean;
    }[];
  }[];
  page: number;
  total_questions: number;
  total_pages: number;
};

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
          <ButtonBack href="/tests" />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="grid grid-cols-[1fr_max-content] items-start gap-16">
              <div className="grid gap-6 pb-8">
                <div>
                  <h4 className="mb-2 text-[28px] font-bold capitalize leading-[120%] -tracking-wide text-black">
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
                      color={
                        data?.data.status === "Belum dimulai"
                          ? "danger"
                          : data?.data.status === "Berlangsung"
                            ? "warning"
                            : "success"
                      }
                      size="sm"
                      startContent={
                        data?.data.status === "Belum dimulai" ? (
                          <ClockCountdown weight="bold" size={16} />
                        ) : data?.data.status === "Berlangsung" ? (
                          <HourglassLow weight="fill" size={16} />
                        ) : (
                          <CheckCircle weight="fill" size={16} />
                        )
                      }
                      classNames={{
                        base: "px-2 gap-1",
                        content: "font-semibold capitalize",
                      }}
                    >
                      {data?.data.status}
                    </Chip>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                {data?.data.status === "Berakhir" ? null : (
                  <Button
                    variant="light"
                    color="secondary"
                    startContent={<PencilLine weight="bold" size={18} />}
                    onClick={() =>
                      router.push(`/tests/edit/${data?.data.test_id}`)
                    }
                    className="px-6 font-bold"
                  >
                    Edit Ujian
                  </Button>
                )}

                <Button
                  variant="solid"
                  color="secondary"
                  startContent={<ClipboardText weight="bold" size={18} />}
                  onClick={() =>
                    router.push(`/tests/grades/${data?.data.test_id}`)
                  }
                  className="px-6 font-bold"
                >
                  Lihat Nilai
                </Button>
              </div>
            </div>

            <div className="grid pt-8">
              <div className="sticky left-0 top-0 z-50 bg-white py-4">
                <h5 className="font-bold text-black">Daftar Soal</h5>
              </div>

              <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
                {data?.data.questions.map((question) => (
                  <div
                    key={question.question_id}
                    className="flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6"
                  >
                    <div className="font-extrabold text-purple">
                      {question.number}.
                    </div>

                    <div className="grid flex-1 gap-4">
                      {question.type == "video" ? (
                        <Suspense fallback={<p>Loading video...</p>}>
                          <VideoComponent url={question.text} />
                        </Suspense>
                      ) : (
                        <p
                          className="preventive-list preventive-table list-outside text-[16px] font-semibold leading-[170%] text-black"
                          dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                      )}

                      <div className="grid gap-1">
                        {question.options.map((option) => (
                          <div
                            key={option.option_id}
                            className="inline-flex items-center gap-2"
                          >
                            {option.is_correct ? (
                              <CheckCircle
                                weight="bold"
                                size={18}
                                className="text-success"
                              />
                            ) : (
                              <XCircle
                                weight="bold"
                                size={18}
                                className="text-danger"
                              />
                            )}
                            <p
                              className={`flex-1 font-semibold ${
                                option.is_correct
                                  ? "text-success"
                                  : "text-gray/80"
                              }`}
                            >
                              {option.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Accordion isCompact variant="bordered">
                        <AccordionItem
                          aria-label="accordion answer"
                          key="answer"
                          title="Penjelasan:"
                          classNames={{
                            title: "font-semibold text-black",
                            content:
                              "font-medium text-[16px] text-gray leading-[170%] pb-4",
                          }}
                        >
                          <div
                            className="preventive-list preventive-table list-outside text-[16px] leading-[170%] text-black"
                            dangerouslySetInnerHTML={{
                              __html: question.explanation,
                            }}
                          ></div>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                ))}
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

function getUrl(query: ParsedUrlQuery, id: string) {
  return `/admin/tests/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
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
