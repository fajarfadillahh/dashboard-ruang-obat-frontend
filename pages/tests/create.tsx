import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { CreateQuestion } from "@/types/question.type";
import { fetcher } from "@/utils/fetcher";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import {
  Calendar,
  ClockCountdown,
  Database,
  Trash,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CreateTestPage({
  token,
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

  const initialQuestions: CreateQuestion[] = [];

  const [input, setInput] = useState(initialState);
  const [questions, setQuestions] = useState(initialQuestions);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedInput = localStorage.getItem("input");
    const storedQuestions = localStorage.getItem("questions");

    if (storedInput) setInput(JSON.parse(storedInput));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
  }, []);

  useEffect(() => {
    const isFormValid =
      Object.values(input).every((value) => value !== "") &&
      questions.length > 0 &&
      input.duration > 0;
    setIsButtonDisabled(!isFormValid);
  }, [input, questions]);

  function handleAddQuestion(question: CreateQuestion) {
    setQuestions((prev) => [...prev, question]);
    localStorage.setItem("questions", JSON.stringify([...questions, question]));
    toast.success("Berhasil Menambahkan Ke Draft");
  }

  function handleEditQuestion(question: CreateQuestion, index: number) {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = question;
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    toast.success("Soal Berhasil Di Edit");
  }

  function handleRemoveQuestion(index: number) {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    toast.success("Soal Berhasil Di Hapus");
  }

  async function handleSaveTest() {
    setLoading(true);

    try {
      const payload = {
        ...input,
        questions: questions.map((question, index) => ({
          ...question,
          number: index + 1,
          type: question.type,
        })),
        by: status === "authenticated" ? session.user.fullname : "",
      };

      await fetcher({
        url: "/admin/tests",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Ujian Berhasil Di Buat");
      localStorage.removeItem("input");
      localStorage.removeItem("questions");
      router.push("/tests");
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.log(error);
    }
  }

  return (
    <Layout title="Buat Ujian">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="divide-y-2 divide-dashed divide-gray/20 py-8">
            <TitleText
              title="Buat Ujian ✏️"
              text="Saatnya buat ujian sekarang"
              className="pb-10"
            />

            <div className="grid gap-4 py-10">
              <h5 className="font-bold text-black">Data Ujian</h5>

              <Input
                value={input.title}
                isRequired
                type="text"
                variant="flat"
                label="Judul Ujian"
                labelPlacement="outside"
                placeholder="Contoh: Tryout Internal Ruangobat"
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
                className="flex-1"
                onChange={(e) => {
                  setInput({
                    ...input,
                    title: e.target.value,
                  });
                }}
              />

              <Textarea
                value={input.description}
                isRequired
                variant="flat"
                label="Deskripsi Ujian"
                labelPlacement="outside"
                placeholder="Ketikan Deskripsi Ujian..."
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
                onChange={(e) => {
                  setInput({
                    ...input,
                    description: e.target.value,
                  });
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
                  minValue={today(getLocalTimeZone())}
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
                  minValue={today(getLocalTimeZone()).add({ days: 1 })}
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
                  value={`${input.duration}`}
                  isRequired
                  type="number"
                  variant="flat"
                  label="Durasi Pengerjaan"
                  labelPlacement="outside"
                  placeholder="Satuan Menit..."
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
                  onChange={(e) => {
                    setInput({
                      ...input,
                      duration: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            <div className="grid pt-10">
              <div className="sticky left-0 top-0 z-50 grid gap-4 bg-white pb-4">
                <div className="flex items-end justify-between gap-4">
                  <h5 className="font-bold text-black">Daftar Soal</h5>

                  <div className="inline-flex gap-2">
                    <ModalInputQuestion
                      {...{ handleAddQuestion, page: "create", token: token }}
                    />

                    <ModalConfirm
                      trigger={
                        <Button
                          isDisabled={isButtonDisabled}
                          variant="solid"
                          color="secondary"
                          startContent={
                            loading ? null : (
                              <Database weight="bold" size={18} />
                            )
                          }
                          className="w-max justify-self-end font-bold"
                        >
                          Simpan Database
                        </Button>
                      }
                      header={
                        <h1 className="font-bold text-black">Perhatian!</h1>
                      }
                      body={
                        <p className="leading-[170%] text-gray">
                          Apakah anda ingin menyimpan ujian ini ke dalam
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
                            onClick={handleSaveTest}
                            className="font-bold"
                          >
                            Ya, Simpan
                          </Button>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 overflow-y-scroll scrollbar-hide">
                {questions.map((question, index) => (
                  <CardQuestionPreview
                    key={index}
                    index={index}
                    question={question}
                    type="create"
                    buttonAction={
                      <div className="flex gap-2">
                        <ModalEditQuestion
                          {...{
                            question,
                            handleEditQuestion,
                            index,
                            page: "create",
                            token: token,
                          }}
                        />

                        <Button
                          isIconOnly
                          variant="flat"
                          color="danger"
                          size="sm"
                          onClick={() => {
                            handleRemoveQuestion(index);
                            toast.success("Soal Berhasil Di Hapus");
                          }}
                        >
                          <Trash
                            weight="bold"
                            size={18}
                            className="text-danger"
                          />
                        </Button>
                      </div>
                    }
                  />
                ))}
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
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
