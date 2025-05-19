import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { LimitAI } from "@/types/ai/limit.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { CurrencyDollar, PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";

export default function AILimitsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading, error } = useSWR<SuccessResponse<LimitAI[]>>({
    url: "/ai/limits",
    method: "GET",
    token,
  });

  const columnsLimit = [
    { name: "Tipe Limit", uid: "type" },
    { name: "Total", uid: "total" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellLimits(limit: LimitAI, columnKey: React.Key) {
    const cellValue = limit[columnKey as keyof LimitAI];

    switch (columnKey) {
      case "type":
        return (
          <div className="font-medium text-black">
            {limit.type === "free" ? (
              "Gratis"
            ) : (
              <p className="inline-flex items-center">
                Berbayar
                <CurrencyDollar
                  weight="bold"
                  size={16}
                  className="text-success"
                />
              </p>
            )}
          </div>
        );
      case "total":
        return <div className="font-medium text-black">{limit.total}</div>;
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(limit.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex items-center gap-2">
            <Button isIconOnly variant="light" size="sm" color="secondary">
              <CustomTooltip content="Edit Layanan">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Edit Layanan">
                    <Trash weight="bold" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Limit</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus limit{" "}
                    <strong className="font-extrabold text-purple">
                      {limit.total}
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

                  <Button color="danger" className="font-semibold">
                    Ya, Hapus Limit
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

  if (error) {
    return (
      <Layout title="Limitasi Pengguna AI">
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
    <Layout title="Daftar Limitasi Pengguna AI">
      <Container className="gap-8">
        <ButtonBack href="/ai" />

        <TitleText
          title="Daftar Limitasi Pengguna AI 📋"
          text="Semua data limitasi akan muncul di sini"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex justify-end bg-white pb-4">
            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              className="font-semibold"
            >
              Tambah Limitasi
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isHeaderSticky
              aria-label="limits table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsLimit}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data}
                emptyContent={<EmptyData text="Limit tidak ditemukan!" />}
              >
                {(limit: LimitAI) => (
                  <TableRow key={limit.limit_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellLimits(limit, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
