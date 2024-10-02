import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
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

type DashboardType = {
  total_programs: number;
  total_tests: number;
  total_online_users: number;
  total_users: number;
};

export default function DashboardPage({
  dashboard,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
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

  return (
    <Layout title="Dashboard">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Selamat Datang, Admin 👋
            </h1>
            <p className="font-medium text-gray">
              Berikut rangkuman aplikasi ruangobat.id |{" "}
              <span className="font-bold text-black">
                {formatDayWithoutTime(new Date())}{" "}
                {`${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`}
              </span>
            </p>
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
                        {dashboard?.total_users}
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
                        {dashboard?.total_programs}
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
                        {dashboard?.total_online_users}
                      </h6>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    color="secondary"
                    size="sm"
                    endContent={<ArrowRight weight="bold" size={16} />}
                    onClick={() => router.push("/session")}
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
                        249
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

type DataProps = {
  dashboard?: DashboardType;
  error?: ErrorType;
};

type ErrorType = {
  success: boolean;
  status_code: number;
  error: {
    name: string;
    message: string;
    errors?: {
      code: string;
      meta: string;
      stack: string;
    };
  };
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: "/admin/dashboard",
      method: "GET",
      token,
    })) as SuccessResponse<DashboardType>;

    return {
      props: {
        dashboard: response.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
