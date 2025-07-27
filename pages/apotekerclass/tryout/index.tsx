import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { TryoutResponse } from "@/types/tryout.type";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import {
  ClipboardText,
  Funnel,
  Gear,
  Plus,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function TryoutPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR<SuccessResponse<TryoutResponse>>({
    url: getUrl(`/universities/tryouts`, {
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
      <Layout title="Tryout Universitas">
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
    <Layout title="Tryout Universitas" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Tryout Universitas ✏️"
          text="Tryout universitas yang tersedia pada kelas masuk apoteker"
        />

        <div ref={divRef} className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Tryout..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Select
              aria-label="filter"
              size="md"
              variant="flat"
              placeholder="Filter"
              startContent={
                <SlidersHorizontal
                  weight="bold"
                  size={18}
                  className="text-gray"
                />
              }
              selectedKeys={[filter]}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="active">Aktif</SelectItem>
              <SelectItem key="inactive">Nonaktif</SelectItem>
            </Select>

            <Select
              aria-label="sort"
              size="md"
              variant="flat"
              placeholder="Sort"
              startContent={
                <Funnel weight="duotone" size={18} className="text-gray" />
              }
              selectedKeys={[sort]}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="title.asc">Nama A-Z</SelectItem>
              <SelectItem key="title.desc">Nama Z-A</SelectItem>
              <SelectItem key="created_at.desc">Terbaru</SelectItem>
              <SelectItem key="created_at.asc">Terlama</SelectItem>
            </Select>

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/apotekerclass/tryout/create")}
              className="font-semibold"
            >
              Tambah Tryout
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.tryouts.length || 6 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.tryouts.length ? (
              data.data.tryouts.map((tryout) => (
                <div
                  key={tryout.ass_id}
                  className="group relative isolate flex items-center gap-4 rounded-xl border-2 border-gray/10 p-4 hover:cursor-pointer hover:bg-purple/10"
                  onClick={() =>
                    router.push(`/apotekerclass/tryout/${tryout.ass_id}`)
                  }
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="secondary"
                    onClick={() =>
                      router.push(`/apotekerclass/tryout/${tryout.ass_id}/edit`)
                    }
                    className="absolute right-4 top-4 z-50 hidden group-hover:flex"
                  >
                    <CustomTooltip content="Edit Tryout">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                    <ClipboardText
                      weight="duotone"
                      size={40}
                      className="text-purple"
                    />
                  </div>

                  <div className="grid flex-1 items-center gap-2">
                    <h4 className="line-clamp-1 font-bold text-black">
                      {tryout.title}
                    </h4>

                    <div className="grid gap-1">
                      <span className="text-xs font-medium text-gray">
                        Jumlah Soal:
                      </span>

                      <div className="flex items-center gap-1">
                        <ClipboardText
                          weight="duotone"
                          size={16}
                          className="text-purple"
                        />

                        <p className="flex-1 text-sm font-semibold capitalize text-black">
                          {tryout.total_questions} Butir
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Tryout belum tersedia." />
              </div>
            )}
          </div>
        </div>

        {!isLoading && data?.data.tryouts.length ? (
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

export const getServerSideProps = withToken();
