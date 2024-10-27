import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { Question } from "@/types/question.type";
import { fetcher } from "@/utils/fetcher";
import { Accordion, AccordionItem, Radio, RadioGroup } from "@nextui-org/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";

type AnswersType = {
  result_id: string;
  score: number;
  user_id: string;
  fullname: string;
  university: string;
  total_correct: number;
  total_incorrect: number;
  questions: Question[];
};

export default function AnswersPage({
  answer,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [number, setNumber] = useState(1);

  const question = answer?.questions.find(
    (question) => question.number == number,
  );

  return (
    <Layout title="Daftar Semua Jawaban" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-4">
            <div className="flex items-end justify-between gap-8">
              <div className="grid gap-1">
                <h1 className="max-w-[550px] text-[24px] font-bold leading-[120%] -tracking-wide text-black">
                  {answer?.fullname}
                </h1>
                <p className="font-medium text-gray">{answer?.university}</p>
              </div>

              <div className="inline-flex items-center gap-12">
                <div className="grid gap-1 text-center">
                  <p className="text-[14px] font-medium text-gray">
                    Nilai Pengguna
                  </p>
                  <h4 className="text-[24px] font-extrabold text-black">
                    🏆 {answer?.score}
                  </h4>
                </div>

                <div className="grid gap-1 text-center">
                  <p className="text-[14px] font-medium text-gray">
                    Jawaban Benar
                  </p>
                  <h4 className="text-[24px] font-extrabold text-black">
                    ✅ {answer?.total_correct}
                  </h4>
                </div>

                <div className="grid gap-1 text-center">
                  <p className="text-[14px] font-medium text-gray">
                    Jawaban Salah
                  </p>
                  <h4 className="text-[24px] font-extrabold text-black">
                    ❌ {answer?.total_incorrect}
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_260px] items-start gap-4">
              <div className="h-[500px] overflow-y-scroll rounded-xl border-2 border-gray/20 scrollbar-hide">
                <div className="sticky left-0 top-0 z-40 bg-white p-6 text-[18px] font-extrabold text-purple">
                  No. {question?.number}
                </div>

                <div className="grid gap-6 overflow-hidden p-[0_1.5rem_1.5rem]">
                  <p
                    className="preventive-list list-outside text-[16px] font-semibold leading-[170%] text-black"
                    dangerouslySetInnerHTML={{
                      __html: question?.text as string,
                    }}
                  />

                  <RadioGroup
                    aria-label="select the answer"
                    defaultValue="fase-s"
                    classNames={{
                      base: "font-semibold text-black",
                    }}
                    value={question?.user_answer}
                  >
                    {question?.options.map((option) => {
                      return (
                        <Radio
                          key={option.option_id}
                          isDisabled={false}
                          value={option.option_id}
                          color={
                            question.is_correct &&
                            question.user_answer == option.option_id
                              ? "success"
                              : question.correct_option == option.option_id
                                ? "success"
                                : "danger"
                          }
                          classNames={{
                            label: `${
                              question.is_correct &&
                              question.user_answer == option.option_id
                                ? "text-success"
                                : question.correct_option == option.option_id
                                  ? "text-success"
                                  : question.user_answer == option.option_id
                                    ? "text-danger"
                                    : "text-default"
                            } font-extrabold`,
                          }}
                        >
                          {option.text}
                        </Radio>
                      );
                    })}
                  </RadioGroup>

                  <Accordion isCompact variant="bordered">
                    <AccordionItem
                      aria-label="accordion answer"
                      key="answer"
                      title="Penjelasan:"
                      classNames={{
                        title: "font-semibold text-black",
                        content: "font-medium text-black leading-[170%] pb-4",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: question?.explanation as string,
                        }}
                      />
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="h-[500px] rounded-xl border-2 border-gray/20 p-6">
                <div className="grid gap-4 overflow-hidden">
                  <h4 className="text-sm font-semibold text-black">
                    Daftar Pertanyaan:
                  </h4>

                  <div className="grid h-full max-h-[400px] grid-cols-5 justify-items-center gap-2 overflow-y-scroll scrollbar-hide">
                    {answer?.questions.map((question) => {
                      let answerClass = "";

                      if (question.is_correct) {
                        if (question.number == number) {
                          answerClass = "bg-green-700 text-white";
                        } else {
                          answerClass = "bg-success text-white";
                        }
                      } else {
                        if (question.number == number) {
                          answerClass = "bg-red-700 text-white";
                        } else {
                          answerClass = "bg-danger text-white";
                        }
                      }

                      return (
                        <Link
                          key={question.question_id}
                          href={"#"}
                          className={`inline-flex size-[34px] items-center justify-center rounded-lg text-[12px] font-bold ${answerClass}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setNumber(question.number);
                          }}
                        >
                          {question.number}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  answer?: AnswersType;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: `/admin/results/${params?.id as string}`,
      method: "GET",
      token,
    })) as SuccessResponse<AnswersType>;

    return {
      props: {
        answer: response.data,
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
