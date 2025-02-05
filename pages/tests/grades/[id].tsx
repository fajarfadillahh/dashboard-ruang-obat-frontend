import ButtonBack from "@/components/button/ButtonBack";
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
import { GradeTest, GradeTestResponse } from "@/types/test.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
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
import { Eye, Trash, XCircle } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery, id: string) {
  if (query.q) {
    return `/admin/tests/results/${encodeURIComponent(id)}?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/tests/results/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
}

export default function GradeUsersPage({
  token,
  params,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<GradeTestResponse>
  >({
    url: getUrl(query, params?.id as string),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({
        pathname: `/tests/grades/${id}`,
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push(`/tests/grades/${id}`);
    }
  }, [searchValue]);

  const columnsGrade = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Nilai", uid: "score" },
    { name: "Kategori", uid: "category" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: GradeTest, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof GradeTest];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{user.user_id}</div>
        );
      case "fullname":
        return (
          <div className="w-max font-medium text-black">{user.fullname}</div>
        );
      case "university":
        return (
          <div className="w-max font-medium text-black">{user.university}</div>
        );
      case "score":
        return (
          <div className="w-max font-medium text-black">
            {user.score === 0 ? (
              <Chip
                variant="flat"
                color="danger"
                size="sm"
                startContent={<XCircle weight="fill" size={16} />}
                classNames={{
                  base: "px-2 gap-1",
                  content: "font-bold capitalize",
                }}
              >
                Belum ada nilai
              </Chip>
            ) : (
              user.score
            )}
          </div>
        );
      case "category":
        return (
          <div className="w-max font-medium text-black">
            {user.score_category}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max gap-2">
            <Button
              variant="light"
              color="secondary"
              size="sm"
              startContent={<Eye weight="bold" size={16} />}
              className="w-max font-bold"
              onClick={() => router.push(`/tests/answers/${user.result_id}`)}
            >
              Lihat Jawaban
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <Trash weight="bold" size={18} className="text-danger" />
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Nilai</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus nilai berikut secara permanen?
                  </p>

                  <div className="grid gap-1">
                    {[
                      ["ID Pengguna", `${user.user_id}`],
                      ["Nama Lengkap", `${user.fullname}`],
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
                    onClick={() => handleDeleteAnswer(user.result_id)}
                    className="font-bold"
                  >
                    Ya, Hapus Nilai
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

  async function handleDeleteAnswer(id: string) {
    try {
      await fetcher({
        url: `/admin/results/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Nilai berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title={`Daftar Nilai ${data?.data.title}`}>
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
    <Layout
      title={`Daftar Nilai ${data?.data.title}`}
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-8">
            <TitleText
              title={`Daftar Nilai ${data?.data.title} 🎯`}
              text="Lihat semua nilai dari para mahasiswa/i"
            />

            <div className="grid">
              <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
                <SearchInput
                  placeholder="Cari User ID atau Nama User"
                  defaultValue={query.q as string}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch("")}
                />

                <p className="text-sm font-medium text-gray">
                  Total Jawaban{" "}
                  <strong className="font-black text-purple">
                    {data?.data.total_results ? data.data.total_results : "-"}/
                    {data?.data.total_participants
                      ? data.data.total_participants
                      : "-"}
                  </strong>
                </p>
              </div>

              <div className="overflow-x-scroll scrollbar-hide">
                <Table
                  isHeaderSticky
                  aria-label="grade users table"
                  color="secondary"
                  selectionMode="none"
                  classNames={customStyleTable}
                  className="scrollbar-hide"
                >
                  <TableHeader columns={columnsGrade}>
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody
                    items={data?.data.results}
                    emptyContent={
                      <EmptyData text="Nilai pengguna tidak ditemukan!" />
                    }
                  >
                    {(item: GradeTest) => (
                      <TableRow key={item.result_id}>
                        {(columnKey) => (
                          <TableCell>
                            {renderCellUsers(item, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {data?.data.results.length ? (
              <Pagination
                isCompact
                showControls
                page={data.data.page as number}
                total={data.data.total_pages as number}
                onChange={(e) => {
                  router.push({
                    pathname: `/tests/grades/${id}`,
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
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  id: string;
  params: ParsedUrlQuery;
  query: ParsedUrlQuery;
}> = async ({ req, params, query }) => {
  const id = params?.id as string;

  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
      query,
      id,
    },
  };
};
