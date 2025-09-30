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
import { formatRupiah } from "@/utils/formatRupiah";
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

type UserCost = {
  user_id: string;
  fullname: string;
  university: string;
  total_chat: number;
  total_cost: number;
};

type CostsRosaResponse = {
  users: UserCost[];
  page: number;
  total_users: number;
  total_pages: number;
  summary: {
    total_cost_all_users: number;
    total_chats_all_users: number;
    average_cost_per_user: number;
    average_chats_per_user: number;
    highest_cost_user: UserCost;
    most_active_user: UserCost;
  };
};

export default function CostsRosaAIPage({
  token,
  rates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR<SuccessResponse<CostsRosaResponse>>(
    {
      url: getUrl("/statistics/ai/users/costs", {
        q: searchValue,
        page,
      }),
      method: "GET",
      token,
    },
  );

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Total Biaya", uid: "total_cost" },
    { name: "Total Chat", uid: "total_chat" },
  ];

  function renderCellUsers(user: UserCost, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof UserCost];

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
      case "total_cost":
        return (
          <div className="font-medium text-black">
            {user.total_cost
              ? rates
                ? formatRupiah(Math.round((user.total_cost as number) * rates))
                : `$${user.total_cost}`
              : "-"}
          </div>
        );
      case "total_chat":
        return <div className="font-medium text-black">{user.total_chat}</div>;

      default:
        return cellValue;
    }
  }

  const summaryItems = (data: any, rates?: number) => [
    {
      key: "Total seluruh biaya",
      value: data?.total_cost_all_users
        ? rates
          ? formatRupiah(
              Math.round((data?.total_cost_all_users as number) * rates),
            )
          : `$${data?.total_cost_all_users}`
        : "-",
    },
    {
      key: "Total semua chat",
      value: data?.total_chats_all_users ?? "-",
    },
    {
      key: "Rata-rata biaya per pengguna",
      value: data?.average_cost_per_user
        ? rates
          ? formatRupiah(
              Math.round((data?.average_cost_per_user as number) * rates),
            )
          : `$${data?.average_cost_per_user}`
        : "-",
    },
    {
      key: "Rata-rata chat per pengguna",
      value: data?.average_chats_per_user ?? "-",
    },
  ];

  if (error) {
    return (
      <Layout title="Aktivitas Biaya ROSA (AI)">
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
    <Layout title="Aktivitas Biaya ROSA (AI)" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Aktifitas Biaya ROSA (AI) 🤖"
          text="Pantau biaya pengguna dalam mengakses ROSA (AI)"
        />

        <div className="grid gap-4 pb-12">
          <div className="grid grid-cols-4 items-start gap-4">
            {summaryItems(data?.data.summary, rates).map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-xl border-2 border-gray/10 p-6"
              >
                <span className="mb-1 text-xs capitalize text-gray">
                  {item.key}
                </span>

                <span className="text-2xl font-bold text-secondary">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            <SummaryCardUser
              title="Pengguna dengan biaya tertinggi 📈"
              user={data?.data.summary.highest_cost_user}
              rates={rates}
            />

            <SummaryCardUser
              title="Pengguna paling aktif ⚡️"
              user={data?.data.summary.most_active_user}
              rates={rates}
            />
          </div>
        </div>

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
              aria-label="cost users table"
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
                {(user: UserCost) => (
                  <TableRow key={user.user_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(user, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
              className="mt-2 justify-self-center"
              classNames={{
                cursor: "bg-purple text-white",
              }}
            />
          ) : null}
        </div>
      </Container>
    </Layout>
  );
}

function SummaryCardUser({
  title,
  user,
  rates,
}: {
  title: string;
  user?: UserCost;
  rates?: number;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border-2 border-gray/10 p-6">
      <span className="text-center text-sm font-bold capitalize text-black">
        {title}
      </span>

      <div className="grid gap-8">
        <div className="flex flex-col items-center">
          <span className="text-xl font-extrabold text-secondary">
            {user?.fullname}
          </span>

          <span className="text-sm font-medium text-gray">
            {user?.university}
          </span>
        </div>

        <div className="flex items-center justify-around divide-x-2 divide-gray/10">
          <div className="flex flex-1 flex-col items-center">
            <span className="text-xs capitalize text-gray">Total biaya</span>

            <span className="text-lg font-bold text-secondary">
              {user?.total_cost
                ? rates
                  ? formatRupiah(
                      Math.round((user?.total_cost as number) * rates),
                    )
                  : `$${user?.total_cost}`
                : "-"}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center">
            <span className="text-xs capitalize text-gray">Total chat</span>

            <span className="text-lg font-bold text-secondary">
              {user?.total_chat}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withToken(async () => {
  let rates: number;

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/usd");
    const data: { rates: { IDR: number } } = await response.json();

    rates = data.rates.IDR;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    rates = 0;
  }

  return {
    props: {
      rates,
    },
  };
});
