import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { formatDateWithoutTime } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import { Funnel, PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type ArticleRepsonse = {
  articles: Article[];
  page: number;
  total_articles: number;
  total_pages: number;
};

type Article = {
  topic: {
    name: string;
    first_letter: string;
  };
  article_id: string;
  title: string;
  slug: string;
  img_url: string;
  description: string;
  created_at: string;
  created_by: string;
  views: number;
};

export default function ArticlesPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<ArticleRepsonse>
  >({
    url: getUrl("/articles", {
      q: searchValue,
      page,
      sort,
    }),
    method: "GET",
    token,
  });

  async function handleDeleteArticle(article_id: string) {
    try {
      await fetcher({
        url: `/articles/${article_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      if (data?.data.articles.length === 1 && Number(page) > 1) {
        setPage(`${Number(page) - 1}`);
      }

      toast.success("Artikel berhasil dihapus!");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Artikel">
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
    <Layout title="Artikel" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Artikel 📰"
          text="Lihat dan kelola semua artikel di sini"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Artikel..."
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
              aria-label="sort"
              size="md"
              variant="flat"
              startContent={
                <Funnel weight="duotone" size={18} className="text-gray" />
              }
              placeholder="Sort"
              selectedKeys={[sort]}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="title.asc">A-Z</SelectItem>
              <SelectItem key="title.desc">Z-A</SelectItem>
              <SelectItem key="created_at.desc">Terbaru</SelectItem>
              <SelectItem key="created_at.asc">Terlama</SelectItem>
            </Select>

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/articles/create")}
              className="font-semibold"
            >
              Tambah Artikel
            </Button>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.articles.length || 8 }).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[300px] w-full rounded-xl"
                  />
                ),
              )
            ) : data?.data.articles.length ? (
              data?.data.articles.map((article) => (
                <div
                  key={article.article_id}
                  onClick={() =>
                    window.open(
                      process.env.NEXT_PUBLIC_MODE == "prod"
                        ? `https://ruangobat.id/articles/${article.slug}`
                        : `https://devmain.ruangobat.id/articles/${article.slug}`,
                      "_blank",
                    )
                  }
                  className="group relative isolate grid overflow-hidden rounded-xl hover:cursor-pointer"
                >
                  <div className="absolute right-4 top-4 z-10 hidden items-center gap-2 group-hover:inline-flex">
                    <Button
                      isIconOnly
                      size="sm"
                      color="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/articles/${article.article_id}/edit`);
                      }}
                    >
                      <PencilLine weight="duotone" size={18} />
                    </Button>

                    <ModalConfirm
                      trigger={
                        <Button isIconOnly size="sm" color="danger">
                          <Trash weight="duotone" size={18} />
                        </Button>
                      }
                      header={
                        <h1 className="font-bold text-black">Hapus Artikel</h1>
                      }
                      body={
                        <div className="grid gap-3 text-sm font-medium">
                          <p className="leading-[170%] text-gray">
                            Apakah anda ingin menghapus artikel ini?
                          </p>
                        </div>
                      }
                      footer={(onClose: any) => (
                        <>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                            className="font-bold"
                          >
                            Tutup
                          </Button>

                          <Button
                            color="danger"
                            className="font-bold"
                            onClick={() =>
                              handleDeleteArticle(article.article_id)
                            }
                          >
                            Ya, Hapus
                          </Button>
                        </>
                      )}
                    />
                  </div>

                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={article.img_url}
                      alt={article.title}
                      width={500}
                      height={500}
                      className="size-full object-cover object-center transition-all group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="grid gap-2 rounded-b-xl border-x-2 border-b-2 border-purple/10 p-4 group-hover:border-purple group-hover:bg-purple/10">
                    <p className="line-clamp-1 text-xs font-semibold text-purple">
                      {article.topic.name}
                    </p>

                    <div>
                      <h1 className="mb-0.5 line-clamp-2 text-lg font-extrabold text-black">
                        {article.title}
                      </h1>

                      <p
                        dangerouslySetInnerHTML={{
                          __html: article.description,
                        }}
                        className="line-clamp-2 text-sm font-medium leading-[170%] text-gray"
                      />
                    </div>

                    <p className="mt-4 text-xs font-medium text-gray">
                      {formatDateWithoutTime(article.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20">
                <EmptyData text="Artikel Belum Tersedia!" />
              </div>
            )}
          </div>
        </div>

        {!isLoading && data?.data.articles.length ? (
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
