import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalRevoke from "@/components/modal/ModalRevoke";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { Accesses, AccessesResponse } from "@/types/accesses/accesses.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDateSimple } from "@/utils/formatDate";
import {
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  CheckCircle,
  Eye,
  Funnel,
  Hourglass,
  PencilLine,
  Plus,
  Prohibit,
  SlidersHorizontal,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export function getStatus(status: Accesses["status"]) {
  if (status === "revoked") {
    return {
      color: "danger",
      icon: <Prohibit weight="duotone" size={18} />,
      label: "Ditangguhkan",
    };
  }

  if (status === "expired") {
    return {
      color: "default",
      icon: <XCircle weight="duotone" size={18} />,
      label: "Kadaluarsa",
    };
  }

  if (status === "scheduled") {
    return {
      color: "primary",
      icon: <Hourglass weight="duotone" size={18} />,
      label: "Diperpanjang",
    };
  }

  if (status === "active") {
    return {
      color: "success",
      icon: <CheckCircle weight="duotone" size={18} />,
      label: "Aktif",
    };
  }
}

export default function AccessesPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const [selectedAccess, setSelectedAccess] = useState<Accesses | null>(null);
  const [openRevoke, setOpenRevoke] = useState(false);
  const [loadingRevoke, setLoadingRevoke] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<AccessesResponse>
  >({
    url: getUrl("/accesses/videocourse", {
      q: searchValue,
      filter,
      sort,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsAccesses = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Pengguna", uid: "fullname" },
    { name: "Durasi", uid: "duration" },
    { name: "Dimulai", uid: "started_at" },
    { name: "Berakhir", uid: "expired_at" },
    { name: "Status", uid: "status" },
    { name: "Aksi", uid: "action" },
  ];

  if (filter === "revoked") {
    const index = columnsAccesses.findIndex((col) => col.uid === "action");

    columnsAccesses.splice(
      index,
      0,
      { name: "Alasan", uid: "update_reason" },
      { name: "Ditangguhkan pada", uid: "revoked_at" },
    );
  }

  function renderCellAccess(access: Accesses, columnKey: React.Key) {
    const cellValue = access[columnKey as keyof Accesses];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {access.user_id}
          </div>
        );
      case "fullname":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {access.fullname}
          </div>
        );
      case "duration":
        return (
          <div className="w-full max-w-[300px] font-medium text-black">
            {access.duration} bulan
          </div>
        );
      case "started_at":
        return (
          <div className="font-medium text-black">
            {formatDateSimple(access.started_at)}
          </div>
        );
      case "expired_at":
        return (
          <div className="font-medium text-black">
            {formatDateSimple(access.expired_at, true)}
          </div>
        );
      case "status":
        return (
          <div className="w-max">
            <Chip
              variant="flat"
              size="sm"
              color={
                getStatus(access.status)?.color as
                  | "danger"
                  | "default"
                  | "primary"
                  | "success"
                  | "secondary"
                  | "warning"
              }
              startContent={getStatus(access.status)?.icon as React.ReactNode}
              classNames={{
                base: "px-2 gap-1",
                content: "font-bold capitalize",
              }}
            >
              {getStatus(access.status)?.label}
            </Chip>
          </div>
        );
      case "update_reason":
        return (
          <div className="font-medium text-black">{access.update_reason}</div>
        );
      case "revoked_at":
        return (
          <div className="font-medium text-black">
            {formatDateSimple(access.revoked_at as string, true)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() =>
                router.push(`/videocourse/accesses/${access.access_id}/detail`)
              }
            >
              <CustomTooltip content="Detail Akses">
                <Eye weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            {["active", "scheduled"].includes(access.status) ? (
              <>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  color="secondary"
                  onClick={() =>
                    router.push(
                      `/videocourse/accesses/${access.access_id}/change-plan`,
                    )
                  }
                >
                  <CustomTooltip content="Ubah Paket">
                    <PencilLine weight="duotone" size={18} />
                  </CustomTooltip>
                </Button>

                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  color="danger"
                  onClick={() => {
                    setSelectedAccess(access);
                    setOpenRevoke(true);
                  }}
                >
                  <CustomTooltip content="Tangguhkan Akses">
                    <Prohibit weight="duotone" size={18} />
                  </CustomTooltip>
                </Button>
              </>
            ) : null}
          </div>
        );

      default:
        return cellValue;
    }
  }

  if (error) {
    return (
      <Layout title="Access List Ruang Sarjana">
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

  console.log(selectedAccess);

  return (
    <Layout title="Access List Ruang Sarjana" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Access List - Video Pembelajaran 🔒"
          text="Berisi pengguna yang bisa mengakses Ruang Sarjana."
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex justify-end gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Select
              aria-label="filter"
              size="md"
              placeholder="Filter"
              variant="flat"
              startContent={
                <SlidersHorizontal
                  weight="bold"
                  size={18}
                  className="text-gray"
                />
              }
              selectedKeys={[filter]}
              onChange={(e) => {
                if (["revoked", "expired"].includes(e.target.value)) {
                  setSort("");
                }
                setFilter(e.target.value);
              }}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="active">Aktif</SelectItem>
              <SelectItem key="scheduled">Diperpanjang</SelectItem>
              <SelectItem key="expired">Kadaluarsa</SelectItem>
              <SelectItem key="revoked">Ditangguhkan</SelectItem>
            </Select>

            {!["revoked", "expired"].includes(filter) ? (
              <Select
                aria-label="sort"
                size="md"
                placeholder="Sort"
                variant="flat"
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
                <SelectItem key="duration.asc">Durasi Terpendek</SelectItem>
                <SelectItem key="duration.desc">Durasi Terlama</SelectItem>
                <SelectItem key="created_at.desc">Dibuat Terbaru</SelectItem>
                <SelectItem key="created_at.asc">Dibuat Terlama</SelectItem>
              </Select>
            ) : null}

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={16} />}
              onClick={() => router.push("/videocourse/accesses/create")}
              className="w-max justify-self-end font-semibold"
            >
              Tambah Akses
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              isHeaderSticky
              aria-label="subscriptions table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsAccesses}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.accesses || []}
                emptyContent={<EmptyData text="Akses tidak ditemukan!" />}
                isLoading={isLoading}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
              >
                {(access: Accesses) => (
                  <TableRow key={access.access_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellAccess(access, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.accesses.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => setPage(`${e}`)}
            className="justify-self-center"
            classNames={{
              cursor: "bg-purple text-white",
            }}
          />
        ) : null}

        {openRevoke && selectedAccess ? (
          <ModalRevoke
            access={selectedAccess}
            isOpen={openRevoke}
            onOpenChange={setOpenRevoke}
            loading={loadingRevoke}
            onClose={() => {
              setOpenRevoke(false);
              setSelectedAccess(null);
            }}
            onConfirm={async (reason) => {
              setLoadingRevoke(true);
              try {
                await fetcher({
                  url: "/accesses/revoke",
                  method: "POST",
                  token,
                  data: {
                    access_id: selectedAccess.access_id,
                    reason,
                  },
                });

                setSelectedAccess(null);
                setOpenRevoke(false);
                mutate();
                toast.success(
                  `Akses ${selectedAccess.fullname} berhasil ditangguhkan!`,
                );
              } catch (error) {
                console.log(error);
                toast.error(
                  `Gagal menangguhkan akses ${selectedAccess.fullname}}`,
                );
              } finally {
                setLoadingRevoke(false);
              }
            }}
          />
        ) : null}
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
