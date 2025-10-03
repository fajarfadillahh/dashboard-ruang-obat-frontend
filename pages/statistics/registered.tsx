import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";

type LoginStatistics = {
  today: Today;
  last_seven_days: LastSevenDay[];
  months: Month[];
};

type Today = {
  day: string;
  value: number;
};

type LastSevenDay = {
  day: string;
  value: number;
};

type Month = {
  month: string;
  value: number;
};

export default function RegisteredStatistics({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<LoginStatistics>>({
    url: "/statistics/registered",
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

  return (
    <Layout title="Aktivitas Pendaftaran" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Aktifitas Pendaftaran 📝"
          text="Pantau aktifitas pendaftaran akun pengguna ruangobat.id"
        />

        <div className="mb-12 grid w-full max-w-md gap-1 justify-self-center rounded-xl border-2 border-gray/10 p-6">
          <h2 className="text-center text-lg font-bold text-black">
            {data?.data.today.day ?? "-"} 🗓️
          </h2>

          <div className="flex flex-col items-center gap-4">
            <span className="text-xs capitalize text-gray">
              Total Pendaftar Hari Ini
            </span>

            <span className="text-2xl font-bold text-secondary">
              {data?.data.today.value.toLocaleString("id-ID") ?? 0}
            </span>
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border-[2px] border-default-200 p-8">
          <h1 className="text-md font-semibold text-gray-500">
            7 Hari Terakhir
          </h1>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.data.last_seven_days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Total Pendaftar"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-4 overflow-scroll rounded-xl border-[2px] border-default-200 p-8">
          <h1 className="text-md font-semibold text-gray-500">
            Beberapa Bulan
          </h1>

          <div
            className="h-[300px]"
            style={{
              width: `${(data?.data.months?.length || 1) * 120}px`,
              minWidth: "400px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.data.months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Total Pendaftar"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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
