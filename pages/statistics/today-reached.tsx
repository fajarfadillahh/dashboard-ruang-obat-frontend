import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { InferGetServerSidePropsType } from "next";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type TodayReachedResponse = {
  users: User[];
  page: number;
  total_users: number;
  total_pages: number;
};

type User = {
  user_id: string;
  fullname: string;
  university: string;
  chat_count_today: number;
  effective_limit: number;
};

export default function TodayReachedRosaPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR<
    SuccessResponse<TodayReachedResponse>
  >({
    url: getUrl("/statistics/ai/limits/today-reached", {
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
    { name: "Chat Hari Ini", uid: "chat_count_today" },
    { name: "Batas Efektif", uid: "effective_limit" },
  ];

  function renderCellUsers(user: User, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{user.user_id}</div>
        );
      case "fullname":
        return (
          <div className="w-[200px] font-medium text-black">
            {user.fullname}
          </div>
        );
      case "university":
        return (
          <div className="w-[300px] font-medium text-black">
            {user.university}
          </div>
        );
      case "chat_count_today":
        return (
          <div className="w-max font-medium text-black">
            {user.chat_count_today}
          </div>
        );
      case "effective_limit":
        return (
          <div className="w-max font-medium text-black">
            {user.effective_limit}
          </div>
        );

      default:
        return cellValue;
    }
  }

  if (error) {
    return (
      <Layout title="Aktifitas Limit Harian ROSA (AI)">
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
    <Layout title="Aktifitas Limit Harian ROSA (AI)" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Aktifitas Limit Harian ROSA (AI) 🤖"
          text="Pantau limitasi akses pengguna ROSA (AI) hari ini"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage("1");
              }}
              onClear={() => {
                setSearch("");
                setPage("");
              }}
            />
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

export const getServerSideProps = withToken();
