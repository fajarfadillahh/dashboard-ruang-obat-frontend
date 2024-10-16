import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type DetailsUserType = {
  user_id: string;
  fullname: string;
  email: string;
  phone_number: string;
  gender: string;
  university: string;
  created_at: string;
};

export default function DetailsUserPage({
  user,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(user);

  if (error) {
    return (
      <Layout title="Detail Pengguna">
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
    <Layout title="Detail Pengguna" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Detail Pengguna 🧑🏽‍💻
            </h1>
            <p className="font-medium text-gray">
              Anda bisa melihat data pengguna lebih detail disini.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-16">
            <div className="grid gap-[6px] rounded-xl border-2 border-l-8 border-gray/20 p-8">
              {[
                ["ID Pengguna", `${user?.user_id}`],
                ["Nama Lengkap", `${user?.fullname}`],
                ["Email", `${user?.email}`],
                [
                  "Jenis Kelamin",
                  `${user?.gender === "M" ? "Laki-Laki" : "Perempuan"}`,
                ],
                ["No. Telpon", `${user?.phone_number}`],
                ["Asal Kampus", `${user?.university}`],
                ["Dibuat Pada", `${formatDate(user?.created_at ?? "-")}`],
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
  user?: DetailsUserType;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: `/admin/users/${encodeURIComponent(params?.id as string)}`,
      method: "GET",
      token,
    })) as SuccessResponse<DetailsUserType>;

    return {
      props: {
        user: response.data,
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
