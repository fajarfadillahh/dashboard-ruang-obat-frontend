import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalExportDataUser from "@/components/modal/ModalExportDataUser";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { User, UsersResponse } from "@/types/user.type";
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
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import useSWR from "swr";

export default function UsersPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading } = useSWR<SuccessResponse<UsersResponse>>({
    url: getUrl("/admin/users", query),
    method: "GET",
    token,
  });

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

  function renderCellUsers(user: User, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof User];

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
              router.push(`/users/${encodeURIComponent(user.user_id)}`)
            }
          >
            <CustomTooltip content="Detail Pengguna">
              <Eye weight="duotone" size={18} />
            </CustomTooltip>
          </Button>
        );

      default:
        return cellValue;
    }
  }

  if (error) {
    return (
      <Layout title="Pengguna">
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
    <Layout title="Pengguna" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Pengguna 🧑🏽‍💻"
          text="Tabel pengguna yang sudah terdaftar di ruangobat.id"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={query.q as string}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <ModalExportDataUser {...{ token }} />
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
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
                {(user: User) => (
                  <TableRow key={user.user_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(user, columnKey)}</TableCell>
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
