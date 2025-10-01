import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { EventTestApotekerclass } from "@/types/event.type";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { formatDateWithoutTime } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import { getStatusEvent } from "@/utils/getStatus";
import {
  Button,
  Chip,
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

type EventTestResponse = {
  events: EventTestApotekerclass[];
  page: number;
  total_events: number;
  total_pages: number;
};

export default function EventTestApotekerclassPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error, mutate } = useSWR<
    SuccessResponse<EventTestResponse>
  >({
    url: getUrl("/events", {
      q: searchValue,
      sort,
      page,
    }),
    method: "GET",
    token,
  });

  async function handleDeleteEvent(event_id: string) {
    try {
      await fetcher({
        url: `/events/${event_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      if (data?.data.events.length === 1 && Number(page) > 1) {
        setPage(`${Number(page) - 1}`);
      }

      toast.success("Event ujian berhasil dihapus!");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Event Ujian Masuk Apoteker">
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
    <Layout title="Event Ujian Masuk Apoteker" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Event Ujian Masuk Apoteker 📝"
          text="Event ujian yang tersedia pada kelas masuk apoteker."
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Jadwal..."
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
              onClick={() => router.push("/apotekerclass/events/create")}
              className="font-semibold"
            >
              Tambah Event Ujian
            </Button>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.events.length || 8 }).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[300px] w-full rounded-xl"
                  />
                ),
              )
            ) : data?.data.events.length ? (
              data.data.events.map((event) => {
                const rawDate = event.registration_date;
                const [startStr, endStr] = rawDate.split(" - ");

                const startDate = new Date(startStr);
                const endDate = new Date(endStr);
                const status = getStatusEvent(startDate, endDate);

                return (
                  <div
                    key={event.event_id}
                    className="group relative isolate grid overflow-hidden rounded-xl hover:cursor-pointer"
                  >
                    <div className="absolute right-4 top-4 z-10 hidden items-center gap-2 group-hover:inline-flex">
                      <Button
                        isIconOnly
                        size="sm"
                        color="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/apotekerclass/events/${event.event_id}/edit`,
                          );
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
                          <h1 className="font-bold text-black">
                            Hapus Event Ujian
                          </h1>
                        }
                        body={
                          <div className="grid gap-3 text-sm font-medium">
                            <p className="leading-[170%] text-gray">
                              Apakah anda ingin menghapus event ujian ini?
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
                              onClick={() => handleDeleteEvent(event.event_id)}
                            >
                              Ya, Hapus
                            </Button>
                          </>
                        )}
                      />
                    </div>

                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={event.img_url}
                        alt={event.title}
                        width={500}
                        height={500}
                        className="size-full object-cover object-center transition-all group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="grid gap-2 rounded-b-xl border-x-2 border-b-2 border-purple/10 p-4 group-hover:border-purple group-hover:bg-purple/10">
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          status === "Dibuka"
                            ? "success"
                            : status === "Ditutup"
                              ? "danger"
                              : "default"
                        }
                        classNames={{
                          base: "px-2 gap-1",
                          content: "font-bold capitalize",
                        }}
                      >
                        {status}
                      </Chip>

                      <h1 className="mb-4 line-clamp-2 text-lg font-extrabold text-black">
                        {event.title}
                      </h1>

                      <div className="grid gap-3">
                        {[
                          [
                            "Tanggal Pendaftaran",
                            `${formatDateWithoutTime(startStr)} - ${formatDateWithoutTime(endStr)}`,
                          ],
                          ["Universitas", event.university_name],
                        ].map(([key, value], index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-gray">
                              {key}:
                            </span>
                            <h2 className="text-sm font-bold text-black">
                              {value}
                            </h2>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20">
                <EmptyData text="Event Ujian Belum Tersedia!" />
              </div>
            )}
          </div>
        </div>

        {!isLoading && data?.data.events.length ? (
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
