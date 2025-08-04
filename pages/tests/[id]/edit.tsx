import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { CreateQuestion } from "@/types/question.type";
import { DetailsTestResponse } from "@/types/test.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import {
  Calendar,
  Database,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  title: string;
  description: string;
  start: string;
  end: string;
  duration: number;
};

export default function EditTestPage({
  token,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsTestResponse>
  >({
    url: getUrl(`/admin/tests/${encodeURIComponent(id)}`, query),
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputType>({
    title: "",
    description: "",
    start: "",
    end: "",
    duration: 0,
  });
  const [client, setClient] = useState<boolean>(false);
  const [isInputReady, setIsInputReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

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

  async function handleEditTestData() {
    setLoading(true);

    try {
      const payload = {
        ...input,
        test_id: data?.data.test_id,
        update_type: "update_test",
        by: status == "authenticated" ? session.user.fullname : "",
      };

      await fetcher({
        url: "/admin/tests",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      toast.success("Data ujian berhasil diedit");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleAddQuestion(question: CreateQuestion) {
    try {
      const payload = {
        test_id: data?.data.test_id,
        update_type: "add_question",
        questions: [{ ...question, type: question.type }],
        by: status == "authenticated" ? session.user.fullname : "",
      };

      await fetcher({
        url: "/admin/tests",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      toast.success("Soal berhasil ditambahkan");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
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
      toast.success("Soal berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleEditQuestion(question: CreateQuestion, index: number) {
    try {
      const mappingQuestion = data?.data.questions[index];
      const payload = {
        test_id: data?.data.test_id,
        update_type: "update_question",
        questions: [{ ...mappingQuestion, ...question }],
        by: status == "authenticated" ? session.user.fullname : "",
      };

      await fetcher({
        url: "/admin/tests",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      toast.success("Soal berhasil diedit");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
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

  return (
    <Layout title="Edit Ujian">
      <Container className="gap-8">
        <ButtonBack />

        <div className="divide-y-2 divide-dashed divide-gray/20">
          <TitleText
            title="Edit Ujian ✏️"
            text="Sesuaikan ujian sekarang"
            className="pb-8"
          />

          {!isInputReady ? (
            <div className="mt-8 flex w-full justify-center">
              <Spinner color="secondary" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 [padding:2rem_0_3rem]">
                {data?.data.status === "Berlangsung" ? (
                  <InformationStatusTest />
                ) : null}

                <h5 className="-mb-2 text-xl font-bold text-black">
                  Data Ujian
                </h5>

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
                  classNames={customStyleInput}
                  className="flex-1"
                />

                <Textarea
                  isRequired
                  variant="flat"
                  label="Deskripsi Ujian"
                  labelPlacement="outside"
                  placeholder="Contoh: Kerjakan soal ujian dengan baik dan benar..."
                  value={input.description}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      description: e.target.value,
                    });
                  }}
                  classNames={customStyleInput}
                />

                <div className="grid grid-cols-3 gap-4">
                  <DatePicker
                    isRequired
                    hideTimeZone
                    showMonthAndYearPickers
                    variant="flat"
                    label="Tanggal Mulai"
                    labelPlacement="outside"
                    endContent={<Calendar weight="duotone" size={20} />}
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
                    endContent={<Calendar weight="duotone" size={20} />}
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
                    classNames={customStyleInput}
                  />
                </div>

                <ModalConfirm
                  trigger={
                    <Button
                      isDisabled={isButtonDisabled}
                      color="secondary"
                      startContent={<Database weight="duotone" size={18} />}
                      className="w-max justify-self-end font-semibold"
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
                        className="font-semibold"
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
                        className="font-semibold"
                      >
                        Ya, Simpan
                      </Button>
                    </>
                  )}
                />
              </div>

              <div className="grid pt-12">
                <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white pb-4">
                  <h5 className="text-xl font-bold text-black">Daftar Soal</h5>

                  <ModalInputQuestion
                    {...{
                      handleAddQuestion,
                      page: "edit",
                      token: token,
                    }}
                  />
                </div>

                <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
                  {data?.data.questions.length === 0 ? (
                    <EmptyData text="Belum ada soal diujian ini" />
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
                                  variant="light"
                                  color="danger"
                                  size="sm"
                                >
                                  <Trash
                                    weight="duotone"
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
                                    className="font-semibold"
                                  >
                                    Tutup
                                  </Button>

                                  <Button
                                    color="danger"
                                    onClick={() => {
                                      handleDeleteQuestion(
                                        data?.data.test_id,
                                        question.question_id,
                                      ),
                                        onClose();
                                    }}
                                    className="font-semibold"
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
                        pathname: `/tests/${id}/edit`,
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
      </Container>
    </Layout>
  );
}

function InformationStatusTest() {
  return (
    <div className="flex items-start gap-2 rounded-xl border-2 border-warning bg-warning/50 p-6">
      <WarningCircle weight="duotone" size={28} className="text-black" />

      <div className="grid flex-1 gap-4">
        <h4 className="text-lg font-extrabold text-black">
          Harap Untuk Dibaca!
        </h4>

        <ul className="grid list-outside list-decimal gap-1 pl-4 font-medium leading-[170%] text-black">
          <li>
            Status ujian saat ini sedang{" "}
            <strong className="font-extrabold underline">"Berlangsung"</strong>,
            pastikan kembali jika anda ingin benar-benar mengubah data ujian
            ini.
          </li>
          <li>
            Untuk menjaga konsistensi soal-soal ujian, kami menyarankan untuk
            tidak{" "}
            <strong className="font-extrabold underline">
              "Menambah/Menghapus"
            </strong>{" "}
            soal-soal ujian ketika sedang{" "}
            <strong className="font-extrabold underline">"Berlangsung"</strong>.
            Hal ini bertujuan juga untuk menghindari kesalahan dalam proses
            pengumpulan jawaban peserta.
          </li>
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps = withToken(async (ctx, token) => {
  const id = ctx.params?.id as string;
  const query = ctx.query;

  return {
    props: {
      query,
      id,
    },
  };
});
