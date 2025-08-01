import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalGenerateDataFromAi from "@/components/modal/ModalGenerateDataFromAi";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { CreateQuestion } from "@/types/question.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Database, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  description: string;
};

export default function CreateTryoutPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState<InputType>({
    title: "",
    description: "",
  });
  const initialQuestions: CreateQuestion[] = [];
  const [questions, setQuestions] = useState(initialQuestions);
  const [questionsFromAi, setQuestionsFromAi] = useState(initialQuestions);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  function handleAddQuestion(question: CreateQuestion) {
    setQuestions((prev) => [...prev, question]);
    localStorage.setItem(
      "questions_tryout_apotekerclass",
      JSON.stringify([...questions, question]),
    );
    toast.success("Soal berhasil ditambahkan ke draft");
  }

  function handleEditQuestion(question: CreateQuestion, index: number) {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = question;
    setQuestions(updatedQuestions);
    localStorage.setItem(
      "questions_tryout_apotekerclass",
      JSON.stringify(updatedQuestions),
    );
    toast.success("Soal berhasil diedit");
  }

  function handleRemoveQuestion(index: number) {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem(
      "questions_tryout_apotekerclass",
      JSON.stringify(updatedQuestions),
    );
    toast.success("Soal berhasil dihapus");
  }

  async function handleSaveTryout() {
    setLoading(true);

    try {
      const payload = {
        ...input,
        questions: questions.map((question, index) => ({
          ...question,
          number: index + 1,
          type: question.type,
        })),
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/universities/tryouts",
        method: "POST",
        data: payload,
        token,
      });

      router.back();
      toast.success("Tryout berhasil ditambahkan!");

      localStorage.removeItem("input_tryout_apotekerclass");
      localStorage.removeItem("questions_tryout_apotekerclass");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedInput = localStorage.getItem("input_tryout_apotekerclass");
    const storedQuestions = localStorage.getItem(
      "questions_tryout_apotekerclass",
    );

    if (storedInput) setInput(JSON.parse(storedInput));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
  }, []);

  useEffect(() => {
    const isFormValid =
      Object.values(input).every((value) => value !== "") &&
      questions.length > 0;
    setIsButtonDisabled(!isFormValid);
  }, [input, questions]);

  useEffect(() => {
    if (questionsFromAi.length > 0) {
      setQuestions((prev) => [...prev, ...questionsFromAi]);
      localStorage.setItem(
        "questions_tryout_apotekerclass",
        JSON.stringify([...questions, ...questionsFromAi]),
      );
      toast.success("Soal dari AI berhasil ditambahkan ke draft");
      setQuestionsFromAi(initialQuestions);
    }
  }, [questionsFromAi]);

  return (
    <Layout title="Buat Tryout" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <div className="divide-y-2 divide-dashed divide-gray/20">
          <TitleText
            title="Buat Tryout ✏️"
            text="Saatnya buat tryout sekarang"
            className="pb-8"
          />

          <div className="grid gap-6 [padding:2rem_0_3rem]">
            <h5 className="-mb-2 text-xl font-bold text-black">Data Tryout</h5>

            <Input
              isRequired
              type="text"
              variant="flat"
              label="Judul Tryout"
              labelPlacement="outside"
              placeholder="Contoh: Tryout Universitas Pancasila"
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
              label="Deskripsi Tryout"
              labelPlacement="outside"
              placeholder="Contoh: Kerjakan tryout dengan baik dan benar..."
              value={input.description}
              onChange={(e) => {
                setInput({
                  ...input,
                  description: e.target.value,
                });
              }}
              classNames={customStyleInput}
            />
          </div>

          <div className="grid pt-12">
            <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white pb-4">
              <h5 className="text-xl font-bold text-black">Daftar Soal</h5>

              <div className="inline-flex gap-4">
                <ModalInputQuestion
                  {...{ handleAddQuestion, page: "create", token: token }}
                />
                <ModalGenerateDataFromAi setQuestions={setQuestionsFromAi} />

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
                      Apakah anda ingin menyimpan tryout ini ke dalam database?
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
                        onClick={handleSaveTryout}
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
