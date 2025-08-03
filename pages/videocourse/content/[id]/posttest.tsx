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
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import {
  CheckCircle,
  Circle,
  Database,
  DotsThreeOutlineVertical,
  FilmSlate,
  PlayCircle,
  Trash,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CreatePostTestCoursePage({
  token,
  params,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();

  const initialQuestions: CreateQuestion[] = [];
  const [questions, setQuestions] = useState(initialQuestions);
  const [titlePostTest, setTitlePostTest] = useState<string>("");

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  function handleAddQuestion(question: CreateQuestion) {
    setQuestions((prev) => [...prev, question]);
    localStorage.setItem(
      "questions_posttest_videocourse",
      JSON.stringify([...questions, question]),
    );
    toast.success("Soal berhasil ditambahkan ke draft");
  }

  function handleEditQuestion(question: CreateQuestion, index: number) {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = question;
    setQuestions(updatedQuestions);
    localStorage.setItem(
      "questions_posttest_videocourse",
      JSON.stringify(updatedQuestions),
    );
    toast.success("Soal berhasil diedit");
  }

  function handleRemoveQuestion(index: number) {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem(
      "questions_posttest_videocourse",
      JSON.stringify(updatedQuestions),
    );
    toast.success("Soal berhasil dihapus");
  }

  async function handleSavePostTestCourse() {
    setLoading(true);

    try {
      const payload = {
        segment_id: query.segment_id,
        title: titlePostTest,
        test_type: "post",
        by: session.data?.user.fullname,
        questions: questions.map((question, index) => ({
          ...question,
          number: index + 1,
          type: question.type,
        })),
      };

      await fetcher({
        url: "/courses/tests",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Post-Test berhasil ditambahkan!");

      localStorage.removeItem("input_posttest_videocourse");
      localStorage.removeItem("questions_posttest_videocourse");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedInput = localStorage.getItem("input_posttest_videocourse");
    const storedQuestions = localStorage.getItem(
      "questions_posttest_videocourse",
    );

    if (storedInput) setTitlePostTest(JSON.parse(storedInput));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
  }, []);

  useEffect(() => {
    const isFormValid =
      Object.values(titlePostTest).every((value) => value !== "") &&
      questions.length > 0;
    setIsButtonDisabled(!isFormValid);
  }, [titlePostTest, questions]);

  return (
    <Layout title="Buat Post-Test" className="scrollbar-hide">
      <Container className="divide-y-2 divide-dashed divide-gray/10">
        <div className="flex items-end justify-between gap-4 pb-8">
          <div className="grid gap-4">
            <Chip
              variant="flat"
              color="warning"
              startContent={
                <Circle weight="fill" size={12} className="text-warning" />
              }
              classNames={{
                base: "px-3",
                content: "font-bold text-warning",
              }}
            >
              Post-Test Opsional
            </Chip>

            <TitleText
              title={`Buat Post-Test ${query.segment_title} ✏️`}
              text={`Saatnya buat post-test ${query.segment_title} sekarang`}
            />
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                color="secondary"
                endContent={
                  <DotsThreeOutlineVertical weight="fill" size={18} />
                }
                className="font-semibold"
              >
                Menu Lainnya
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Static Actions"
              itemClasses={{
                title: "font-semibold",
              }}
            >
              <DropdownItem
                key="create_new_video"
                startContent={<PlayCircle weight="duotone" size={18} />}
                onClick={() => {
                  router.push({
                    pathname: `/videocourse/content/${params.id}/video`,
                    query: { ...query },
                  });
                }}
              >
                Buat Video untuk{" "}
                <strong>&quot;{query.segment_title}&quot;</strong> Lagi
              </DropdownItem>

              <DropdownItem
                key="create_new_segment"
                startContent={<FilmSlate weight="duotone" size={18} />}
                onClick={() => {
                  router.push({
                    pathname: `/videocourse/content/${params.id}/segment`,
                    query: {
                      sub_category_id: router.query.sub_category_id,
                      course_id: query.course_id,
                      course_title: query.course_title,
                    },
                  });
                }}
              >
                Buat Segment untuk{" "}
                <strong>&quot;{query.course_title}&quot;</strong> Lagi
              </DropdownItem>

              <DropdownItem
                key="finish"
                color="secondary"
                startContent={<CheckCircle weight="duotone" size={18} />}
                onClick={() => {
                  router.push({
                    pathname: `/videocourse/content/${query.course_id}/detail`,
                    query: {
                      sub_category_id: router.query.sub_category_id,
                    },
                  });
                }}
                className="bg-purple/10 text-purple"
              >
                Lewati Post-Test dan Selesaikan
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="grid gap-8 pt-8">
          <Input
            isRequired
            type="text"
            variant="flat"
            label="Judul Post-Test"
            labelPlacement="outside"
            placeholder="Contoh: Post-Test Pendahuluan"
            value={titlePostTest}
            onChange={(e) => setTitlePostTest(e.target.value)}
            classNames={customStyleInput}
          />

          <div className="grid">
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
                      Apakah anda ingin menyimpan post-test ini ke dalam
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
                        onClick={handleSavePostTestCourse}
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

export const getServerSideProps = withToken(async (ctx) => {
  const { query, params } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
      params: params as ParsedUrlQuery,
    },
  };
});
