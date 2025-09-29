import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { formatRupiah } from "@/utils/formatRupiah";
import { InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

type LoginStatistics = {
  remaining_credits: number;
  today: DayType;
  last_seven_days: DayType[];
  one_month: DayType[];
  months: Month[];
  summary: {
    one_month: {
      average_cost: number;
      average_tokens: number;
      average_chat: number;
      total_days: number;
    };
  };
};

type DayType = {
  day: string;
  total_tokens: number;
  total_cost: number;
  total_chat: number;
};

type Month = {
  month: string;
  total_tokens: number;
  total_cost: number;
  total_chat: number;
};

export default function AIStatistics({
  token,
  rates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<LoginStatistics>>({
    url: "/statistics/ai",
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title="Mentor">
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

  const months = data?.data.months.length
    ? data.data.months.map((month) => {
        return {
          month: month.month,
          total_chat: month.total_chat,
          total_tokens: month.total_tokens,
          total_cost: Math.round(month.total_cost * rates),
        };
      })
    : [];

  const week = data?.data.last_seven_days.length
    ? data.data.last_seven_days.map((day) => {
        return {
          day: day.day,
          total_chat: day.total_chat,
          total_tokens: day.total_tokens,
          total_cost: Math.round(day.total_cost * rates),
        };
      })
    : [];

  return (
    <Layout title="Aktivitas AI" className="scrollbar-hide">
      <Container className="gap-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-full mb-2 text-left text-lg font-bold text-gray-600">
            Hari ini {data?.data.today.day ?? "-"}
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Sisa Kredit
            </span>
            <span className="text-2xl font-bold text-secondary">
              {rates
                ? formatRupiah(
                    Math.round(
                      (data?.data.remaining_credits as number) * rates,
                    ),
                  )
                : (data?.data.remaining_credits ?? 0)}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Total Chat Hari Ini
            </span>
            <span className="text-2xl font-bold text-secondary">
              {data?.data.today.total_chat ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Total Cost Hari Ini (IDR)
            </span>
            <span className="text-2xl font-bold text-secondary">
              {rates
                ? formatRupiah(
                    Math.round((data?.data.today.total_cost as number) * rates),
                  )
                : (data?.data.today.total_cost ?? 0)}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Total Token Hari Ini
            </span>
            <span className="text-2xl font-bold text-secondary">
              {data?.data.today.total_tokens.toLocaleString("id-ID") ?? 0}
            </span>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-full mb-2 text-left text-lg font-bold text-gray-600">
            1 {new Date().toLocaleString("id-ID", { month: "long" })} sampai{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }) ?? "-"}
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Rata-rata cost
            </span>
            <span className="text-2xl font-bold text-secondary">
              {rates
                ? formatRupiah(
                    Math.round(
                      (data?.data.summary.one_month.average_cost as number) *
                        rates,
                    ),
                  )
                : (data?.data.summary.one_month.average_cost ?? 0)}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Rata-rata jumlah chat per hari
            </span>
            <span className="text-2xl font-bold text-secondary">
              {data?.data.summary.one_month.average_chat ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl border-2 border-default-200 bg-white p-6">
            <span className="mb-1 text-xs font-semibold text-gray-500">
              Rata-rata penggunaan token
            </span>
            <span className="text-2xl font-bold text-secondary">
              {data?.data.summary.one_month.average_tokens.toLocaleString(
                "id-ID",
              ) ?? 0}
            </span>
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border-[2px] border-default-200 p-8">
          <h1 className="text-md font-semibold text-gray-500">
            7 Hari Terakhir
          </h1>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={week}
                margin={{ top: 10, right: 40, left: 25, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total_chat"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Total Chat"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={week}
                margin={{ top: 10, right: 40, left: 25, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total_tokens"
                  stroke="#ffc658"
                  fill="#ffc658"
                  name="Total Token"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={week}
                margin={{ top: 10, right: 40, left: 25, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total_cost"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Total Cost (IDR)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-8 overflow-scroll rounded-xl border-[2px] border-default-200 p-8">
          <h1 className="text-md font-semibold text-gray-500">
            Beberapa Bulan
          </h1>

          <div
            className="h-[300px]"
            style={{
              width: `${(months.length || 1) * 170}px`,
              minWidth: "400px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={months}
                margin={{ top: 10, right: 40, left: 25, bottom: 10 }}
              >
                <XAxis dataKey="month" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="total_chat"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Total Chat"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className="h-[300px]"
            style={{
              width: `${(months.length || 1) * 170}px`,
              minWidth: "400px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={months}
                margin={{ top: 10, right: 40, left: 25, bottom: 10 }}
              >
                <XAxis dataKey="month" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="total_tokens"
                  stroke="#ffc658"
                  fill="#ffc658"
                  name="Total Token"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className="h-[300px]"
            style={{
              width: `${(months.length || 1) * 170}px`,
              minWidth: "400px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={months}
                margin={{ top: 10, right: 40, left: 25, bottom: 10 }}
              >
                <XAxis dataKey="month" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="total_cost"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Total Cost (IDR)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { query } = ctx;

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
      query: query as ParsedUrlQuery,
      rates,
    },
  };
});
