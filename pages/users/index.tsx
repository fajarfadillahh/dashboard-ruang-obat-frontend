import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalExportDataUser from "@/components/modal/ModalExportDataUser";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type UsersResponse = {
  users: UserType[];
  page: number;
  total_users: number;
  total_pages: number;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/users?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/users?page=${query.page ? query.page : 1}`;
}

export default function UsersPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<SuccessResponse<UsersResponse>>({
    url: getUrl(query),
    method: "GET",
    token,
  });
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 800);

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/users");
    }
  }, [searchValue]);

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Email", uid: "email" },
    { name: "No. Telpon", uid: "phone_number" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: UserType, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{user.user_id}</div>
        );
      case "fullname":
        return <div className="font-medium text-black">{user.fullname}</div>;
      case "university":
        return <div className="font-medium text-black">{user.university}</div>;
      case "email":
        return <div className="font-medium text-black">{user.email}</div>;
      case "phone_number":
        return (
          <div className="font-medium text-black">{user.phone_number}</div>
        );
      case "action":
        return (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            color="secondary"
            onClick={() =>
              router.push(`/users/details/${encodeURIComponent(user.user_id)}`)
            }
          >
            <Eye weight="bold" size={18} />
          </Button>
        );

      default:
        return cellValue;
    }
  }

  if (error) {
    return (
      <Layout title="Daftar Pengguna">
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
    <Layout title="Daftar Pengguna" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Pengguna 🧑🏽‍💻"
            text="Tabel pengguna yang sudah terdaftar di ruangobat.id"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput
                placeholder="Cari User ID atau Nama User"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <ModalExportDataUser {...{ token }} />
            </div>

            <div className="overflow-x-scroll scrollbar-hide">
              <Table
                isHeaderSticky
                aria-label="users table"
                color="secondary"
                selectionMode="none"
                classNames={customStyleTable}
                className="scrollbar-hide"
              >
                <TableHeader columns={columnsUser}>
                  {(column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  )}
                </TableHeader>

                <TableBody
                  items={data?.data.users}
                  emptyContent={<EmptyData text="Pengguna tidak ditemukan!" />}
                >
                  {(item: UserType) => (
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

          {data?.data.users.length ? (
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
