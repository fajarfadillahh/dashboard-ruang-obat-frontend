import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { ProviderAI } from "@/types/ai/provider.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  CheckCircle,
  CurrencyCircleDollar,
  DotsThree,
  PencilLine,
  Plus,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function AIProvidersPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, error, mutate } = useSWR<
    SuccessResponse<ProviderAI[]>
  >({
    url: "/ai/providers",
    method: "GET",
    token,
  });

  const columnsProvider = [
    { name: "Nama Layanan", uid: "name" },
    { name: "Tipe Layanan", uid: "type" },
    { name: "Status", uid: "is_active" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellProviders(provider: ProviderAI, columnKey: React.Key) {
    const cellValue = provider[columnKey as keyof ProviderAI];

    switch (columnKey) {
      case "name":
        return <div className="font-medium text-black">{provider.name}</div>;
      case "type":
        return (
          <div className="font-medium text-black">
            {provider.type === "free" ? (
              "Gratis"
            ) : (
              <p className="inline-flex items-center">
                Berbayar
                <CurrencyCircleDollar
                  weight="duotone"
                  size={20}
                  className="ml-1 text-success"
                />
              </p>
            )}
          </div>
        );
      case "is_active":
        return (
          <Chip
            variant="flat"
            color={provider.is_active ? "success" : "danger"}
            size="sm"
            startContent={
              provider.is_active ? (
                <CheckCircle weight="duotone" size={16} />
              ) : (
                <XCircle weight="duotone" size={16} />
              )
            }
            classNames={{
              base: "px-2 gap-1",
              content: "font-bold",
            }}
          >
            {provider.is_active ? "Aktif" : "Tidak Aktif"}
          </Chip>
        );
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(provider.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex items-center gap-2">
            {!provider.is_active ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="secondary"
                  >
                    <CustomTooltip content="Lainnya">
                      <DotsThree weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="actions"
                  itemClasses={{
                    title: "font-semibold text-black",
                  }}
                >
                  <DropdownSection aria-label="action zone" title="Anda Yakin?">
                    <DropdownItem
                      onClick={() =>
                        alert(`Layanan berhasil diubah ke ${provider.name}`)
                      }
                    >
                      {provider.is_active
                        ? "Nonaktifkan layanan ini"
                        : "Gunakan layanan ini!"}
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            ) : null}

            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() =>
                router.push(`/ai/providers/${provider.provider_id}`)
              }
            >
              <CustomTooltip content="Edit Layanan">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Layanan">
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Layanan</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus layanan{" "}
                    <strong className="font-extrabold text-purple">
                      {provider.name}
                    </strong>
                    ?
                  </p>
                </div>
              }
              footer={(onClose: any) => (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-semibold"
                  >
                    Tutup
                  </Button>

                  <Button
                    color="danger"
                    className="font-semibold"
                    onClick={() => handleDeleteProvider(provider.provider_id)}
                  >
                    Ya, Hapus Layanan
                  </Button>
                </>
              )}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  async function handleDeleteProvider(provider_id: string) {
    try {
      await fetcher({
        url: `/ai/providers/${provider_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Layanan berhasil dihapus");
    } catch (errora: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Layanan AI">
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

  if (isLoading) return <LoadingScreen />;

  const filterProvider = data?.data.filter((provider) =>
    [provider.provider_id, provider.name].some((value) =>
      value.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <Layout title="Daftar Layanan AI" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack href="/ai" />

        <TitleText
          title="Daftar Layanan AI 📋"
          text="Semua layanan AI yang tersedia akan muncul di sini"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Layanan..."
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={16} />}
              onClick={() => router.push("/ai/providers/create")}
              className="w-max font-semibold"
            >
              Tambah Layanan
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isHeaderSticky
              aria-label="providers table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsProvider}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={filterProvider}
                emptyContent={<EmptyData text="Layanan tidak ditemukan!" />}
              >
                {(provider: ProviderAI) => (
                  <TableRow key={provider.provider_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellProviders(provider, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
