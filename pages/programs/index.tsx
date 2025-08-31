import CardProgram from "@/components/card/CardProgram";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Program, ProgramsResponse } from "@/types/program.type";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import { Funnel, Plus, SlidersHorizontal } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function ProgramsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });

  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<ProgramsResponse>
  >({
    url: getUrl("/admin/programs", {
      q: searchValue,
      page,
      filter,
      sort,
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
              defaultValue={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage("1");
              }}
              onClear={() => {
                setSearch("");
                setPage("");
              }}
            />

            <Select
              variant="flat"
              startContent={
                <SlidersHorizontal
                  weight="bold"
                  size={18}
                  className="text-gray"
                />
              }
              size="md"
              placeholder="Filter"
              selectedKeys={[filter]}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="free">Gratis</SelectItem>
              <SelectItem key="paid">Berbayar</SelectItem>
              <SelectItem key="active">Aktif</SelectItem>
              <SelectItem key="inactive">Nonaktif</SelectItem>
            </Select>

            <Select
              variant="flat"
              startContent={
                <Funnel weight="duotone" size={18} className="text-gray" />
              }
              size="md"
              placeholder="Sort"
              selectedKeys={[sort]}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="name.asc">Nama A-Z</SelectItem>
              <SelectItem key="name.desc">Nama Z-A</SelectItem>
              <SelectItem key="created_at.desc">Terbaru</SelectItem>
              <SelectItem key="created_at.asc">Terlama</SelectItem>
            </Select>

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/programs/create")}
              className="font-semibold"
            >
              Tambah Program
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.programs.length || 9 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.programs.length ? (
              data?.data.programs.map((program: Program) => (
                <CardProgram
                  key={program.program_id}
                  program={program}
                  token={token as string}
                  mutate={mutate}
                />
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Program belum tersedia." />
              </div>
            )}
          </div>
        </div>

        {!isLoading && data?.data.programs.length ? (
          <Pagination
            isCompact
            showControls
            page={data.data.page as number}
            total={data.data.total_pages as number}
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
