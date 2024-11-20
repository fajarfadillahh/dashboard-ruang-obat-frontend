import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye, MagnifyingGlass, XCircle } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type ResultResponse = {
  test_id: string;
  title: string;
  results: Result[];
  page: number;
  total_results: number;
  total_pages: number;
  total_participants: number;
};

type Result = {
  result_id: string;
  user_id: string;
  fullname: string;
  university: string;
  score: number;
};

export default function GradeUsersPage({
  token,
  params,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<ResultResponse>
  >({
    url: getUrl(query, params?.id as string),
    method: "GET",
    token,
  });
  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, 800);

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
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: Result, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof Result];

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
                  content: "font-semibold capitalize",
                }}
              >
                Belum ada nilai
              </Chip>
            ) : (
              user.score
            )}
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

            <ModalConfirmDelete
              header="Nilai"
              id={user.result_id}
              title="Nilai Pengguna"
              handleDelete={() => handleDeleteAnswer(user.result_id)}
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
      toast.success("Nilai Berhasil Di Hapus");
    } catch (error) {
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
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
            <div className="grid gap-1">
              <h1 className="max-w-[550px] text-[24px] font-bold leading-[120%] -tracking-wide text-black">
                Daftar Nilai {data?.data.title} 🎯
              </h1>
              <p className="font-medium text-gray">
                Lihat semua nilai dari para mahasiswa/i
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-end justify-between gap-4">
                <Input
                  type="text"
                  variant="flat"
                  labelPlacement="outside"
                  placeholder="Cari User ID atau Nama User"
                  startContent={
                    <MagnifyingGlass
                      weight="bold"
                      size={18}
                      className="text-gray"
                    />
                  }
                  defaultValue={query.q as string}
                  onChange={(e) => setSearch(e.target.value)}
                  classNames={{
                    input:
                      "font-semibold placeholder:font-semibold placeholder:text-gray",
                  }}
                  className="max-w-[500px]"
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
                      <span className="text-sm font-semibold italic text-gray">
                        Nilai pengguna tidak ditemukan!
                      </span>
                    }
                  >
                    {(item: Result) => (
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

function getUrl(query: ParsedUrlQuery, id: string) {
  if (query.q) {
    return `/admin/tests/results/${encodeURIComponent(id)}?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/tests/results/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
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
