import ButtonBack from "@/components/button/ButtonBack";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { fetcher } from "@/utils/fetcher";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  Button,
  DatePicker,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  Calendar,
  CheckCircle,
  ClockCountdown,
  Database,
  Trash,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type CreateQuestion = {
  text: string;
  options: {
    text: string;
    is_correct: boolean;
  }[];
  explanation: string;
};

export default function CreateTestPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [input, setInput] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    duration: 0,
  });
  const [questions, setQuestions] = useState<CreateQuestion[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const input = localStorage.getItem("input");
    const questions = localStorage.getItem("questions");

    if (questions && input) {
      setQuestions(JSON.parse(questions) as CreateQuestion[]);
      setInput(
        JSON.parse(input) as {
          title: string;
          description: string;
          start: string;
          end: string;
          duration: number;
        },
      );
    }
  }, []);

  function handleAddQuestion() {
    const question = {
      text: "",
      options: Array.from({ length: 5 }).map(() => {
        return {
          text: "",
          is_correct: false,
        };
      }),
      explanation: "",
    };

    setQuestions((prev) => prev.concat(question));
  }

  const handleRemoveQuestion = useCallback(
    (index: number) => {
      const filters = questions.filter((_, findex) => findex != index);

      setQuestions(filters);
      localStorage.setItem("questions", JSON.stringify(filters));
    },
    [questions],
  );

  function handleEditorChange({
    index,
    text,
    field,
  }: {
    index: number;
    text: string;
    field: "explanation" | "text";
  }) {
    if (field == "text") {
      const mapping = [...questions];
      mapping[index] = {
        ...mapping[index],
        text,
      };

      setQuestions(mapping);
    }

    if (field == "explanation") {
      const mapping = [...questions];
      mapping[index] = {
        ...mapping[index],
        explanation: text,
      };

      setQuestions(mapping);
    }
  }

  const handleOptionChange = useCallback(
    (
      qIndex: number,
      oIndex: number,
      option: {
        text: string;
        is_correct: boolean;
      },
    ) => {
      const mapping = [...questions];
      mapping[qIndex].options[oIndex] = option;

      mapping[qIndex] = {
        ...mapping[qIndex],
      };

      setQuestions(mapping);
    },
    [questions],
  );

  const handleCheckboxChange = useCallback(
    (
      qIndex: number,
      oIndex: number,
      option: {
        text: string;
        is_correct: boolean;
      },
    ) => {
      const mapping = [...questions];
      mapping[qIndex].options[oIndex] = option;

      mapping[qIndex] = {
        ...mapping[qIndex],
      };

      setQuestions(mapping);
    },
    [questions],
  );

  async function handleSaveTest() {
    try {
      await fetcher({
        url: "/admin/tests",
        method: "POST",
        data: {
          ...input,
          questions: questions.map((question, index) => {
            return {
              ...question,
              number: index + 1,
              type: "text",
            };
          }),
          by: status == "authenticated" ? session.user.fullname : "",
        },
        token,
      });

      toast.success("Berhasil membuat test");

      localStorage.removeItem("input");
      localStorage.removeItem("questions");
      router.back();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title="Buat Ujian">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="divide-y-2 divide-dashed divide-gray/20 py-8">
            <div className="grid gap-1 pb-10">
              <h1 className="text-[22px] font-bold -tracking-wide text-black">
                Buat Ujian ✏️
              </h1>
              <p className="font-medium text-gray">
                Saatnya buat ujian sekarang.
              </p>
            </div>

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
                  defaultValue={today(getLocalTimeZone())}
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
                  defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
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
                    {/* <Button
                      variant="bordered"
                      color="secondary"
                      startContent={<FloppyDisk weight="bold" size={18} />}
                      className="w-max justify-self-end font-bold"
                      onClick={() => {
                        localStorage.setItem(
                          "questions",
                          JSON.stringify(questions),
                        );
                        localStorage.setItem("input", JSON.stringify(input));
                        toast.success("Berhasil simpan ke dalam draft");
                      }}
                      size="md"
                    >
                      Simpan Draft
                    </Button> */}

                    <Button
                      variant="solid"
                      color="secondary"
                      startContent={<Database weight="bold" size={18} />}
                      className="w-max justify-self-end font-bold"
                    >
                      Simpan Database
                    </Button>
                  </div>
                </div>

                <ModalInputQuestion />
              </div>

              <div className="grid gap-4 overflow-y-scroll scrollbar-hide">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6"
                  >
                    <div className="font-extrabold text-purple">
                      {index + 1}.
                    </div>

                    <div className="grid flex-1 gap-4">
                      <p className="font-semibold leading-[170%] text-black">
                        Apa ibukota Indonesia?
                      </p>

                      <div className="grid gap-1">
                        <div className="inline-flex items-center gap-2">
                          <CheckCircle
                            weight="bold"
                            size={18}
                            className="text-success"
                          />
                          <p className={`font-semibold text-success`}>
                            Jakarta
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2">
                          <CheckCircle
                            weight="bold"
                            size={18}
                            className="text-danger"
                          />
                          <p className={`font-semibold text-gray/80`}>
                            Palembang
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2">
                          <CheckCircle
                            weight="bold"
                            size={18}
                            className="text-danger"
                          />
                          <p className={`font-semibold text-gray/80`}>Bali</p>
                        </div>

                        <div className="inline-flex items-center gap-2">
                          <CheckCircle
                            weight="bold"
                            size={18}
                            className="text-danger"
                          />
                          <p className={`font-semibold text-gray/80`}>
                            Surabaya
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2">
                          <CheckCircle
                            weight="bold"
                            size={18}
                            className="text-danger"
                          />
                          <p className={`font-semibold text-gray/80`}>Depok</p>
                        </div>
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
                          Jakarta adalah ibukota dari Indonesia
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <Button
                      isIconOnly
                      variant="flat"
                      color="danger"
                      size="sm"
                      onClick={() => toast.success("Berhasil Menghapus Soal")}
                    >
                      <Trash weight="bold" size={18} className="text-danger" />
                    </Button>
                  </div>
                ))}

                {/* <div className="grid gap-2">
                  {questions.map((question, index) => {
                    return (
                      <CardInputTest
                        key={index}
                        {...{
                          question,
                          index,
                          handleRemoveQuestion,
                          handleEditorChange,
                          handleOptionChange,
                          handleCheckboxChange,
                        }}
                      />
                    );
                  })}
                </div> */}

                {/* <Button
                  variant="bordered"
                  color="default"
                  startContent={<Plus weight="bold" size={18} />}
                  className="font-bold"
                  onClick={handleAddQuestion}
                >
                  Tambah Soal
                </Button> */}
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
  const token = req.headers["access_token"] as string;

  return {
    props: {
      token,
    },
  };
};
