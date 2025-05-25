import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { CreateQuestion } from "@/types/question.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import { Calendar, Database, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  description: string;
  start: string;
  end: string;
  duration: number;
};

export default function CreateTestPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [input, setInput] = useState<InputType>({
    title: "",
    description: "",
    start: "",
    end: "",
    duration: 0,
  });
  const initialQuestions: CreateQuestion[] = [];
  const [questions, setQuestions] = useState(initialQuestions);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

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
    toast.success("Soal berhasil ditambahkan ke draft");
  }

  function handleEditQuestion(question: CreateQuestion, index: number) {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = question;
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    toast.success("Soal berhasil diedit");
  }

  function handleRemoveQuestion(index: number) {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    toast.success("Soal berhasil dihapus");
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

      toast.success("Ujian berhasil dibuat");
      router.push("/tests");

      localStorage.removeItem("input");
      localStorage.removeItem("questions");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <Layout title="Buat Ujian">
      <Container className="gap-8">
        <ButtonBack />

        <div className="divide-y-2 divide-dashed divide-gray/20">
          <TitleText
            title="Buat Ujian ✏️"
            text="Saatnya buat ujian sekarang"
            className="pb-8"
          />

          <div className="grid gap-6 [padding:2rem_0_3rem]">
            <h5 className="-mb-2 text-xl font-bold text-black">Data Ujian</h5>

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
                endContent={<Calendar weight="duotone" size={20} />}
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
                    duration: Number(e.target.value),
                  });
                }}
                classNames={customStyleInput}
              />
            </div>
          </div>

          <div className="grid pt-12">
            <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white pb-4">
              <h5 className="text-xl font-bold text-black">Daftar Soal</h5>

              <div className="inline-flex gap-4">
                <ModalInputQuestion
                  {...{ handleAddQuestion, page: "create", token: token }}
                />

                <ModalConfirm
                  trigger={
                    <Button
                      isDisabled={isButtonDisabled}
                      color="secondary"
                      startContent={
                        loading ? null : <Database weight="duotone" size={18} />
                      }
                      className="w-max justify-self-end font-semibold"
                    >
                      Simpan Database
                    </Button>
                  }
                  header={<h1 className="font-bold text-black">Perhatian!</h1>}
                  body={
                    <p className="leading-[170%] text-gray">
                      Apakah anda ingin menyimpan ujian ini ke dalam database?
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
                        onClick={handleSaveTest}
                        className="font-semibold"
                      >
                        Ya, Simpan
                      </Button>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
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
                        variant="light"
                        color="danger"
                        size="sm"
                        onClick={() => {
                          handleRemoveQuestion(index);
                          toast.success("Soal berhasil dihapus");
                        }}
                      >
                        <Trash
                          weight="duotone"
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
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
