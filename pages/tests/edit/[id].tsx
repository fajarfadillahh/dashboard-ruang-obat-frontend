import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingData from "@/components/loading/LoadingData";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { CreateQuestion } from "@/types/question.type";
import { DetailsTestResponse } from "@/types/test.type";
import { fetcher } from "@/utils/fetcher";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Textarea,
} from "@nextui-org/react";
import {
  Calendar,
  ClockCountdown,
  Database,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery, id: string) {
  return `/admin/tests/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
}

export default function EditTestPage({
  token,
  params,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const initialState = {
    title: "",
    description: "",
    start: "",
    end: "",
    duration: 0,
  };

  const [client, setClient] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isInputReady, setIsInputReady] = useState(false);
  const [input, setInput] = useState(initialState);

  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsTestResponse>
  >({
    url: getUrl(query, params?.id as string),
    method: "GET",
    token,
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
      Object.values(input).every((value) => {
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "number") return value > 0;
        return true;
      }) && (data?.data.questions ?? []).length > 0;
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
      toast.error("Terjadi Kesalahan Saat Menambahkan Soal");
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
      toast.success("Soal Berhasil Di Edit");
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
      toast.success("Data Ujian Berhasil Di Edit");
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

          <div className="divide-y-2 divide-dashed divide-gray/20 py-8">
            <TitleText
              title="Edit Ujian ✏️"
              text="Sesuaikan ujian sekarang"
              className="pb-10"
            />

            {!isInputReady ? (
              <LoadingData />
            ) : (
              <>
                <div className="grid gap-4 py-10">
                  {data?.data.status === "Berlangsung" ? (
                    <div className="flex items-start gap-2 rounded-xl bg-warning p-4 text-black">
                      <WarningCircle weight="bold" size={24} />

                      <div className="flex-1">
                        <h4 className="mb-2 text-[18px] font-extrabold">
                          Perhatian!
                        </h4>
                        <p className="font-medium leading-[170%]">
                          Status ujian saat ini sedang{" "}
                          <strong>"Berlangsung"</strong>, pastikan kembali jika
                          anda ingin benar-benar mengubah data ujian ini.
                        </p>
                      </div>
                    </div>
                  ) : null}

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
                      hideTimeZone
                      showMonthAndYearPickers
                      variant="flat"
                      label="Tanggal Mulai"
                      labelPlacement="outside"
                      endContent={<Calendar weight="bold" size={18} />}
                      hourCycle={24}
                      minValue={
                        data?.data.status === "Belum dimulai"
                          ? today(getLocalTimeZone())
                          : undefined
                      }
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
                    header={
                      <h1 className="font-bold text-black">Perhatian!</h1>
                    }
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

                <div className="grid pt-10">
                  <div className="sticky left-0 top-0 z-50 grid gap-4 bg-white pb-4">
                    {data?.data.status === "Berlangsung" ? (
                      <div className="flex items-start gap-2 rounded-xl bg-warning p-4 text-black">
                        <WarningCircle weight="bold" size={24} />

                        <div className="flex-1">
                          <h4 className="mb-2 text-[18px] font-extrabold">
                            Perhatian!
                          </h4>
                          <p className="font-medium leading-[170%]">
                            Untuk menjaga konsistensi soal-soal ujian, kami
                            menyarankan untuk tidak{" "}
                            <strong>Menambah/Menghapus</strong> soal-soal ujian
                            ketika sedang <strong>"Berlangsung"</strong>. Hal
                            ini bertujuan juga untuk menghindari kesalahan dalam
                            proses pengumpulan jawaban peserta.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex items-end justify-between gap-4">
                      <h5 className="font-bold text-black">Daftar Soal</h5>

                      <ModalInputQuestion
                        {...{
                          handleAddQuestion,
                          page: "edit",
                          token: token,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 overflow-y-scroll scrollbar-hide">
                    {data?.data.questions.length === 0 ? (
                      <EmptyData text="Belum Ada Soal Di Ujian Ini" />
                    ) : (
                      data?.data.questions.map((question, index) => (
                        <CardQuestionPreview
                          key={question.question_id}
                          index={index}
                          question={question}
                          type="edit"
                          buttonAction={
                            <div className="flex gap-2">
                              <ModalEditQuestion
                                {...{
                                  question,
                                  handleEditQuestion,
                                  index,
                                  page: "edit",
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
                                  <h1 className="font-bold text-black">
                                    Perhatian!
                                  </h1>
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
                          }
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
              </>
            )}
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
