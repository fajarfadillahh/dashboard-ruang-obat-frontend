import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalExportDataUser from "@/components/modal/ModalExportDataUser";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { User, UsersResponse } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
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
import { CheckCircle, Eye, Plus, XCircle } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function UsersPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { data, error, isLoading } = useSWR<SuccessResponse<UsersResponse>>({
    url: getUrl("/admin/users", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Email", uid: "email" },
    { name: "No. Telpon", uid: "phone_number" },
    { name: "Status", uid: "is_verified" },
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
      case "is_verified":
        return (
          <div className="w-max">
            <Chip
              variant="flat"
              size="sm"
              color={user.is_verified ? "success" : "danger"}
              startContent={
                user.is_verified ? (
                  <CheckCircle weight="duotone" size={18} />
                ) : (
                  <XCircle weight="duotone" size={18} />
                )
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-bold capitalize",
              }}
            >
              {user.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
            </Chip>
          </div>
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

  return (
    <Layout title="Pengguna" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Pengguna 🧑🏽‍💻"
          text="Tabel pengguna yang sudah terdaftar di ruangobat.id"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <ModalExportDataUser {...{ token }} />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/users/batches")}
              className="font-semibold"
            >
              Tambah Pengguna
            </Button>
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
                isLoading={isLoading}
                items={data?.data.users || []}
                emptyContent={<EmptyData text="Pengguna tidak ditemukan!" />}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
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

        {!isLoading && data?.data.users.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              divRef.current?.scrollIntoView({ behavior: "smooth" });
              setPage(`${e}`);
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

export const getServerSideProps: GetServerSideProps<{
  token: string;
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
