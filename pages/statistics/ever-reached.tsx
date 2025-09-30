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
import { formatDateWithoutTime } from "@/utils/formatDate";
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

type EverReachedResponse = {
  users: User[];
  page: number;
  total_users: number;
  total_pages: number;
  summary: Summary;
};

type User = {
  user_id: string;
  fullname: string;
  university: string;
  total_chat: number;
  total_cost: number;
  effective_limit: number;
  limit_hit_count: number;
  first_reached_date: string;
  last_reached_date: string;
};

type Summary = {
  total_users_ever_reached_limit: number;
  frequent_limit_users: number;
  recent_limit_users: number;
  most_frequent_limit_reacher: User;
};

export default function EverReachedRosaPage({
  token,
  rates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR<
    SuccessResponse<EverReachedResponse>
  >({
    url: getUrl("/statistics/ai/limits/ever-reached", {
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
    { name: "Total Biaya", uid: "total_cost" },
    { name: "Total Chat", uid: "total_chat" },
    { name: "Limit Dimiliki", uid: "effective_limit" },
    { name: "Limit Tercapai", uid: "limit_hit_count" },
    { name: "Pertama Tercapai", uid: "first_reached_date" },
    { name: "Terakhir Tercapai", uid: "last_reached_date" },
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
      case "effective_limit":
        return (
          <div className="font-medium text-black">{user.effective_limit}</div>
        );
      case "limit_hit_count":
        return (
          <div className="font-medium text-black">
            {user.effective_limit}{" "}
            <span className="text-xs font-semibold">(x kali)</span>
          </div>
        );
      case "first_reached_date":
        return (
          <div className="w-[200px] font-medium text-black">
            {formatDateWithoutTime(user.first_reached_date)}
          </div>
        );
      case "last_reached_date":
        return (
          <div className="w-[200px] font-medium text-black">
            {formatDateWithoutTime(user.last_reached_date)}
          </div>
        );

      default:
        return cellValue;
    }
  }

  const summaryItems = (data: Summary) => [
    {
      key: "Total Pengguna Yang Pernah Mencapai Limit 👥",
      value: data?.total_users_ever_reached_limit ?? "-",
    },
    {
      key: "Pengguna Dengan Frekuensi Tinggi Mencapai Limit 🔁",
      value: data?.frequent_limit_users ?? "-",
    },
    {
      key: "Pengguna Terbaru Yang Mencapai Limit 🆕",
      value: data?.recent_limit_users ?? "-",
    },
  ];

  const summaryUserLimit = (
    data: Summary["most_frequent_limit_reacher"],
    rates?: number,
  ) => [
    {
      key: "Total Biaya",
      value: data?.total_cost
        ? rates
          ? formatRupiah(Math.round((data?.total_cost as number) * rates))
          : `$${data?.total_cost}`
        : "-",
    },
    {
      key: "Total Chat",
      value: data?.total_chat ?? "-",
    },
    {
      key: "Limit Dimiliki",
      value: data?.effective_limit ?? "-",
    },
    {
      key: "Limit Tercapai",
      value: data?.effective_limit ? `${data?.effective_limit} (x kali)` : "-",
    },
    {
      key: "Pertama Tercapai",
      value: data?.first_reached_date
        ? formatDateWithoutTime(data?.first_reached_date)
        : "-",
    },
    {
      key: "Terakhir Tercapai",
      value: data?.last_reached_date
        ? formatDateWithoutTime(data?.last_reached_date)
        : "-",
    },
  ];

  if (error) {
    return (
      <Layout title="Aktifitas Pengguna Yang Mencapai Limit ROSA (AI)">
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
    <Layout
      title="Aktifitas Pengguna Yang Mencapai Limit ROSA (AI)"
      className="scrollbar-hide"
    >
      <Container className="gap-8">
        <TitleText
          title="Aktifitas Pengguna Yang Mencapai Limit ROSA (AI) 🤖"
          text="Pantau aktifitas pengguna yang pernah mencapai limit akses ROSA (AI)"
        />

        <div className="grid gap-4 pb-12">
          <div className="grid grid-cols-3 items-start gap-4">
            {summaryItems(data?.data.summary as Summary).map((item, index) => (
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

          <div className="flex flex-col gap-4 rounded-xl border-2 border-gray/10 p-6">
            <span className="text-center text-sm font-bold capitalize text-black">
              Pengguna dengan Frekuensi Tertinggi Mencapai Limit 🏆
            </span>

            <div className="grid gap-8">
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold text-secondary">
                  {data?.data.summary.most_frequent_limit_reacher.fullname}
                </span>

                <span className="text-sm font-medium text-gray">
                  {data?.data.summary.most_frequent_limit_reacher.university}
                </span>
              </div>

              <div className="flex items-center justify-between divide-x-2 divide-gray/10">
                {summaryUserLimit(
                  data?.data.summary
                    .most_frequent_limit_reacher as Summary["most_frequent_limit_reacher"],
                  rates,
                ).map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-xs capitalize text-gray">
                      {item.key}
                    </span>

                    <span className="font-bold text-secondary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
              selectionMode="single"
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
