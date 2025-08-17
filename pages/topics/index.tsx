import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export interface TopicsResponse {
  topics: Topic[];
  page: number;
  total_topics: number;
  total_pages: number;
}

export interface Topic {
  topic_id: string;
  name: string;
  first_letter: string;
  created_at: string;
  can_delete: boolean;
}

export default function TopicsArticlePage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading } = useSWR<SuccessResponse<TopicsResponse>>({
    url: getUrl("/topics", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsTopic = [
    { name: "Nama Topik", uid: "name" },
    { name: "Huruf Pertama", uid: "first_letter" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(topic: Topic, columnKey: React.Key) {
    const cellValue = topic[columnKey as keyof Topic];

    switch (columnKey) {
      case "name":
        return <div className="w-max font-medium text-black">{topic.name}</div>;
      case "first_letter":
        return (
          <div className="w-max font-medium text-black">
            {topic.first_letter}
          </div>
        );
      case "created_at":
        return (
          <div className="w-max font-medium text-black">
            {formatDate(topic.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <Button isIconOnly variant="light" size="sm" color="secondary">
              <CustomTooltip content="Edit Topik">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            {topic.can_delete ? (
              <Button isIconOnly variant="light" size="sm" color="danger">
                <CustomTooltip content="Hapus Topik">
                  <Trash weight="duotone" size={18} />
                </CustomTooltip>
              </Button>
            ) : null}
          </div>
        );

      default:
        return cellValue;
    }
  }

  if (error) {
    return (
      <Layout title="Topik Artikel">
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
    <Layout title="Topik Artikel" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Topik Artikel 📝"
          text="Tabel topik artikel yang sudah di input"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Topik Artikel atau ID Topik..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              className="font-semibold"
            >
              Tambah Topik
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              aria-label="topics table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsTopic}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                isLoading={isLoading}
                items={data?.data.topics || []}
                emptyContent={<EmptyData text="Topik tidak ditemukan!" />}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
              >
                {(topic: Topic) => (
                  <TableRow key={topic.topic_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(topic, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.topics.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              divRef.current?.scrollIntoView({ behavior: "smooth" });
              setPage(`${e}`);
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
