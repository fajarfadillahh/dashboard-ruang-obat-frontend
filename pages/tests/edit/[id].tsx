import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import VideoComponent from "@/components/VideoComponent";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  Button,
  DatePicker,
  Input,
  Pagination,
  Textarea,
} from "@nextui-org/react";
import {
  Calendar,
  CheckCircle,
  ClockCountdown,
  Database,
  Trash,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { CreateQuestion } from "../create";

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

export default function EditTestPage({
  token,
  params,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsTestResponse>
  >({
    url: getUrl(query, params?.id as string),
    method: "GET",
    token,
  });
  const { data: session, status } = useSession();
  const [client, setClient] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isInputReady, setIsInputReady] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    duration: 0,
  });

  useEffect(() => {
    if (data?.data) {
      const { title, description, start, end, duration } = data.data;

      setInput({
        title,
        description,
        start,
        end,
        duration: duration ?? 0,
      });

      setIsInputReady(true);
    }
  }, [data]);

  useEffect(() => {
    const isFormValid =
      input?.title?.trim() !== "" &&
      input?.description?.trim() !== "" &&
      input?.start?.trim() !== "" &&
      input?.end?.trim() !== "" &&
      input?.duration > 0 &&
      (data?.data.questions ?? []).length > 0;

    setIsButtonDisabled(!isFormValid);
  }, [input, data]);

  async function handleAddQuestion(question: CreateQuestion) {
    try {
      await fetcher({
        url: "/admin/tests",
        method: "PATCH",
        token,
        data: {
          test_id: data?.data.test_id,
          update_type: "add_question",
          questions: [{ ...question, type: question.type }],
          by: status == "authenticated" ? session.user.fullname : "",
        },
      });

      mutate();
      toast.success("Soal Berhasil Di Tambahkan");
    } catch (error) {
      console.log(error);
      toast.error("Terjadi Kesalahan Saat Menambahkan soal");
    }
  }

  async function handleDeleteQuestion(test_id: string, question_id: string) {
    try {
      await fetcher({
        url: `/admin/tests/${test_id}/questions/${question_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Soal Berhasil Di Hapus");
    } catch (error) {
      console.log(error);
      toast.error("Terjadi Kesalahan Saat Menghapus Soal");
    }
  }

  async function handleEditQuestion(question: CreateQuestion, index: number) {
    try {
      console.log(question);
      const mappingQuestion = data?.data.questions[index];

      await fetcher({
        url: "/admin/tests",
        method: "PATCH",
        token,
        data: {
          test_id: data?.data.test_id,
          update_type: "update_question",
          questions: [{ ...mappingQuestion, ...question }],
          by: status == "authenticated" ? session.user.fullname : "",
        },
      });

      mutate();
      toast.success("Soal Berhasil Di Ubah");
    } catch (error) {
      console.log(error);
      toast.error("Terjadi Kesalahan Saat Mengubah Soal");
    }
  }

  async function handleEditTestData() {
    setLoading(true);

    try {
      await fetcher({
        url: "/admin/tests",
        method: "PATCH",
        token,
        data: {
          test_id: data?.data.test_id,
          update_type: "update_test",
          ...input,
          by: status == "authenticated" ? session.user.fullname : "",
        },
      });

      mutate();
      toast.success("Data Ujian Berhasil Di Ubah");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Terjadi Kesalahan Saat Mengubah Data Ujian");
    }
  }

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return;
  }

  if (error) {
    return (
      <Layout title="Edit Ujian">
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
    <Layout title="Edit Ujian">
      <Container>
        <section className="grid">
          <ButtonBack />

          {data?.data.status === "Berlangsung" ? (
            <div className="mt-8 grid rounded-xl border-2 border-warning bg-warning/5 p-6">
              <h4 className="mb-2 inline-flex items-center text-[20px] font-bold text-warning">
                <WarningCircle
                  weight="bold"
                  size={20}
                  className="mr-2 inline-flex text-warning"
                />
                Perhatian!
              </h4>
              <p className="ml-8 font-medium leading-[180%] text-warning">
                Ketika ujian sedang <strong>Berlangsung</strong>, anda tidak
                dapat mengubah <strong>Tanggal Mulai</strong> ujian dan{" "}
                <strong>Menambah/Mengedit</strong> soal-soal ujian.
                <br />
                Hal ini bertujuan untuk menjaga <strong>
                  konsistensi
                </strong>{" "}
                soal-soal ujian dan menghindari <strong>berubahnya</strong>{" "}
                soal-soal ketika user sedang mengerjakan ujian.
              </p>
            </div>
          ) : null}

          <div className="divide-y-2 divide-dashed divide-gray/20 py-8">
            <div className="grid gap-1 pb-10">
              <h1 className="text-[22px] font-bold -tracking-wide text-black">
                Edit Ujian ✏️
              </h1>
              <p className="font-medium text-gray">Sesuaikan ujian sekarang.</p>
            </div>

            {isInputReady && (
              <div className="grid gap-4 py-10">
                <h5 className="font-bold text-black">Data Ujian</h5>

                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Judul Ujian"
                  labelPlacement="outside"
                  placeholder="Contoh: Tryout Internal Ruangobat"
                  value={input.title}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      title: e.target.value,
                    });
                  }}
                  classNames={{
                    input:
                      "font-semibold placeholder:font-normal placeholder:text-default-600",
                  }}
                  className="flex-1"
                />

                <Textarea
                  isRequired
                  variant="flat"
                  label="Deskripsi Ujian"
                  labelPlacement="outside"
                  placeholder="Ketikan Deskripsi Ujian..."
                  value={input.description}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      description: e.target.value,
                    });
                  }}
                  classNames={{
                    input:
                      "font-semibold placeholder:font-normal placeholder:text-default-600",
                  }}
                />

                <div className="grid grid-cols-3 gap-4">
                  <DatePicker
                    isRequired
                    isDisabled={
                      data?.data.status === "Berlangsung" ||
                      data?.data.status === "Berakhir"
                        ? true
                        : false
                    }
                    hideTimeZone
                    showMonthAndYearPickers
                    variant="flat"
                    label="Tanggal Mulai"
                    labelPlacement="outside"
                    endContent={<Calendar weight="bold" size={18} />}
                    hourCycle={24}
                    defaultValue={
                      input.start
                        ? parseDate(input.start.substring(0, 10)).add({
                            days: 1,
                          })
                        : undefined
                    }
                    onChange={(e) => {
                      const value = e.toString();
                      const date = new Date(value);
                      date.setHours(0, 0, 0, 0);
                      setInput({
                        ...input,
                        start: date.toISOString(),
                      });
                    }}
                  />

                  <DatePicker
                    isRequired
                    hideTimeZone
                    showMonthAndYearPickers
                    variant="flat"
                    label="Tanggal Selesai"
                    labelPlacement="outside"
                    endContent={<Calendar weight="bold" size={18} />}
                    hourCycle={24}
                    minValue={today(getLocalTimeZone())}
                    defaultValue={
                      input.end
                        ? parseDate(input.end.substring(0, 10))
                        : undefined
                    }
                    onChange={(e) => {
                      const value = e.toString();
                      const date = new Date(value);
                      date.setHours(23, 59, 59, 999);
                      setInput({
                        ...input,
                        end: date.toISOString(),
                      });
                    }}
                  />

                  <Input
                    isRequired
                    type="number"
                    variant="flat"
                    label="Durasi Pengerjaan"
                    labelPlacement="outside"
                    placeholder="Satuan Menit..."
                    value={input.duration.toString()}
                    onChange={(e) => {
                      setInput({
                        ...input,
                        duration: parseInt(e.target.value),
                      });
                    }}
                    endContent={
                      <ClockCountdown
                        weight="bold"
                        size={18}
                        className="text-default-600"
                      />
                    }
                    classNames={{
                      input:
                        "font-semibold placeholder:font-normal placeholder:text-default-600",
                    }}
                  />
                </div>

                <ModalConfirm
                  trigger={
                    <Button
                      isDisabled={isButtonDisabled}
                      variant="solid"
                      color="secondary"
                      startContent={<Database weight="bold" size={18} />}
                      className="w-max justify-self-end font-bold"
                    >
                      Simpan Data Ujian
                    </Button>
                  }
                  header={<h1 className="font-bold text-black">Perhatian!</h1>}
                  body={
                    <p className="leading-[170%] text-gray">
                      Apakah anda ingin menyimpan data ujian ini ke dalam
                      database?
                    </p>
                  }
                  footer={(onClose: any) => (
                    <>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        className="font-bold"
                      >
                        Tutup
                      </Button>

                      <Button
                        isLoading={loading}
                        isDisabled={loading}
                        color="secondary"
                        onClick={() => {
                          handleEditTestData(),
                            setTimeout(() => {
                              onClose();
                              setLoading(false);
                            }, 500);
                        }}
                        className="font-bold"
                      >
                        Ya, Simpan
                      </Button>
                    </>
                  )}
                />
              </div>
            )}

            <div className="grid pt-10">
              <div className="sticky left-0 top-0 z-50 grid gap-4 bg-white pb-4">
                <div className="flex items-end justify-between gap-4">
                  <h5 className="font-bold text-black">Daftar Soal</h5>

                  {data?.data.status === "Berlangsung" ||
                  data?.data.status === "Berakhir" ? null : (
                    <div className="inline-flex gap-2">
                      <ModalInputQuestion
                        {...{ handleAddQuestion, type: "edit", token: token }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 overflow-y-scroll scrollbar-hide">
                {data?.data.questions.map((question, index) => (
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
                              "font-medium text-gray leading-[170%] pb-4",
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

                    {data?.data.status !== "Belum dimulai" ? null : (
                      <div className="flex gap-2">
                        <ModalEditQuestion
                          {...{
                            question,
                            handleEditQuestion,
                            index,
                            type: "edit",
                            token: token,
                            type_question: question?.type,
                          }}
                        />

                        <ModalConfirm
                          trigger={
                            <Button
                              isIconOnly
                              variant="flat"
                              color="danger"
                              size="sm"
                            >
                              <Trash
                                weight="bold"
                                size={18}
                                className="text-danger"
                              />
                            </Button>
                          }
                          header={
                            <h1 className="font-bold text-black">Perhatian!</h1>
                          }
                          body={
                            <p className="leading-[170%] text-gray">
                              Apakah anda ingin menghapus soal ini?
                            </p>
                          }
                          footer={(onClose: any) => (
                            <>
                              <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                                className="font-bold"
                              >
                                Tutup
                              </Button>

                              <Button
                                color="secondary"
                                onClick={() => {
                                  handleDeleteQuestion(
                                    data?.data.test_id,
                                    question.question_id,
                                  ),
                                    onClose();
                                }}
                                className="font-bold"
                              >
                                Ya, Hapus Soal
                              </Button>
                            </>
                          )}
                        />
                      </div>
                    )}
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
                      pathname: `/tests/edit/${id}`,
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
