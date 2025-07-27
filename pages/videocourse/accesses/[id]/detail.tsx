import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { Accesses, DetailAccess } from "@/types/accesses/accesses.type";
import { SuccessResponse } from "@/types/global.type";
import { formatDateSimple } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Chip, Skeleton } from "@nextui-org/react";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";
import { getStatus } from "..";

export default function DetailVideoCourseAccess({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<DetailAccess>>({
    url: `/accesses/${id}/detail`,
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title="Detail Akses">
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

  const detail: any[] = [
    ["ID Akses", `${data?.data.access_id}`],
    ["Nomor Invoice", `${data?.data.order.invoice_number}`],
    ["ID Pengguna", `${data?.data.user_id}`],
    ["Nama Lengkap", `${data?.data.fullname}`],
    ["Produk", `${data?.data.order.items[0].product_name}`],
    ["Durasi", `${data?.data.duration} bulan`],
    [
      "Total Harga",
      `${data?.data.order.total_amount ? formatRupiah(data?.data.order.total_amount) : 0}`,
    ],
    [
      "Jumlah Diskon",
      `${data?.data.order.discount_amount ? formatRupiah(data?.data.order.discount_amount) : 0}`,
    ],
    [
      "Jumlah Akhir",
      `${data?.data.order.final_amount ? formatRupiah(data?.data.order.final_amount) : 0}`,
    ],
    [
      "Jumlah Dibayar",
      `${data?.data.order.paid_amount ? formatRupiah(data?.data.order.paid_amount) : 0}`,
    ],
    [
      "Tanggal Dibuat",
      `${formatDateSimple(data?.data.created_at ?? "", true)}`,
    ],
    [
      "Tanggal Dimulai",
      `${formatDateSimple(data?.data.started_at ?? "", true)}`,
    ],
    [
      "Tanggal Berakhir",
      `${formatDateSimple(data?.data.expired_at ?? "", true)}`,
    ],
  ];

  if (data?.data.update_reason) {
    detail.push([
      "Alasan Pembaruan",
      <span className="font-bold" key={data?.data.update_reason}>
        {data?.data.update_reason}
      </span>,
    ]);
  }

  if (data?.data.revoked_at) {
    detail.push([
      "Tanggal Ditangguhkan",
      `${formatDateSimple(data?.data.revoked_at ?? "", true)}`,
    ]);
  }

  detail.push([
    "Status",
    <Chip
      key={data?.data.user_id as string}
      variant="flat"
      size="sm"
      color={
        getStatus(data?.data.status as Accesses["status"])?.color as
          | "danger"
          | "default"
          | "primary"
          | "success"
          | "secondary"
          | "warning"
      }
      startContent={
        getStatus(data?.data.status as Accesses["status"])
          ?.icon as React.ReactNode
      }
      classNames={{
        base: "px-2 gap-1",
        content: "font-bold capitalize",
      }}
    >
      {getStatus(data?.data.status as Accesses["status"])?.label ?? "-"}
    </Chip>,
  ]);

  return (
    <Layout title="Detail Akses" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title={`Detail Akses ${data?.data.fullname} 📋`}
          text="Anda bisa melihat data akses lebih detail di sini"
        />

        <div className="mb-8 grid grid-cols-[650px_auto] items-center gap-16">
          {isLoading ? (
            <Skeleton className="h-[450px] w-full rounded-xl" />
          ) : (
            <div className="flex items-start gap-4 rounded-xl border-2 border-l-8 border-gray/20 p-8">
              <div className="grid flex-1 gap-1.5">
                {detail.map(([label, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[150px_2px_1fr] gap-4 text-sm font-medium text-black"
                  >
                    <p>{label}</p>
                    <span>:</span>
                    <p className="font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <LogoRuangobat className="h-[200px] w-auto justify-self-center text-gray/20 grayscale" />
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
