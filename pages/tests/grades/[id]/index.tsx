import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usePagination";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
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
import { useState } from "react";

type ResultTestType = {
  test_id?: string;
  title?: string;
  user_id: string;
  fullname: string;
  university: string;
  score: number;
};

export default function GradeUsersPage({
  result,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const { data, page, pages, setPage } = usePagination(
    result as ResultTestType[],
    10,
  );

  const columnsGrade = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Nilai", uid: "score" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: ResultTestType, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof ResultTestType];

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
          <Button
            variant="light"
            color="secondary"
            size="sm"
            startContent={<Eye weight="bold" size={16} />}
            className="w-max font-bold"
          >
            Lihat Jawaban
          </Button>
        );

      default:
        return cellValue;
    }
  }

  if (error) {
    return (
      <Layout title={`Daftar Nilai ${result?.map((title) => title.title)}`}>
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

  const filteredUser = data?.length
    ? data?.filter(
        (participant) =>
          participant.user_id.toLowerCase().includes(search.toLowerCase()) ||
          participant.fullname.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <Layout
      title={`Daftar Nilai ${result?.map((title) => title.title)}`}
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-8">
            <div className="grid gap-1">
              <h1 className="max-w-[550px] text-[24px] font-bold leading-[120%] -tracking-wide text-black">
                Daftar Nilai {result?.map((title) => title.title)} 🎯
              </h1>
              <p className="font-medium text-gray">
                Lihat semua nilai dari para mahasiswa/i
              </p>
            </div>

            <div className="grid gap-4">
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
                classNames={{
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                }}
                className="max-w-[500px]"
                onChange={(e) => setSearch(e.target.value)}
              />

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
                    items={filteredUser}
                    emptyContent={
                      <span className="text-sm font-semibold italic text-gray">
                        Nilai pengguna tidak ditemukan!
                      </span>
                    }
                  >
                    {(item: ResultTestType) => (
                      <TableRow key={item.user_id}>
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

            {filteredUser.length > 10 ? (
              <Pagination
                isCompact
                showControls
                page={page}
                total={pages}
                onChange={setPage}
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

type DataProps = {
  result?: ResultTestType[];
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: `/admin/tests/results/${encodeURIComponent(params?.id as string)}`,
      method: "GET",
      token,
    })) as SuccessResponse<ResultTestType[]>;

    return {
      props: {
        result: response.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
