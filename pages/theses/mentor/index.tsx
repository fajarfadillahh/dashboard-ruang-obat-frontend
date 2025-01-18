import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalAddClassMentor from "@/components/modal/ModalAddClassMentor";
import TableClassMentor from "@/components/tables/TableClassMentor";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ClassMentor } from "@/types/classmentor.type";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function ThesesMentorsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<ClassMentor[]>
  >({
    url: "/admin/classmentor/thesis",
    method: "GET",
    token,
  });

  async function handleDeleteClassMentor(classMentorId: string) {
    try {
      await fetcher({
        url: `/admin/classmentor/${classMentorId}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Mentor berhasil dihapus");
    } catch (error) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Kelas Skripsi">
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
    <Layout
      title="Daftar Mentor Kelas Skripsi Farmasi"
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Mentor Kelas Skripsi Farmasi 📢"
            text="Semua mentor yang bertugas akan muncul semuanya disini"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex justify-end gap-4 bg-white pb-4">
              <ModalAddClassMentor
                {...{
                  mutate,
                  by: session.data?.user.fullname as string,
                  token,
                  type: "thesis",
                }}
              />
            </div>

            <div className="overflow-x-scroll scrollbar-hide">
              <TableClassMentor
                {...{
                  mentors: data?.data as ClassMentor[],
                  handleDeleteClassMentor,
                }}
              />
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
