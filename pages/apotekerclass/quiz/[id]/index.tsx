import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import TitleTextImage from "@/components/title/TitleTextImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { QuizResponse } from "@/types/quiz/quiz.type";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import {
  BookBookmark,
  ClipboardText,
  Funnel,
  Gear,
  Plus,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useRef } from "react";
import useSWR from "swr";

export default function DetailCategoryQuizPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading } = useSWR<SuccessResponse<QuizResponse>>({
    url: getUrl(
      `/quizzes/${encodeURIComponent(params?.id as string)}/apotekerclass`,
      { page, filter, sort },
    ),
    method: "GET",
    token,
  });

  return (
    <Layout title="Daftar Kuis" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <TitleTextImage
            src={data?.data.img_url as string}
            name={data?.data.name as string}
            description="Kuis yang tersedia pada kategori ini"
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
                router.push(`/apotekerclass/quiz/${router.query.id}/create`)
              }
              className="font-semibold"
            >
              Tambah Kuis
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.quizzes.length || 6 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.quizzes.length ? (
              data?.data.quizzes.map((quizz) => (
                <div
                  key={quizz.ass_id}
                  className="group relative isolate flex items-center gap-4 rounded-xl border-2 border-gray/10 p-4 hover:cursor-pointer hover:bg-purple/10"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="secondary"
                    onClick={() =>
                      router.push(`/apotekerclass/quiz/${quizz.ass_id}/edit`)
                    }
                    className="absolute right-4 top-4 z-50 hidden group-hover:flex"
                  >
                    <CustomTooltip content="Edit Kuis">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                    <BookBookmark
                      weight="duotone"
                      size={40}
                      className="text-purple"
                    />
                  </div>

                  <div className="grid flex-1 items-center gap-2">
                    <h4 className="line-clamp-1 font-bold text-black">
                      {quizz.title}
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
                          {quizz.total_questions} Butir
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Kuis belum tersedia." />
              </div>
            )}
          </div>
        </div>

        {!isLoading && data?.data.quizzes.length ? (
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
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
