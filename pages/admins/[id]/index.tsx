import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { Admin } from "@/types/admin.type";
import { SuccessResponse } from "@/types/global.type";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";

export default function DetailsAdminPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading } = useSWR<SuccessResponse<Admin>>({
    url: `/admins/${encodeURIComponent(id)}`,
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
        <ButtonBack />

        <TitleText
          title="Detail Admin 🧑🏽"
          text="Anda bisa melihat detail admin disini"
        />

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
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      id,
    },
  };
});
