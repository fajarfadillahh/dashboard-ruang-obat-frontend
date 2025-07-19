import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import {
  PackageSubscription,
  SubscriptionsResponse,
} from "@/types/subscriptions/packages.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  CheckCircle,
  PencilLine,
  Plus,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function SubscriptionsPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<SubscriptionsResponse>
  >({
    url: getUrl("/subscriptions/packages?type=videocourse", query),
    method: "GET",
    token,
  });

  const columnsSubscription = [
    { name: "Nama Paket", uid: "name" },
    { name: "Harga Paket", uid: "price" },
    { name: "Durasi", uid: "duration" },
    { name: "Status", uid: "is_active" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellPackageSubscription(
    packageSubscription: PackageSubscription,
    columnKey: React.Key,
  ) {
    const cellValue =
      packageSubscription[columnKey as keyof PackageSubscription];

    switch (columnKey) {
      case "name":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {packageSubscription.name}
          </div>
        );
      case "price":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {formatRupiah(packageSubscription.price)}
          </div>
        );
      case "duration":
        return (
          <div className="w-full max-w-[300px] font-medium text-black">
            {packageSubscription.duration} bulan
          </div>
        );
      case "is_active":
        return (
          <Chip
            variant="flat"
            color={packageSubscription.is_active ? "success" : "danger"}
            size="sm"
            startContent={
              packageSubscription.is_active ? (
                <CheckCircle weight="duotone" size={16} />
              ) : (
                <XCircle weight="duotone" size={16} />
              )
            }
            classNames={{
              base: "px-2 gap-1",
              content: "font-bold",
            }}
          >
            {packageSubscription.is_active ? "Aktif" : "Tidak Aktif"}
          </Chip>
        );
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(packageSubscription.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() =>
                router.push(
                  `/videocourse/subscriptions/${packageSubscription.package_id}/edit`,
                )
              }
            >
              <CustomTooltip content="Edit Paket">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Paket">
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Paket</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus{" "}
                    <strong className="font-extrabold text-purple">
                      {packageSubscription.name}
                    </strong>
                    ?
                  </p>
                </div>
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
                    className="font-semibold"
                    onClick={() =>
                      handleDeletePackage(packageSubscription.package_id)
                    }
                  >
                    Ya, Hapus
                  </Button>
                </>
              )}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  async function handleDeletePackage(package_id: string) {
    try {
      await fetcher({
        url: `/subscriptions/packages/${package_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Paket berhasil dihapus");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Paket Langganan">
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
    <Layout title="Paket Langganan" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Paket Langganan 📚"
          text="Paket langganan yang tersedia pada kelas video pembelajaran."
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex justify-end gap-4 bg-white pb-4">
            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={16} />}
              onClick={() => router.push("/videocourse/subscriptions/create")}
              className="w-max justify-self-end font-semibold"
            >
              Tambah Paket
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isHeaderSticky
              aria-label="subscriptions table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsSubscription}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.packages || []}
                emptyContent={<EmptyData text="Paket tidak ditemukan!" />}
                isLoading={isLoading}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
              >
                {(packageSubscription: PackageSubscription) => (
                  <TableRow key={packageSubscription.package_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellPackageSubscription(
                          packageSubscription,
                          columnKey,
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.packages.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              router.push({
                query: {
                  ...router.query,
                  page: e,
                },
              });
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
  const { query } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
    },
  };
});
