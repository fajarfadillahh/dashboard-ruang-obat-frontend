import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import VideoComponent from "@/components/VideoComponent";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { TryoutDetailResponse } from "@/types/tryout.type";
import {
  Accordion,
  AccordionItem,
  Button,
  Pagination,
} from "@nextui-org/react";
import {
  CheckCircle,
  ClipboardText,
  PencilLine,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { Suspense, useRef } from "react";
import useSWR from "swr";

export default function DetailsTryoutPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR<
    SuccessResponse<TryoutDetailResponse>
  >({
    url: getUrl(
      `/universities/tryouts/${encodeURIComponent(params?.id as string)}`,
      { page },
    ),
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title={`${data?.data.title}`}>
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
    <Layout title={`${data?.data.title}`}>
      <Container className="gap-8">
        <ButtonBack />

        <div className="grid grid-cols-[max-content_1fr_max-content] items-end gap-4">
          <ClipboardText
            weight="duotone"
            size={18}
            className="size-full text-purple"
          />

          <div className="grid gap-1">
            <h4 className="text-2xl font-bold capitalize -tracking-wide text-black">
              {data?.data.title}
            </h4>

            <p className="max-w-[800px] font-medium leading-[170%] text-gray">
              {data?.data.description}
            </p>
          </div>

          <Button
            variant="light"
            color="secondary"
            startContent={<PencilLine weight="duotone" size={18} />}
            onClick={() =>
              router.push(`/apotekerclass/tryout/${data?.data.ass_id}/edit`)
            }
            className="font-semibold"
          >
            Edit Tryout
          </Button>
        </div>

        <div className="grid">
          <h5 className="sticky left-0 top-0 z-50 bg-white pb-4 text-xl font-bold text-black">
            Daftar Soal
          </h5>

          <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
            {data?.data.questions.map((question, index) => (
              <div
                key={question.assq_id}
                className="flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6"
              >
                <div className="font-extrabold text-purple">{index + 1}.</div>

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
                              item.is_correct ? "text-success" : "text-gray/80"
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
                        content: "font-medium text-gray leading-[170%] pb-4",
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
              </div>
            ))}
          </div>
        </div>

        {!isLoading && data?.data.questions.length ? (
          <Pagination
            isCompact
            showControls
            page={data.data.page as number}
            total={data.data.total_pages as number}
            onChange={(e) => {
              setPage(`${e}`);
              divRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="justify-self-center"
            classNames={{
              cursor: "bg-purple text-white",
            }}
          />
        ) : null}
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
