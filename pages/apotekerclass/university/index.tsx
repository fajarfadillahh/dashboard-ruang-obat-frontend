import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { UniversityResponse } from "@/types/university.type";
import { Button, Select, SelectItem, Skeleton } from "@nextui-org/react";
import {
  ClipboardText,
  Funnel,
  Gear,
  Plus,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import useSWR from "swr";

export default function UniversityPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const { data, isLoading, error } = useSWR<
    SuccessResponse<UniversityResponse[]>
  >({
    url: getUrl(`/universities`, { filter, sort }),
    method: "GET",
    token,
  });

  return (
    <Layout title="Universitas" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Universitas - Masuk Apoteker 🏛️"
          text="Universitas yang tersedia pada kelas masuk apoteker"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
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
              onClick={() => router.push("/apotekerclass/university/create")}
              className="font-semibold"
            >
              Tambah Universitas
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.length || 6 }).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full rounded-xl" />
              ))
            ) : data?.data.length ? (
              data.data.map((univ) => (
                <div
                  key={univ.univ_id}
                  className={`group relative isolate flex items-center gap-4 rounded-xl border-2 p-4 hover:cursor-pointer ${
                    univ.is_active
                      ? "border-purple/10 hover:border-purple hover:bg-purple/10"
                      : "border-danger bg-danger/5 hover:bg-danger/10"
                  }`}
                  onClick={() =>
                    router.push(`/apotekerclass/university/${univ.univ_id}`)
                  }
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="secondary"
                    onClick={() =>
                      router.push(
                        `/apotekerclass/university/${univ.univ_id}/edit`,
                      )
                    }
                    className="absolute right-4 top-4 z-50 hidden group-hover:flex"
                  >
                    <CustomTooltip content="Edit Universitas">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                    <Image
                      src={univ.thumbnail_url as string}
                      alt="univ logo"
                      width={500}
                      height={500}
                      className={`size-full object-cover object-center ${univ.is_active ? "grayscale-0" : "grayscale"}`}
                      priority
                    />
                  </div>

                  <div className="grid flex-1 items-center gap-2">
                    <h4 className="line-clamp-1 font-bold text-black">
                      {univ.title}
                    </h4>

                    <div className="grid gap-1">
                      <span className="text-xs font-medium text-gray">
                        Jumlah Tryout:
                      </span>

                      <div className="flex items-center gap-1">
                        <ClipboardText
                          weight="duotone"
                          size={16}
                          className="text-purple"
                        />

                        <p className="flex-1 text-sm font-semibold capitalize text-black">
                          {univ.total_tests} tryout
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Universitas belum tersedia." />
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
