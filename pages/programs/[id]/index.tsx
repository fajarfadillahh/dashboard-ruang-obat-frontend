import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { DetailsProgramResponse } from "@/types/program.type";
import { Test } from "@/types/test.type";
import { formatRupiah } from "@/utils/formatRupiah";
import { Button, Chip, Skeleton } from "@nextui-org/react";
import {
  CheckCircle,
  Eye,
  ImageBroken,
  PencilLine,
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function DetailsProgramPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, isLoading, error, mutate } = useSWR<
    SuccessResponse<DetailsProgramResponse>
  >({
    url: `/admin/programs/${encodeURIComponent(id)}`,
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
      <Container>
        <ButtonBack href="/programs" />

        <div className="mt-8 grid gap-16">
          {isLoading ? (
            <LoadingTitleImage />
          ) : (
            <div className="flex items-end gap-8">
              <div className="grid flex-1 grid-cols-[max-content_1fr] items-end gap-6">
                {/* cover image */}
                <div className="group relative isolate aspect-square size-32 overflow-hidden rounded-xl border-2 border-dashed border-gray/20 p-0.5">
                  {data?.data.qr_code ? (
                    <Image
                      src={data?.data.qr_code as string}
                      alt="qrcode image"
                      width={200}
                      height={200}
                      loading="lazy"
                      className="aspect-square rounded-lg object-cover object-center"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center rounded-lg bg-gray/20">
                      <ImageBroken
                        weight="duotone"
                        size={28}
                        className="text-gray"
                      />

                      <p className="text-xs font-semibold text-gray">
                        Belum ada QR!
                      </p>
                    </div>
                  )}

                  {/* overlay */}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(data?.data.url_qr_code, "_blank");
                    }}
                    className="absolute left-0 top-0 hidden size-full items-center justify-center bg-purple/50 text-xs font-semibold text-white backdrop-blur-md group-hover:flex"
                  >
                    Grup Program
                  </Link>
                </div>

                {/* data program */}
                <div className="grid gap-4">
                  <h1 className="text-2xl font-bold -tracking-wide text-black">
                    {data?.data.title}
                  </h1>

                  <div className="flex items-start gap-6">
                    {[
                      [
                        "harga program",
                        data?.data.type === "free" ? (
                          <Chip
                            variant="flat"
                            color="default"
                            startContent={<Tag weight="duotone" size={18} />}
                            classNames={{
                              base: "px-2 gap-1",
                              content: "font-bold text-black",
                            }}
                          >
                            Gratis
                          </Chip>
                        ) : (
                          formatRupiah(data?.data.price as number)
                        ),
                      ],
                      ["jumlah ujian", `${data?.data.total_tests} Ujian`],
                    ].map(([label, value], index) => (
                      <div key={index} className="grid gap-1">
                        <span className="text-xs font-medium capitalize text-gray">
                          {label}:
                        </span>

                        <h2 className="font-bold text-black">{value}</h2>
                      </div>
                    ))}

                    <div className="grid gap-1">
                      <span className="text-xs font-medium capitalize text-gray">
                        Status Program:
                      </span>

                      <Chip
                        size="sm"
                        variant="flat"
                        color={data?.data.is_active ? "success" : "danger"}
                        startContent={
                          data?.data.is_active ? (
                            <CheckCircle weight="duotone" size={18} />
                          ) : (
                            <XCircle weight="duotone" size={18} />
                          )
                        }
                        classNames={{
                          base: "px-2 gap-1",
                          content: "font-bold",
                        }}
                      >
                        {data?.data.is_active
                          ? "Program Aktif"
                          : "Program Tidak Aktif"}
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-4">
                <Button
                  variant="light"
                  color="secondary"
                  startContent={<PencilLine weight="duotone" size={18} />}
                  onClick={() =>
                    router.push(`/programs/${data?.data.program_id}/edit`)
                  }
                  className="font-semibold"
                >
                  Edit Program
                </Button>

                <Button
                  color="secondary"
                  startContent={<Eye weight="duotone" size={18} />}
                  onClick={() =>
                    router.push(
                      `/programs/${data?.data.program_id}/participants`,
                    )
                  }
                  className="font-semibold"
                >
                  Lihat Partisipan
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <h4 className="text-xl font-bold -tracking-wide text-black">
              Daftar Ujian 📋
            </h4>

            <div className="grid grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: data?.data.tests.length || 6 }).map(
                  (_, index) => (
                    <Skeleton key={index} className="h-28 w-full rounded-xl" />
                  ),
                )
              ) : data?.data.tests.length ? (
                data?.data.tests.map((test: Test) => (
                  <CardTest
                    key={test.test_id}
                    test={test}
                    token={token as string}
                    mutate={mutate}
                  />
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                  <EmptyData text="Ujian belum tersedia." />
                </div>
              )}
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
