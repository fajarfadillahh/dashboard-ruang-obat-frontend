import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { SuccessResponse } from "@/types/global.type";
import {
  PharmacistAdmissionUniversity,
  PharmacistAdmissionUniversityResponse,
} from "@/types/pharmacistadmission.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Pagination,
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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/pharmacistadmission?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/pharmacistadmission?page=${query.page ? query.page : 1}`;
}

export default function PharmacistAdmissionUniversityPage({
  query,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<PharmacistAdmissionUniversityResponse>
  >({
    url: getUrl(query) as string,
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/pharmacistadmission/university");
    }
  }, [searchValue]);

  const columnsPharmacistAdmissionUniversity = [
    { name: "ID Universitas", uid: "university_id" },
    { name: "Nama Universitas", uid: "name" },
    { name: "Jumlah Kelas", uid: "total_class" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Status", uid: "status" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellPharmacistAdmissionUniversity(
    pauniversity: PharmacistAdmissionUniversity,
    columnKey: React.Key,
  ) {
    const cellValue =
      pauniversity[columnKey as keyof PharmacistAdmissionUniversity];

    switch (columnKey) {
      case "university_id":
        return (
          <div className="w-max font-medium text-black">
            {pauniversity.university_id}
          </div>
        );
      case "name":
        return (
          <div className="font-medium text-black">{pauniversity.name}</div>
        );
      case "total_class":
        return (
          <div className="font-medium text-black">
            {pauniversity.total_class}
          </div>
        );
      case "created_at":
        return (
          <div className="w-max font-medium text-black">
            {formatDate(pauniversity.created_at)}
          </div>
        );
      case "status":
        return (
          <div className="w-max font-medium text-black">
            <Chip
              variant="flat"
              size="sm"
              color={pauniversity.is_active ? "success" : "danger"}
              startContent={
                pauniversity.is_active ? (
                  <CheckCircle weight="fill" size={16} />
                ) : (
                  <XCircle weight="fill" size={16} />
                )
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-bold capitalize",
              }}
            >
              {pauniversity.is_active
                ? "Tampil di homepage"
                : "Tidak tampil di homepage"}
            </Chip>
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <Button
              isIconOnly
              variant="light"
              color="secondary"
              size="sm"
              onClick={() =>
                router.push(
                  `/pharmacistadmission/university/edit/${encodeURIComponent(pauniversity.university_id)}`,
                )
              }
            >
              <PencilLine weight="bold" size={18} />
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <Trash weight="bold" size={18} className="text-danger" />
                </Button>
              }
              header={
                <h1 className="font-bold text-black">Hapus Universitas</h1>
              }
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus universitas berikut secara
                    permanen?
                  </p>

                  <div className="grid gap-1">
                    {[
                      ["ID Universitas", `${pauniversity.university_id}`],
                      ["Nama Universitas", `${pauniversity.name}`],
                    ].map(([label, value], index) => (
                      <div
                        key={index}
                        className="grid gap-4 [grid-template-columns:110px_2px_1fr;]"
                      >
                        <h1 className="text-gray">{label}</h1>
                        <span>:</span>
                        <h1 className="font-extrabold text-purple">{value}</h1>
                      </div>
                    ))}
                  </div>

                  <p className="leading-[170%] text-gray">
                    Tindakan ini tidak dapat dibatalkan, dan data yang sudah
                    dihapus tidak dapat dipulihkan.
                  </p>
                </div>
              }
              footer={(onClose: any) => (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-bold"
                  >
                    Tutup
                  </Button>

                  <Button
                    color="danger"
                    className="font-bold"
                    onClick={() =>
                      handleDeletePharmacistAdmissionUniversity(
                        pauniversity.university_id,
                      )
                    }
                  >
                    Ya, Hapus Universitas
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

  async function handleDeletePharmacistAdmissionUniversity(id: string) {
    try {
      await fetcher({
        url: `/admin/pharmacistadmission/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Universitas berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Daftar Kelas per Universitas">
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
    <Layout title="Daftar Kelas per Universitas" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Kelas per Universitas 🏫"
            text="Semua kelas per universitas akan muncul disini"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput
                placeholder="Cari Universitas ID atau Nama Universitas"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <Button
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={() =>
                  router.push("/pharmacistadmission/university/create")
                }
                className="font-bold"
              >
                Tambah Universitas
              </Button>
            </div>

            <div className="overflow-x-scroll scrollbar-hide">
              <Table
                isHeaderSticky
                aria-label="pharmacist admission university table"
                color="secondary"
                selectionMode="none"
                classNames={customStyleTable}
                className="scrollbar-hide"
              >
                <TableHeader columns={columnsPharmacistAdmissionUniversity}>
                  {(column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  )}
                </TableHeader>

                <TableBody
                  items={data?.data.pharmacist_admission}
                  emptyContent={
                    <EmptyData text="Universitas tidak ditemukan!" />
                  }
                >
                  {(pharmacistadmission) => (
                    <TableRow key={pharmacistadmission.university_id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellPharmacistAdmissionUniversity(
                            pharmacistadmission,
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

          {data?.data.pharmacist_admission.length ? (
            <Pagination
              isCompact
              showControls
              page={data.data.page as number}
              total={data.data.total_pages as number}
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
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  query: ParsedUrlQuery;
}> = async ({ req, query }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      query,
    },
  };
};
