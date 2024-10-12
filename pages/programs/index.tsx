import CardProgram from "@/components/card/CardProgram";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { ProgramType } from "@/types/program.type";
import { fetcher } from "@/utils/fetcher";
import { Button, Input, Pagination } from "@nextui-org/react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export type ProgramsType = {
  programs: ProgramType[];
  page: number;
  total_programs: number;
  total_pages: number;
};

export default function ProgramsPage({
  programs,
  error,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 800);

  useEffect(() => {
    if (searchValue) {
      router.push({
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push("/programs");
    }
  }, [searchValue]);

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

  const filteredPrograms = programs?.programs.filter((program) =>
    program.title.toLowerCase().includes(`${searchValue}`),
  );

  if (error) {
    return (
      <Layout title="Daftar Program">
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

          <div className="grid gap-4">
            <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari Program ID atau Nama Program"
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
                onChange={(e) => setSearch(e.target.value)}
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

            {searchValue && filteredPrograms?.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-16">
                <MagnifyingGlass
                  weight="bold"
                  size={20}
                  className="text-gray"
                />
                <p className="font-semibold capitalize text-gray">
                  Program tidak ditemukan!
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                {programs?.programs.map((program: ProgramType) => (
                  <CardProgram
                    key={program.program_id}
                    program={program}
                    onStatusChange={() =>
                      handleUpdateStatus(program.program_id, program.is_active)
                    }
                  />
                ))}
              </div>
            )}

            {programs?.programs.length ? (
              <Pagination
                isCompact
                showControls
                page={programs?.page as number}
                total={programs?.total_pages as number}
                onChange={(e) => {
                  router.push({
                    query: {
                      page: e,
                    },
                  });
                }}
                className="justify-self-center"
                classNames={{
                  cursor: "bg-purple text-white",
                }}
              />
            ) : null}
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  programs?: ProgramsType;
  error?: ErrorDataType;
  token?: string;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/programs?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/programs?page=${query.page ? query.page : 1}`;
}

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  query,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: getUrl(query) as string,
      method: "GET",
      token,
    })) as SuccessResponse<ProgramsType>;

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
