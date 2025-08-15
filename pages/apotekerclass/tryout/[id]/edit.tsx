import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingData from "@/components/loading/LoadingData";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import TitleText from "@/components/TitleText";
import VideoComponent from "@/components/VideoComponent";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { CreateQuestion } from "@/types/question.type";
import { TryoutDetailResponse } from "@/types/tryout.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Pagination,
  Textarea,
} from "@nextui-org/react";
import { CheckCircle, Database, Trash, XCircle } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  title: string;
  description: string;
};

export default function EditTryoutPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const { data, error, mutate } = useSWR<SuccessResponse<TryoutDetailResponse>>(
    {
      url: getUrl(
        `/universities/tryouts/${encodeURIComponent(params?.id as string)}`,
        { page },
      ),
      method: "GET",
      token,
    },
  );
  const [input, setInput] = useState<InputType>({
    title: data?.data.title as string,
    description: data?.data.description as string,
  });
  const [isInputReady, setIsInputReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data?.data) {
      const { title, description } = data.data;
      setInput({ title, description });
      setIsInputReady(true);
    }
  }, [data]);

  async function handleEditTryoutData() {
    setLoading(true);

    try {
      const payload = {
        ...input,
        ass_id: data?.data.ass_id,
        update_type: "update_tryout",
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/universities/tryouts",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      toast.success("Data tryout universitas berhasil diedit!");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleAddQuestion(question: CreateQuestion) {
    try {
      const payload = {
        ass_id: data?.data.ass_id,
        update_type: "add_question",
        questions: [{ ...question, type: question.type }],
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/universities/tryouts",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      toast.success("Soal berhasil ditambahkan!");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleDeleteQuestion(ass_id: string, assq_id: string) {
    try {
      await fetcher({
        url: `/universities/tryouts/${ass_id}/questions/${assq_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Soal berhasil dihapus!");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleEditQuestion(question: CreateQuestion, index: number) {
    try {
      const mappingQuestion = data?.data.questions[index];
      const payload = {
        ass_id: data?.data.ass_id,
        update_type: "update_question",
        questions: [{ ...mappingQuestion, ...question }],
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/universities/tryouts",
        method: "PATCH",
        token,
        data: payload,
      });

      mutate();
      toast.success("Soal berhasil diedit!");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Edit Tryout">
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
    <Layout title="Edit Tryout" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <div className="divide-y-2 divide-dashed divide-gray/20">
          <TitleText
            title="Edit Tryout ✏️"
            text="Sesuaikan data tryout sekarang"
            className="pb-8"
          />

          {!isInputReady ? (
            <LoadingData />
          ) : (
            <>
              <div className="grid gap-6 [padding:2rem_0_3rem]">
                <h5 className="-mb-2 text-xl font-bold text-black">
                  Data Tryout
                </h5>

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

                <ModalConfirm
                  trigger={
                    <Button
                      color="secondary"
                      startContent={<Database weight="duotone" size={18} />}
                      className="w-max justify-self-end font-semibold"
                    >
                      Simpan Data Tryout
                    </Button>
                  }
                  header={<h1 className="font-bold text-black">Perhatian!</h1>}
                  body={
                    <p className="leading-[170%] text-gray">
                      Apakah anda ingin menyimpan data tryout ini ke dalam
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
                          handleEditTryoutData(),
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
                  {data?.data.questions.length ? (
                    data.data.questions.map((question, index) => (
                      <div
                        key={question.assq_id}
                        className="flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6"
                      >
                        <div className="font-extrabold text-purple">
                          {question.number}.
                        </div>

                        <div className="grid flex-1 gap-4">
                          {question.type == "video" ? (
                            <Suspense fallback={<p>Loading video...</p>}>
                              <VideoComponent url={question.text as string} />
                            </Suspense>
                          ) : (
                            <p
                              className="preventive-list preventive-table list-outside text-[16px] font-semibold leading-[170%] text-black"
                              dangerouslySetInnerHTML={{
                                __html: question.text as string,
                              }}
                            />
                          )}

                          <div className="grid gap-1">
                            {question.options.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className="inline-flex items-center gap-2"
                                >
                                  {item.is_correct ? (
                                    <CheckCircle
                                      weight="duotone"
                                      size={18}
                                      className="text-success"
                                    />
                                  ) : (
                                    <XCircle
                                      weight="duotone"
                                      size={18}
                                      className="text-danger"
                                    />
                                  )}
                                  <p
                                    className={`flex-1 font-semibold ${
                                      item.is_correct
                                        ? "text-success"
                                        : "text-gray/80"
                                    }`}
                                  >
                                    {item.text}
                                  </p>
                                </div>
                              );
                            })}
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
                                  __html: question.explanation as string,
                                }}
                              ></div>
                            </AccordionItem>
                          </Accordion>
                        </div>

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

                          {question.can_delete && (
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
                                        data?.data.ass_id,
                                        question.assq_id,
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
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyData text="Belum ada soal ditryout ini!" />
                  )}
                </div>

                {data?.data.questions.length ? (
                  <Pagination
                    isCompact
                    showControls
                    page={data.data.page as number}
                    total={data.data.total_pages as number}
                    onChange={(e) => {
                      setPage(`${e}`);
                      divRef.current?.scrollIntoView({ behavior: "smooth" });
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

export const getServerSideProps = withToken(async (ctx) => {
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
