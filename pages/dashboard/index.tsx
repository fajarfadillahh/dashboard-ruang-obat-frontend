import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { formatDayWithoutTime } from "@/utils/formatDate";
import { Button } from "@nextui-org/react";
import {
  ArrowRight,
  Certificate,
  ClipboardText,
  User,
  UserCheck,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

type DashboardResponse = {
  total_programs: number;
  total_tests: number;
  total_online_users: number;
  total_users: number;
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

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="Dashboard" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <div className="flex items-end justify-between gap-4">
            <TitleText
              title="Selamat Datang, Admin 👋"
              text="Berikut rangkuman aplikasi ruangobat.id"
            />

            <span className="text-sm font-bold text-black">
              ⏰ {formatDayWithoutTime(new Date())}{" "}
              {`${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`}
            </span>
          </div>

          <div className="grid gap-6 rounded-xl border-[2px] border-gray/20 px-16 py-8">
            <h4 className="font-bold text-black">Ringkasan Aplikasi CBT</h4>

            <div className="grid grid-cols-2 divide-x-2 divide-gray/20">
              <div className="grid divide-y-2 divide-gray/20 pr-12">
                <div className="grid pb-8">
                  <div className="inline-flex items-center gap-4">
                    <User weight="duotone" size={64} className="text-black" />

                    <div>
                      <p className="text-sm font-medium text-gray">
                        Total Pengguna
                      </p>
                      <h6 className="text-[32px] font-extrabold text-black">
                        {data?.data.total_users}
                      </h6>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    color="secondary"
                    size="sm"
                    endContent={<ArrowRight weight="bold" size={16} />}
                    onClick={() => router.push("/users")}
                    className="mt-2 w-max px-4 font-bold"
                  >
                    Lihat Detail
                  </Button>
                </div>

                <div className="grid pt-8">
                  <div className="inline-flex items-center gap-4">
                    <Certificate
                      weight="duotone"
                      size={64}
                      className="text-black"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray">
                        Total Program
                      </p>
                      <h6 className="text-[32px] font-extrabold text-black">
                        {data?.data.total_programs}
                      </h6>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    color="secondary"
                    size="sm"
                    endContent={<ArrowRight weight="bold" size={16} />}
                    onClick={() => router.push("/programs")}
                    className="mt-2 w-max px-4 font-bold"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>

              <div className="grid divide-y-2 divide-gray/20 pl-12">
                <div className="grid pb-8">
                  <div className="inline-flex items-center gap-4">
                    <UserCheck
                      weight="duotone"
                      size={64}
                      className="text-black"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray">
                        Pengguna Aktif
                      </p>
                      <h6 className="text-[32px] font-extrabold text-black">
                        {data?.data.total_online_users}
                      </h6>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    color="secondary"
                    size="sm"
                    endContent={<ArrowRight weight="bold" size={16} />}
                    onClick={() => router.push("/sessions")}
                    className="mt-2 w-max px-4 font-bold"
                  >
                    Lihat Detail
                  </Button>
                </div>

                <div className="grid pt-8">
                  <div className="inline-flex items-center gap-4">
                    <ClipboardText
                      weight="duotone"
                      size={64}
                      className="text-black"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray">
                        Total Ujian
                      </p>
                      <h6 className="text-[32px] font-extrabold text-black">
                        {data?.data.total_tests}
                      </h6>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    color="secondary"
                    size="sm"
                    endContent={<ArrowRight weight="bold" size={16} />}
                    onClick={() => router.push("/tests")}
                    className="mt-2 w-max px-4 font-bold"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
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
