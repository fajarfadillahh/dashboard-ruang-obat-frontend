import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import {
  Funnel,
  PencilLine,
  Plus,
  SlidersHorizontal,
  Trash,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type AdsResponse = {
  ads: Ad[];
  page: number;
  total_ads: number;
  total_pages: number;
};

type Ad = {
  ad_id: string;
  title: string;
  type: "homepage" | "detailpage";
  img_url: string;
  link: string;
  is_active: boolean;
  created_at: string;
};

export default function AdsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<AdsResponse>
  >({
    url: getUrl("/ads", {
      page,
      filter,
      sort,
    }),
    method: "GET",
    token,
  });

  async function handleDeleteAd(ad_id: string) {
    try {
      await fetcher({
        url: `/ads/${ad_id}`,
        method: "DELETE",
        token,
      });

      toast.success("Ads berhasil dihapus!");
      mutate();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Ads Artikel">
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
    <Layout title="Ads Artikel" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Ads Artikel 📝"
          text="Semua ads artikel akan muncul di halaman ini"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
            <Select
              aria-label="filter"
              size="md"
              variant="flat"
              startContent={
                <SlidersHorizontal
                  weight="bold"
                  size={18}
                  className="text-gray"
                />
              }
              placeholder="Filter"
              selectedKeys={[filter]}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="homepage">Halaman Utama</SelectItem>
              <SelectItem key="detailpage">Halaman Detail</SelectItem>
              <SelectItem key="active">Aktif</SelectItem>
              <SelectItem key="inactive">Nonaktif</SelectItem>
            </Select>

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
              <SelectItem key="created_at.desc">Terbaru</SelectItem>
              <SelectItem key="created_at.asc">Terlama</SelectItem>
            </Select>

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => router.push("/ads/create")}
              className="font-semibold"
            >
              Tambah Ads
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.ads.length || 9 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.ads.length ? (
              data?.data.ads.map((ad) => (
                <div
                  key={ad.ad_id}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 hover:cursor-pointer ${
                    ad.is_active
                      ? "border-purple/10 hover:border-purple hover:bg-purple/10"
                      : "border-danger bg-danger/5 hover:bg-danger/10"
                  } `}
                  onClick={() => window.open(`${ad.img_url}`, "_blank")}
                >
                  <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                    <Image
                      src={ad.img_url as string}
                      alt="ads image"
                      width={500}
                      height={500}
                      className={`size-full object-cover object-center ${ad.is_active ? "grayscale-0" : "grayscale"}`}
                      priority
                    />
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="grid gap-2">
                      <Chip
                        variant="flat"
                        size="sm"
                        classNames={{
                          base: "px-2 gap-1",
                          content: "font-bold capitalize",
                        }}
                      >
                        {ad.type === "homepage" ? "Homepage" : "Detailpage"}
                      </Chip>

                      <p className="line-clamp-2 text-sm font-medium text-gray">
                        {ad.title}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="secondary"
                        onClick={() =>
                          router.push({
                            pathname: `/ads/${ad.ad_id}/edit`,
                            query: {
                              title: ad.title,
                              type: ad.type,
                              img_url: ad.img_url,
                              link: ad.link,
                              is_active: ad.is_active,
                            },
                          })
                        }
                      >
                        <CustomTooltip content="Edit Ads">
                          <PencilLine weight="duotone" size={18} />
                        </CustomTooltip>
                      </Button>

                      <ModalConfirm
                        trigger={
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            size="sm"
                          >
                            <CustomTooltip content="Hapus Ads">
                              <Trash
                                weight="duotone"
                                size={18}
                                className="text-danger"
                              />
                            </CustomTooltip>
                          </Button>
                        }
                        header={
                          <h1 className="font-bold text-black">Hapus Ads</h1>
                        }
                        body={
                          <p className="leading-[170%] text-gray">
                            Apakah anda ingin menghapus ads ini?
                          </p>
                        }
                        footer={(onClose: any) => (
                          <>
                            <Button
                              color="danger"
                              variant="light"
                              onClick={onClose}
                              className="font-semibold"
                            >
                              Tutup
                            </Button>

                            <Button
                              color="danger"
                              onClick={() => handleDeleteAd(ad.ad_id)}
                              className="font-semibold"
                            >
                              Ya, Hapus
                            </Button>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20">
                <EmptyData text="Ads Belum Tersedia!" />
              </div>
            )}
          </div>
        </div>

        {!isLoading && data?.data.ads.length ? (
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
