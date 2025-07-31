import ErrorPage from "@/components/ErrorPage";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { DashboardResponse } from "@/types/dashboard.type";
import { SuccessResponse } from "@/types/global.type";
import { formatDayWithoutTime } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import { Button, Skeleton } from "@nextui-org/react";
import {
  ArrowRight,
  Certificate,
  ClipboardText,
  Icon,
  IconContext,
  Robot,
  UserCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

type DataDashboardType = {
  id: number;
  title: string;
  total?: number | string;
  path: string;
  icon: Icon;
};

export default function DashboardPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<SuccessResponse<DashboardResponse>>(
    {
      url: "/admin/dashboard",
      method: "GET",
      token,
    },
  );
  const [time, setTime] = useState(new Date());
  const [client, setClient] = useState(false);
  const formatTime = (num: number) => String(num).padStart(2, "0");

  const dataDashboard: DataDashboardType[] = [
    {
      id: 1,
      title: "Total Pengguna",
      path: "/users",
      total: data?.data.total_users,
      icon: UserCircle,
    },
    // {
    //   id: 2,
    //   title: "Pengguna Aktif",
    //   path: "/sessions",
    //   total: data?.data.total_online_users,
    //   icon: UserCircleCheck,
    // },
    {
      id: 3,
      title: "Total Program",
      path: "/programs",
      total: data?.data.total_programs,
      icon: Certificate,
    },
    {
      id: 4,
      title: "Total Ujian",
      path: "/tests",
      total: data?.data.total_tests,
      icon: ClipboardText,
    },
    {
      id: 5,
      title: "Saldo AI",
      path: "/statistics/ai",
      total: formatRupiah(
        Math.round(
          (data?.data.remaining_credits as number) *
            (data?.data.usd_to_idr_rate as number),
        ),
      ),
      icon: Robot,
    },
  ];

  useEffect(() => {
    setClient(true);

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!client) {
    return;
  }

  if (error) {
    return (
      <Layout title="Dashboard">
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
    <Layout title="Dashboard" className="scrollbar-hide">
      <Container className="gap-12">
        <TitleText
          title="Selamat Datang, Admin 👋"
          text="Berikut rangkuman aplikasi ruangobat.id"
        />

        <div className="grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <h4 className="font-bold text-black">
              Rangkuman Web Aplikasi RuangObat
            </h4>

            <span className="text-sm font-bold text-black">
              ⏰ {formatDayWithoutTime(new Date())}{" "}
              {`${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`}
            </span>
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            {isLoading
              ? Array.from({ length: dataDashboard.length }).map((_, index) => (
                  <Skeleton className="h-40 w-full rounded-xl" key={index} />
                ))
              : dataDashboard.length &&
                dataDashboard.map((item, index) => (
                  <div
                    key={index}
                    className="relative isolate flex items-start gap-4 overflow-hidden rounded-xl border-2 border-purple/10 p-6 hover:border-purple hover:bg-purple/10"
                  >
                    <IconContext.Provider
                      value={{
                        weight: "duotone",
                        size: 64,
                        className: "text-purple",
                      }}
                    >
                      <item.icon />

                      <div className="grid flex-1 gap-4">
                        <div className="grid">
                          <p className="text-sm font-medium text-gray">
                            {item.title}
                          </p>

                          <h1 className="text-4xl font-extrabold text-black">
                            {item.total}
                          </h1>
                        </div>

                        <Button
                          size="sm"
                          color="secondary"
                          endContent={
                            <ArrowRight
                              weight="bold"
                              size={16}
                              className="text-white"
                            />
                          }
                          onClick={() => router.push(item.path as string)}
                          className="w-max px-8 font-semibold"
                        >
                          Selengkapnya
                        </Button>
                      </div>
                    </IconContext.Provider>

                    <item.icon
                      weight="duotone"
                      size={180}
                      className="absolute -bottom-12 -right-12 -rotate-[25deg] text-purple/15"
                    />
                  </div>
                ))}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
