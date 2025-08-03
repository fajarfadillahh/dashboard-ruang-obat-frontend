import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { DetailsTestResponse } from "@/types/test.type";
import { formatDateWithoutTime } from "@/utils/formatDate";
import { getStatusColor, getStatusIcon } from "@/utils/getStatus";
import { Button, Chip, Pagination, Skeleton } from "@nextui-org/react";
import { Eye, PencilLine } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export default function DetailsTestPage({
  token,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading } = useSWR<
    SuccessResponse<DetailsTestResponse>
  >({
    url: getUrl(`/admin/tests/${encodeURIComponent(id)}`, { page }),
    method: "GET",
    token,
  });
  const [client, setClient] = useState<boolean>(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return;
  }

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
      <Container>
        <ButtonBack />

        <div className="mt-8 grid gap-16">
          {isLoading ? (
            <LoadingTitleImage />
          ) : (
            <div className="flex items-end gap-8">
              <div className="grid flex-1 gap-8">
                <div className="grid gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getStatusColor(data?.data.status as string)}
                    startContent={getStatusIcon(data?.data.status as string)}
                    classNames={{
                      base: "px-2 gap-1",
                      content: "font-bold capitalize",
                    }}
                  >
                    {data?.data.status}
                  </Chip>

                  <h4 className="text-2xl font-bold capitalize -tracking-wide text-black">
                    {data?.data.title}
                  </h4>

                  <p className="max-w-[800px] font-medium leading-[170%] text-gray">
                    {data?.data.description}
                  </p>
                </div>

                <div className="flex items-start gap-8">
                  {[
                    [
                      "tanggal mulai",
                      formatDateWithoutTime(`${data?.data.start}`),
                    ],
                    [
                      "tanggal selesai",
                      formatDateWithoutTime(`${data?.data.end}`),
                    ],
                    ["durasi pengerjaan", `${data?.data.duration} Menit`],
                    ["jumlah soal", `${data?.data.total_questions} Butir`],
                  ].map(([label, value], index) => (
                    <div key={index} className="grid gap-1">
                      <span className="text-xs font-medium capitalize text-gray">
                        {label}:
                      </span>

                      <h1 className="font-semibold text-black">{value}</h1>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center gap-4">
                <Button
                  variant="light"
                  color="secondary"
                  startContent={<PencilLine weight="duotone" size={18} />}
                  onClick={() =>
                    router.push(`/tests/${data?.data.test_id}/edit`)
                  }
                  className="font-semibold"
                >
                  Edit Ujian
                </Button>

                {query.from === "programs_detail" && (
                  <Button
                    color="secondary"
                    startContent={<Eye weight="duotone" size={18} />}
                    onClick={() =>
                      router.push(`/tests/${data?.data.test_id}/grades`)
                    }
                    className="font-semibold"
                  >
                    Lihat Nilai Ujian
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="grid">
            <h5 className="sticky left-0 top-0 z-50 bg-white py-4 text-xl font-bold text-black">
              Daftar Soal
            </h5>

            <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
              {isLoading ? (
                Array.from({ length: data?.data.questions.length || 9 }).map(
                  (_, index) => (
                    <Skeleton key={index} className="h-40 w-full rounded-xl" />
                  ),
                )
              ) : data?.data.questions.length ? (
                data?.data.questions.map((question) => (
                  <CardQuestionPreview
                    key={question.question_id}
                    index={question.number}
                    question={question}
                  />
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                  <EmptyData text="Belum ada soal diujian ini" />
                </div>
              )}
            </div>

            {!isLoading && data?.data.questions.length ? (
              <Pagination
                isCompact
                showControls
                page={data?.data.page as number}
                total={data?.data.total_pages as number}
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
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;
  const query = ctx.query;

  return {
    props: {
      query,
      id,
    },
  };
});
