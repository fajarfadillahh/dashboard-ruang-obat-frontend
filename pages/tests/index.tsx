import CardTest from "@/components/card/CardTest";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { fetcher } from "@/utils/fetcher";
import { Button, Input, Pagination } from "@nextui-org/react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type TestsType = {
  tests: TestType[];
  page: number;
  total_tests: number;
  total_pages: number;
};

export default function TestsPage({
  tests,
  token,
  error,
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

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  if (error) {
    return (
      <Layout title="Daftar Ujian">
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
    <Layout title="Daftar Ujian">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Daftar Ujian ✏️
            </h1>
            <p className="font-medium text-gray">
              Ujian yang disesuaikan dengan kebutuhan
            </p>
          </div>

          <div className="grid gap-4">
            <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari Ujian ID atau Nama Ujian"
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
                onClick={() => router.push("/tests/create")}
                className="font-semibold"
              >
                Tambah Ujian
              </Button>
            </div>

            <div className="grid gap-2">
              {tests?.tests.map((test: TestType) => (
                <CardTest
                  key={test.test_id}
                  test={test}
                  onStatusChange={() =>
                    handleUpdateStatus(test.test_id, test.is_active)
                  }
                />
              ))}
            </div>

            {tests?.tests.length ? (
              <Pagination
                isCompact
                showControls
                page={tests?.page as number}
                total={tests?.total_pages as number}
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
  tests?: TestsType;
  token?: string;
  error?: ErrorDataType;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/tests?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/tests?page=${query.page ? query.page : 1}`;
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
    })) as SuccessResponse<TestsType>;

    return {
      props: {
        tests: response.data,
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
