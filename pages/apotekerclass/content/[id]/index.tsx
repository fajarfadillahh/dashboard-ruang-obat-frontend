import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import TitleTextImage from "@/components/title/TitleTextImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { CourseResponse } from "@/types/course/course.type";
import { SuccessResponse } from "@/types/global.type";
import { Button, Select, SelectItem, Skeleton } from "@nextui-org/react";
import {
  ClipboardText,
  Funnel,
  Gear,
  IconContext,
  Play,
  Plus,
  SlidersHorizontal,
  Video,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export default function DetailCategoryContentPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const { data, isLoading } = useSWR<SuccessResponse<CourseResponse>>({
    url: getUrl(
      `/courses/${encodeURIComponent(params?.id as string)}/apotekerclass`,
      { filter, sort },
    ),
    method: "GET",
    token,
  });

  return (
    <Layout title="Daftar Konten" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack href="/apotekerclass/content" />

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <TitleTextImage
            src={data?.data.img_url as string}
            name={data?.data.name as string}
            description="Konten yang tersedia pada kategori ini"
          />
        )}

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
              onClick={() =>
                router.push(`/apotekerclass/content/${router.query.id}/course`)
              }
              className="font-semibold"
            >
              Tambah Konten
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.courses.length || 6 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.courses.length ? (
              data?.data.courses.map((course) => (
                <div
                  key={course.course_id}
                  className="group relative isolate flex items-center gap-4 rounded-xl border-2 border-gray/10 p-4 hover:cursor-pointer hover:bg-purple/10"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="secondary"
                    onClick={() =>
                      router.push(
                        `/apotekerclass/content/${router.query.id}/edit`,
                      )
                    }
                    className="absolute right-4 top-4 z-50 hidden group-hover:flex"
                  >
                    <CustomTooltip content="Edit Konten">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                    <Video weight="duotone" size={40} className="text-purple" />
                  </div>

                  <div className="grid flex-1 items-center gap-2">
                    <h4 className="line-clamp-1 font-bold text-black">
                      {course.title}
                    </h4>

                    <div className="flex items-start gap-4">
                      {[
                        ["Jumlah Video", <Play />, course.total_videos],
                        ["Jumlah Tes", <ClipboardText />, course.total_tests],
                      ].map(([label, icon, data], index) => (
                        <div key={index} className="grid gap-1">
                          <span className="text-xs font-medium text-gray">
                            {label as string}:
                          </span>

                          <div className="flex items-center gap-1">
                            <IconContext.Provider
                              value={{
                                weight: "duotone",
                                size: 16,
                                className: "text-purple",
                              }}
                            >
                              {icon}
                            </IconContext.Provider>

                            <p className="flex-1 text-sm font-semibold capitalize text-black">
                              {data as string}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Konten belum tersedia." />
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
