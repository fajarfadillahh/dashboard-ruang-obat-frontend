import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { AdminType } from "@/types/admin.type";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function DetailsAdminPage({
  admin,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
                ["ID Admin", `${admin?.admin_id}`],
                ["Nama Lengkap", `${admin?.fullname}`],
                ["Role", `${admin?.role}`],
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

type DataProps = {
  admin?: AdminType;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: `/admins/${encodeURIComponent(params?.id as string)}`,
      method: "GET",
      token,
    })) as SuccessResponse<AdminType>;

    return {
      props: {
        admin: response.data,
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
