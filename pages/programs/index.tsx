import CardProgram from "@/components/card/CardProgram";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Program, ProgramsResponse } from "@/types/program.type";
import { Button, Pagination } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import useSWR from "swr";

export default function ProgramsPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<ProgramsResponse>
  >({
    url: getUrl("/admin/programs", query),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/programs");
    }
  }, [searchValue]);

  if (error) {
    return (
      <Layout title="Program">
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
    <Layout title="Program" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Program 📋"
          text="Program yang sudah dibuat oleh ruangobat.id"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Program atau ID Program..."
              defaultValue={query.q as string}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/programs/create")}
              className="font-semibold"
            >
              Tambah Program
            </Button>
          </div>

          {searchValue && data?.data.programs.length === 0 ? (
            <EmptyData text="Program tidak ditemukan!" />
          ) : (
            <div className="grid gap-2">
              {data?.data.programs.map((program: Program) => (
                <CardProgram
                  key={program.program_id}
                  program={program}
                  token={token as string}
                  mutate={mutate}
                />
              ))}
            </div>
          )}
        </div>

        {data?.data.programs.length ? (
          <Pagination
            isCompact
            showControls
            page={data.data.page as number}
            total={data.data.total_pages as number}
            onChange={(e) => {
              router.push({
                query: {
                  ...router.query,
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
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { query } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
    },
  };
});
