import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
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
import { useEffect, useState } from "react";

type DetailsTestType = {
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
  test,
  error,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [client, setClient] = useState<boolean>(false);

  if (error) {
    return (
      <Layout title={`${test?.title}`}>
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

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return;
  }

  return (
    <Layout title={`${test?.title}`}>
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="grid grid-cols-[1fr_max-content] items-start gap-16">
              <div className="grid gap-6 pb-8">
                <div>
                  <h4 className="mb-2 text-[28px] font-bold capitalize leading-[120%] -tracking-wide text-black">
                    {test?.title}
                  </h4>
                  <p className="max-w-[700px] font-medium leading-[170%] text-gray">
                    {test?.description}
                  </p>
                </div>

                <div className="flex items-start gap-8">
                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Tanggal Mulai:
                    </span>
                    <h1 className="font-semibold text-black">
                      {formatDateWithoutTime(`${test?.start}`)}
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Tanggal Selesai:
                    </span>
                    <h1 className="font-semibold text-black">
                      {formatDateWithoutTime(`${test?.end}`)}
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Durasi Pengerjaan:
                    </span>
                    <h1 className="font-semibold text-black">
                      {test?.duration} Menit
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Jumlah Soal:
                    </span>
                    <h1 className="font-semibold text-black">
                      {test?.total_questions} Butir
                    </h1>
                  </div>

                  <div className="grid gap-1">
                    <span className="text-sm font-medium text-gray">
                      Status Ujian:
                    </span>

                    <Chip
                      variant="flat"
                      color={
                        test?.status === "Belum dimulai"
                          ? "danger"
                          : test?.status === "Berlangsung"
                            ? "warning"
                            : "success"
                      }
                      size="sm"
                      startContent={
                        test?.status === "Belum dimulai" ? (
                          <ClockCountdown weight="bold" size={16} />
                        ) : test?.status === "Berlangsung" ? (
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
                      {test?.status}
                    </Chip>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                {test?.status === "Berakhir" ? null : (
                  <Button
                    variant="light"
                    color="secondary"
                    startContent={<PencilLine weight="bold" size={18} />}
                    onClick={() => router.push(`/tests/edit/${test?.test_id}`)}
                    className="px-6 font-bold"
                  >
                    Edit Ujian
                  </Button>
                )}

                <Button
                  variant="solid"
                  color="secondary"
                  startContent={<ClipboardText weight="bold" size={18} />}
                  onClick={() => router.push(`/tests/grades/${test?.test_id}`)}
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
                {test?.questions.map((question) => (
                  <div
                    key={question.question_id}
                    className="flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6"
                  >
                    <div className="font-extrabold text-purple">
                      {question.number}.
                    </div>

                    <div className="grid flex-1 gap-4">
                      <p
                        className="preventive-list preventive-table list-outside text-[16px] font-semibold leading-[170%] text-black"
                        dangerouslySetInnerHTML={{ __html: question.text }}
                      />

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

              {test?.questions.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={test?.page}
                  total={test?.total_pages}
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

type DataProps = {
  test?: DetailsTestType;
  id?: string;
  error?: ErrorDataType;
};

function getUrl(query: ParsedUrlQuery, id: string) {
  return `/admin/tests/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
}

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
  query,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: getUrl(query, params?.id as string),
      method: "GET",
      token,
    })) as SuccessResponse<DetailsTestType>;

    return {
      props: {
        test: response.data,
        id: params?.id as string,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
