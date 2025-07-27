import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { DetailsUniversityResponse } from "@/types/university.type";
import { Button, Chip, Skeleton } from "@nextui-org/react";
import {
  CheckCircle,
  ClipboardText,
  PencilLine,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export default function DetailsUniversityPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const { data, isLoading, error } = useSWR<
    SuccessResponse<DetailsUniversityResponse>
  >({
    url: `/universities/${encodeURIComponent(params?.id as string)}`,
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

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <div className="grid grid-cols-[1fr_max-content] items-end gap-4">
            <div className="grid grid-cols-[200px_1fr] items-center gap-8">
              <Image
                src={data?.data.thumbnail_url as string}
                alt={`logo ${data?.data.title}`}
                width={1000}
                height={1000}
                className="size-full rounded-xl object-cover object-center"
                priority
              />

              <div className="grid gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color={data?.data.is_active ? "success" : "danger"}
                  startContent={
                    data?.data.is_active ? (
                      <CheckCircle weight="duotone" size={16} />
                    ) : (
                      <XCircle weight="duotone" size={18} />
                    )
                  }
                  classNames={{
                    base: "px-2 gap-1 mb-2",
                    content: "font-bold capitalize",
                  }}
                >
                  {data?.data.is_active
                    ? "Universitas Aktif"
                    : "Universitas Tidak Aktif"}
                </Chip>

                <h1 className="text-4xl font-extrabold text-black">
                  {data?.data.title}
                </h1>
                <p className="max-w-[500px] font-medium leading-[170%] text-gray">
                  {data?.data.description}
                </p>
              </div>
            </div>

            <Button
              variant="light"
              color="secondary"
              startContent={<PencilLine weight="duotone" size={18} />}
              onClick={() =>
                router.push(
                  `/apotekerclass/university/${data?.data.univ_id}/edit`,
                )
              }
              className="font-semibold"
            >
              Edit Universitas
            </Button>
          </div>
        )}

        <div className="mt-2 grid gap-4">
          <h4 className="text-xl font-bold -tracking-wide text-black">
            Daftar Tryout 📋
          </h4>

          <div className="grid grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: data?.data.tests.length || 6 }).map(
                  (_, index) => (
                    <Skeleton key={index} className="h-28 w-full rounded-xl" />
                  ),
                )
              : data?.data.tests.map((test) => (
                  <div
                    key={test.ass_id}
                    className="group relative isolate flex items-center gap-4 rounded-xl border-2 border-gray/10 p-4 hover:cursor-pointer hover:bg-purple/10"
                    onClick={() =>
                      router.push(`/apotekerclass/tryout/${test.ass_id}`)
                    }
                  >
                    <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                      <ClipboardText
                        weight="duotone"
                        size={40}
                        className="text-purple"
                      />
                    </div>

                    <div className="grid flex-1 items-center gap-2">
                      <h4 className="line-clamp-1 font-bold text-black">
                        {test.title}
                      </h4>

                      <div className="grid gap-1">
                        <span className="text-xs font-medium text-gray">
                          Jumlah Soal:
                        </span>

                        <div className="flex items-center gap-1">
                          <ClipboardText
                            weight="duotone"
                            size={16}
                            className="text-purple"
                          />

                          <p className="flex-1 text-sm font-semibold capitalize text-black">
                            {test.total_questions} Butir
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
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
