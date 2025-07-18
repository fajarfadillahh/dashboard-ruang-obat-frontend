import CardTest from "@/components/card/CardTest";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Test, TestsResponse } from "@/types/test.type";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function TestsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<TestsResponse>
  >({
    url: getUrl("/admin/tests", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      divRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchValue]);

  if (error) {
    return (
      <Layout title="Ujian">
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
    <Layout title="Ujian" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Ujian ✏️"
          text="Ujian yang disesuaikan dengan kebutuhan"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Ujian atau ID Ujian..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/tests/create")}
              className="font-semibold"
            >
              Tambah Ujian
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16">
              <Spinner label="Loading..." color="secondary" />
            </div>
          ) : null}

          {!isLoading && !data?.data.tests.length ? (
            <EmptyData text="Ujian tidak ditemukan!" />
          ) : (
            <div className="grid gap-2">
              {data?.data.tests.map((test: Test) => (
                <CardTest
                  key={test.test_id}
                  {...{
                    token: token as string,
                    test: test,
                    mutate,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {!isLoading && data?.data.tests.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              setPage(`${e}`);
              divRef.current?.scrollIntoView({ behavior: "smooth" });
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
