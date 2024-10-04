import CardProgram from "@/components/card/CardProgram";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { ProgramType } from "@/types/program.type";
import { fetcher } from "@/utils/fetcher";
import { Button, Input } from "@nextui-org/react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProgramsPage({
  programs,
  error,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  function handleDeleteProgram(id: string) {
    console.log(`Program dengan ID: ${id} berhasil terhapus!`);
  }

  async function handleUpdateStatus(
    program_id: string,
    is_active: boolean = true,
  ) {
    try {
      await fetcher({
        url: "/admin/programs/status",
        method: "PATCH",
        token,
        data: {
          program_id: program_id,
          is_active: !is_active,
        },
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  if (error) {
    return (
      <Layout title="Daftar Programs">
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
    <Layout title="Daftar Program">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Daftar Program 📋
            </h1>
            <p className="font-medium text-gray">
              Program yang sudah dibuat oleh{" "}
              <Link
                href="https://ruangobat.id"
                target="_blank"
                className="font-bold text-purple"
              >
                ruangobat.id
              </Link>
            </p>
          </div>

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white pb-4">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari Program..."
                startContent={
                  <MagnifyingGlass
                    weight="bold"
                    size={18}
                    className="text-gray"
                  />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                }}
                className="flex-1"
              />

              <Button
                variant="solid"
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={() => router.push("/programs/create")}
                className="font-semibold"
              >
                Tambah Program
              </Button>
            </div>

            <div className="grid gap-2">
              {programs?.programs.map((program: ProgramType) => (
                <CardProgram
                  key={program.program_id}
                  program={program}
                  handleDeleteProgram={() =>
                    handleDeleteProgram(program.program_id)
                  }
                  onStatusChange={() =>
                    handleUpdateStatus(program.program_id, program.is_active)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  programs?: any;
  error?: ErrorDataType;
  token?: string;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: "/admin/programs",
      method: "GET",
      token,
    })) as SuccessResponse<ProgramType[]>;

    return {
      props: {
        programs: response.data,
        token,
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
