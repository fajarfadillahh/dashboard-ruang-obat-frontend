import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { getUrl } from "@/lib/getUrl";
import { LogsAI, LogsAIResponse } from "@/types/ai/logs.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye } from "@phosphor-icons/react";
import "katex/dist/katex.min.css";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function AILogsPage({
  token,
  rates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useSWR<SuccessResponse<LogsAIResponse>>({
    url: getUrl("/ai/chat/logs", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isSelectedDetail, setIsSelectedDetail] = useState<LogsAI | null>(null);

  const columnsLogs = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Pengguna", uid: "fullname" },
    { name: "Pertanyaan", uid: "question" },
    { name: "Ditanyakan Pada", uid: "created_at" },
    { name: "Jumlah Token", uid: "total_tokens" },
    { name: "Biaya", uid: "total_cost" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellLogs(logs: LogsAI, columnKey: React.Key) {
    const cellValue = logs[columnKey as keyof LogsAI];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {logs.user_id}
          </div>
        );
      case "fullname":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {logs.fullname}
          </div>
        );
      case "question":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {logs.question}
          </div>
        );
      case "total_tokens":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {logs.total_tokens
              ? logs.total_tokens.toLocaleString("id-ID")
              : "-"}
          </div>
        );
      case "total_cost":
        return (
          <div className="line-clamp-2 w-full max-w-[300px] font-medium text-black">
            {logs.total_cost
              ? rates
                ? formatRupiah(Math.round((logs.total_cost as number) * rates))
                : `$${logs.total_cost}`
              : "-"}
          </div>
        );
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(logs.created_at)}
          </div>
        );
      case "action":
        return (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            color="secondary"
            onClick={() => handleOpenDetail(logs)}
          >
            <CustomTooltip content="Detail History">
              <Eye weight="duotone" size={18} />
            </CustomTooltip>
          </Button>
        );

      default:
        return cellValue;
    }
  }

  function handleOpenDetail(prepClass: LogsAI) {
    setIsSelectedDetail(prepClass);
    setIsOpenDetail(true);
  }

  if (error) {
    return (
      <Layout title="History AI">
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
    <Layout title="History AI">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="History AI 📋"
          text="Pantau semua history chat ai pengguna di sini"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              isHeaderSticky
              aria-label="logs table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsLogs}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.logs || []}
                emptyContent={<EmptyData text="History tidak ditemukan!" />}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
                isLoading={isLoading}
              >
                {(logs: LogsAI) => (
                  <TableRow key={logs.chat_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellLogs(logs, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Modal
            isOpen={isOpenDetail}
            onOpenChange={(open) => setIsOpenDetail(open)}
            size="2xl"
            scrollBehavior="inside"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="font-extrabold capitalize text-black">
                    Detail History
                  </ModalHeader>

                  <ModalBody>
                    <div className="grid gap-4">
                      {[
                        ["ID Chat:", isSelectedDetail?.chat_id],
                        ["Nama Pengguna:", isSelectedDetail?.fullname],
                        [
                          "Ditanyakan Pada:",
                          formatDate(isSelectedDetail?.created_at as string),
                        ],
                        ["Pertanyaan:", isSelectedDetail?.question],
                        ["Jawaban:", isSelectedDetail?.answer],
                      ].map(([placeholder, value], index) => (
                        <div key={index} className="grid gap-1">
                          <span className="text-sm font-bold text-purple">
                            {placeholder}
                          </span>

                          <p className="font-medium leading-[170%] text-black">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath, remarkGfm]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                ol: ({ children, ...props }) => (
                                  <ol className="list-decimal pl-4" {...props}>
                                    {children}
                                  </ol>
                                ),
                                ul: ({ children, ...props }) => (
                                  <ul className="list-disc pl-4" {...props}>
                                    {children}
                                  </ul>
                                ),
                                table: ({ children, ...props }) => (
                                  <div className="overflow-x-scroll scrollbar-hide">
                                    <table
                                      className="my-4 table-auto border border-black [&_td]:border [&_td]:p-4 [&_th]:whitespace-nowrap [&_th]:border [&_th]:bg-gray/20 [&_th]:p-4 [&_tr:last-child]:border-b-0 [&_tr]:border-b"
                                      {...props}
                                    >
                                      {children}
                                    </table>
                                  </div>
                                ),
                              }}
                            >
                              {value}
                            </ReactMarkdown>
                          </p>
                        </div>
                      ))}
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="light"
                      className="font-semibold"
                      onClick={onClose}
                    >
                      Tutup
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        {!isLoading && data?.data.logs.length ? (
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

export const getServerSideProps: GetServerSideProps<{
  token: string;
  rates: number;
}> = async ({ req }) => {
  let rates: number;

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/usd");
    const data: { rates: { IDR: number } } = await response.json();

    rates = data.rates.IDR;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    rates = 0;
  }

  return {
    props: {
      token: req.headers["access_token"] as string,
      rates,
    },
  };
};
