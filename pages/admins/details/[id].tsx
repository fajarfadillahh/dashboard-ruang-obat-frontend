import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { AdminType } from "@/types/admin.type";
import { SuccessResponse } from "@/types/global.type";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export default function DetailsAdminPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<AdminType>>({
    url: `/admins/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

  if (error) {
    return (
      <Layout title="Detail Admin">
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
    <Layout title="Detail Admin" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Detail Admin 🧑🏽
            </h1>
            <p className="font-medium text-gray">
              Anda bisa melihat detail admin disini.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-16">
            <div className="grid gap-[6px] rounded-xl border-2 border-l-8 border-gray/20 p-8">
              {[
                ["ID Admin", `${data?.data.admin_id}`],
                ["Nama Lengkap", `${data?.data.fullname}`],
                ["Role", `${data?.data.role}`],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-[150px_2px_1fr] gap-4 text-sm font-medium text-black"
                >
                  <p>{label}</p>
                  <span>:</span>
                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </div>

            <LogoRuangobat className="h-[200px] w-auto justify-self-center text-gray/20 grayscale" />
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  params: ParsedUrlQuery;
}> = async ({ req, params }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
    },
  };
};
