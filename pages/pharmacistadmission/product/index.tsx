import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { SuccessResponse } from "@/types/global.type";
import { PharmacistAdmissionProductResponse } from "@/types/pharmacistadmission.type";
import { Button } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/pharmacistadmission/products?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/pharmacistadmission/products?page=${query.page ? query.page : 1}`;
}

export default function PharmacistAdmissionProductPage({
  query,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<PharmacistAdmissionProductResponse>
  >({
    url: getUrl(query) as string,
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/pharmacistadmission/product");
    }
  }, [searchValue]);

  if (error) {
    return (
      <Layout title="Daftar Produk per Universitas">
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
    <Layout title="Daftar Produk per Universitas" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Produk per Universitas 📦"
            text="Semua produk kelas akan muncul disini"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput
                placeholder="Cari Kelas ID atau Nama Kelas"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <Button
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={() =>
                  router.push("/pharmacistadmission/product/create")
                }
                className="font-bold"
              >
                Tambah Kelas
              </Button>
            </div>

            <div>table</div>
          </div>

          <div>pagination</div>
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
