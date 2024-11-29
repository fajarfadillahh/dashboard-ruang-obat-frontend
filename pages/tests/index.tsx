import CardTest from "@/components/card/CardTest";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { fetcher } from "@/utils/fetcher";
import { Button, Pagination } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type TestsResponse = {
  tests: TestType[];
  page: number;
  total_tests: number;
  total_pages: number;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/tests?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/tests?page=${query.page ? query.page : 1}`;
}

export default function TestsPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<TestsResponse>
  >({
    url: getUrl(query) as string,
    method: "GET",
    token,
  });
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
      router.push("/tests");
    }
  }, [searchValue]);

  async function handleUpdateStatus(
    test_id: string,
    is_active: boolean = true,
  ) {
    try {
      await fetcher({
        url: "/admin/tests/status",
        method: "PATCH",
        token,
        data: {
          test_id: test_id,
          is_active: !is_active,
        },
      });

      mutate();
      is_active
        ? toast.success("Ujian Berhasil Di Non-aktifkan")
        : toast.success("Ujian Berhasil Di Aktifkan");
    } catch (error) {
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

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

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="Ujian" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Ujian ✏️"
            text="Ujian yang disesuaikan dengan kebutuhan"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput
                placeholder="Cari Ujian ID atau Nama Ujian"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <Button
                variant="solid"
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={() => router.push("/tests/create")}
                className="font-semibold"
              >
                Tambah Ujian
              </Button>
            </div>

            {searchValue && data?.data.tests.length === 0 ? (
              <EmptyData text="Ujian tidak ditemukan!" />
            ) : (
              <div className="grid gap-2">
                {data?.data.tests.map((test: TestType) => (
                  <CardTest
                    key={test.test_id}
                    test={test}
                    onStatusChange={() =>
                      handleUpdateStatus(test.test_id, test.is_active)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {data?.data.tests.length ? (
            <Pagination
              isCompact
              showControls
              page={data?.data.page as number}
              total={data?.data.total_pages as number}
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
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  query: ParsedUrlQuery;
}> = async ({ req, query }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      query,
    },
  };
};
