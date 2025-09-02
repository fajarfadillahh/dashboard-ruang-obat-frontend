import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { products } from "@/lib/products";
import {
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  CalendarDots,
  Funnel,
  HourglassLow,
  PencilLine,
  Plus,
  SlidersHorizontal,
  Trash,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import { useDebounce } from "use-debounce";

export default function LiveTeachingPage() {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const product = products.find((item) => item.code === router.query.type);

  return (
    <Layout
      title={`Live Teaching ${product?.label}`}
      className="scrollbar-hide"
    >
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title={`Live Teaching 🎥 - ${product?.label}`}
          text="Lihat dan kelola semua live teaching di sini"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Live Teaching..."
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
                <SlidersHorizontal
                  weight="duotone"
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
              <SelectItem key="upcoming">Belum Dimulai</SelectItem>
              <SelectItem key="ongoing">Berlangsung</SelectItem>
              <SelectItem key="ended">Berakhir</SelectItem>
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
              onClick={() => router.push(`/live/${router.query.type}/create`)}
              className="font-semibold"
            >
              Tambah Live
            </Button>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="group relative isolate grid overflow-hidden rounded-xl hover:cursor-pointer"
                onClick={() =>
                  window.open(
                    process.env.NEXT_PUBLIC_MODE == "prod"
                      ? "https://ruangobat.id/live/slug-content"
                      : "https://devmain.ruangobat.id/live/slug-content",
                    "_blank",
                  )
                }
              >
                <div className="absolute right-4 top-4 z-10 hidden items-center gap-2 group-hover:inline-flex">
                  <Button
                    isIconOnly
                    size="sm"
                    color="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/live/${product?.code}/${crypto.randomUUID()}/edit`,
                      );
                    }}
                  >
                    <CustomTooltip content="Edit Live">
                      <PencilLine weight="duotone" size={18} />
                    </CustomTooltip>
                  </Button>

                  <ModalConfirm
                    trigger={
                      <Button isIconOnly size="sm" color="danger">
                        <CustomTooltip content="Hapus Live">
                          <Trash weight="duotone" size={18} />
                        </CustomTooltip>
                      </Button>
                    }
                    header={
                      <h1 className="font-bold text-black">Hapus Live</h1>
                    }
                    body={
                      <div className="grid gap-3 text-sm font-medium">
                        <p className="leading-[170%] text-gray">
                          Apakah anda ingin menghapus live teaching ini?
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
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("fitur dalam pengembangan!");
                          }}
                        >
                          Ya, Hapus
                        </Button>
                      </>
                    )}
                  />
                </div>

                <div className="aspect-video overflow-hidden">
                  <Image
                    src="https://ruangobat.is3.cloudhost.id/statics/images/ruangobat-logo/default-thumbnail.png"
                    alt="default img"
                    width={500}
                    height={500}
                    className="size-full object-cover object-center transition-all group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="grid gap-2 rounded-b-xl border-x-2 border-b-2 border-purple/10 p-4 group-hover:border-purple group-hover:bg-purple/10">
                  <h1 className="mb-1 line-clamp-2 text-lg font-extrabold text-black">
                    Meet The Expert Researcher & Educator: Dua Sayap Karier
                    Farmasi di Dunia Akademik
                  </h1>

                  <div className="flex items-start gap-2">
                    <CalendarDots
                      weight="duotone"
                      size={24}
                      className="text-purple"
                    />

                    <div>
                      <h5 className="mb-0.5 text-sm font-bold text-black">
                        Selasa, 19 Agustus 2025
                      </h5>
                      <p className="text-xs font-medium leading-[170%] text-gray">
                        19:00 - 21:00
                      </p>
                    </div>
                  </div>

                  <Chip
                    variant="flat"
                    size="sm"
                    color="warning"
                    startContent={<HourglassLow weight="duotone" size={18} />}
                    classNames={{
                      base: "px-2 gap-1 mt-4",
                      content: "font-bold capitalize",
                    }}
                  >
                    Berlangsung
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination
          isCompact
          showControls
          // page={data.data.page as number}
          // total={data.data.total_pages as number}
          total={3}
          onChange={(e) => {
            setPage(`${e}`);
            divRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="justify-self-center"
          classNames={{
            cursor: "bg-purple text-white",
          }}
        />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
