import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { ContextAI, ContextAIResponse } from "@/types/ai/context.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Pagination,
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
  PencilLine,
  Plus,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useRef } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function AIContextsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error, mutate } = useSWR<
    SuccessResponse<ContextAIResponse>
  >({
    url: getUrl("/ai/contexts", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsContext = [
    { name: "Judul Konteks", uid: "title" },
    { name: "Konten", uid: "content" },
    { name: "Tipe Konteks", uid: "type" },
    { name: "Status", uid: "is_active" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellContexts(context: ContextAI, columnKey: React.Key) {
    const cellValue = context[columnKey as keyof ContextAI];

    switch (columnKey) {
      case "title":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {context.title}
          </div>
        );
      case "content":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {context.content}
          </div>
        );
      case "type":
        return (
          <div className="font-medium text-black">
            {context.type === "umum"
              ? "Seputar Ruang Obat"
              : "Biasa Ditanyakan"}
          </div>
        );
      case "is_active":
        return (
          <Chip
            variant="flat"
            color={context.is_active ? "success" : "danger"}
            size="sm"
            startContent={
              context.is_active ? (
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
            {context.is_active ? "Aktif" : "Tidak Aktif"}
          </Chip>
        );
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(context.created_at)}
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
                router.push(`/ai/contexts/${context.context_id}/edit`)
              }
            >
              <CustomTooltip content="Edit Konteks">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Konteks">
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Konteks</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus konteks{" "}
                    <strong className="font-extrabold text-purple">
                      {context.title}
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
                    onClick={() => handleDeleteContext(context.context_id)}
                  >
                    Ya, Hapus Konteks
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

  async function handleDeleteContext(context_id: string) {
    try {
      await fetcher({
        url: `/ai/contexts/${context_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Konteks berhasil dihapus");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Konteks AI">
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
    <Layout title="Daftar Konteks AI">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="Daftar Konteks AI 📋"
          text="Semua konteks untuk melatih AI akan muncul di sini"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Konteks..."
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

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={16} />}
              onClick={() => router.push("/ai/contexts/create")}
              className="w-max font-semibold"
            >
              Tambah Konteks
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              isHeaderSticky
              aria-label="contexts table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsContext}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.contexts || []}
                emptyContent={<EmptyData text="Konteks tidak ditemukan!" />}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
                isLoading={isLoading}
              >
                {(context: ContextAI) => (
                  <TableRow key={context.context_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellContexts(context, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.contexts.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              setPage(`${e}`);
              divRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
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
  const { query } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
    },
  };
});
