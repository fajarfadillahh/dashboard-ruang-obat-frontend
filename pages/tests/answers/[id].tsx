import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { CreateQuestion } from "@/pages/tests/create";
import { SuccessResponse } from "@/types/global.type";
import { Question } from "@/types/question.type";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import useSWR from "swr";

type AnswersResponse = {
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
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<AnswersResponse>>({
    url: `/admin/results/${params?.id as string}`,
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
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-4">
            <div className="flex items-end justify-between gap-8">
              <TitleText
                title={data?.data.fullname as string}
                text={data?.data.university as string}
              />

              <div className="inline-flex items-center gap-12">
                <div className="grid gap-1 text-center">
                  <p className="text-[14px] font-medium text-gray">
                    Nilai Pengguna
                  </p>
                  <h4 className="text-[24px] font-extrabold text-black">
                    🏆 {data?.data.score}
                  </h4>
                </div>

                <div className="grid gap-1 text-center">
                  <p className="text-[14px] font-medium text-gray">
                    Jawaban Benar
                  </p>
                  <h4 className="text-[24px] font-extrabold text-black">
                    ✅ {data?.data.total_correct}
                  </h4>
                </div>

                <div className="grid gap-1 text-center">
                  <p className="text-[14px] font-medium text-gray">
                    Jawaban Salah
                  </p>
                  <h4 className="text-[24px] font-extrabold text-black">
                    ❌ {data?.data.total_incorrect}
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_260px] gap-4">
              <CardQuestionPreview
                index={question?.number as number}
                question={question as CreateQuestion}
                className="h-auto"
              />

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
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  params: ParsedUrlQuery;
}> = async ({ req, params }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
    },
  };
};
