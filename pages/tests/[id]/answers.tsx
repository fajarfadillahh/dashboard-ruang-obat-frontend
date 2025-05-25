import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import VideoComponent from "@/components/VideoComponent";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { TestAnswerResponse } from "@/types/test.type";
import { Accordion, AccordionItem, Radio, RadioGroup } from "@nextui-org/react";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Suspense, useState } from "react";
import useSWR from "swr";

export default function AnswersPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<
    SuccessResponse<TestAnswerResponse>
  >({
    url: `/admin/results/${id}`,
    method: "GET",
    token,
  });
  const [number, setNumber] = useState(1);

  const question = data?.data.questions.find(
    (question) => question.number == number,
  );

  if (error) {
    return (
      <Layout title="Daftar Semua Jawaban">
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
    <Layout title="Daftar Semua Jawaban" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <div className="grid gap-4">
          <div className="flex items-end justify-between gap-8">
            <TitleText
              title={data?.data.fullname as string}
              text={data?.data.university as string}
            />

            <div className="inline-flex items-center gap-12">
              {[
                ["nilai pengguna", `🏆 ${data?.data.score}`],
                ["jawaban benar", `✅ ${data?.data.total_correct}`],
                ["jawaban salah", `❌ ${data?.data.total_incorrect}`],
              ].map(([label, value], index) => (
                <div key={index} className="grid gap-1">
                  <span className="text-sm font-medium capitalize text-gray">
                    {label}:
                  </span>

                  <h4 className="text-2xl font-extrabold text-black">
                    {value}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_260px] gap-4">
            <div className="flex h-auto items-start gap-6 rounded-xl border-2 border-gray/20 p-6">
              <div className="font-extrabold text-purple">
                {question?.number}.
              </div>

              <div className="grid flex-1 gap-4">
                {question?.type == "video" ? (
                  <Suspense fallback={<p>Loading video...</p>}>
                    <VideoComponent url={question?.text as string} />
                  </Suspense>
                ) : (
                  <p
                    className="preventive-list preventive-table list-outside text-[16px] font-semibold leading-[170%] text-black"
                    dangerouslySetInnerHTML={{
                      __html: question?.text as string,
                    }}
                  />
                )}

                <RadioGroup
                  aria-label="select the answer"
                  defaultValue="fase-s"
                  classNames={{
                    base: "font-semibold text-black",
                  }}
                  value={question?.user_answer}
                >
                  {question?.options.map((option) => {
                    const { is_correct, user_answer, correct_option } =
                      question;

                    const isCorrectAnswer =
                      is_correct && user_answer === option.option_id;
                    const isCorrectOption = correct_option === option.option_id;
                    const isWrongAnswer = user_answer === option.option_id;

                    const color =
                      isCorrectAnswer || isCorrectOption ? "success" : "danger";
                    const labelClass =
                      isCorrectAnswer || isCorrectOption
                        ? "text-success"
                        : isWrongAnswer
                          ? "text-danger"
                          : "text-gray/80";

                    return (
                      <Radio
                        key={option.option_id}
                        isDisabled={false}
                        value={option.option_id}
                        color={color}
                        classNames={{
                          label: `${labelClass} font-semibold`,
                        }}
                      >
                        {option.text}
                      </Radio>
                    );
                  })}
                </RadioGroup>

                <Accordion variant="bordered">
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
                      className="preventive-list preventive-table list-outside text-[16px] leading-[170%] text-black"
                      dangerouslySetInnerHTML={{
                        __html: question?.explanation as string,
                      }}
                    />
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="sticky right-0 top-0 h-max rounded-xl border-2 border-gray/20 p-6">
              <div className="grid gap-4 overflow-hidden">
                <h4 className="text-sm font-semibold text-black">
                  Daftar Pertanyaan:
                </h4>

                <div className="grid h-full max-h-[400px] grid-cols-5 justify-items-center gap-2 overflow-y-scroll scrollbar-hide">
                  {data?.data.questions.map((question) => {
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
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      id,
    },
  };
});
