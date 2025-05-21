import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { LogsAI, LogsAIResponse } from "@/types/ai/logs.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";

export default function AILogsPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, isLoading, error } = useSWR<SuccessResponse<LogsAIResponse>>({
    url: getUrl("/ai/chat/logs", query),
    method: "GET",
    token,
  });
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isSelectedDetail, setIsSelectedDetail] = useState<LogsAI | null>(null);

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/ai/logs");
    }
  }, [searchValue]);

  const columnsLogs = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Pengguna", uid: "fullname" },
    { name: "Pertanyaan", uid: "question" },
    { name: "Ditanyakan Pada", uid: "created_at" },
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

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="History AI">
      <Container className="gap-8">
        <ButtonBack href="/ai" />

        <TitleText
          title="History AI 📋"
          text="Pantau semua history chat ai pengguna di sini"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={query.q as string}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
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
                items={data?.data.logs}
                emptyContent={<EmptyData text="History tidak ditemukan!" />}
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

        {data?.data.logs.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              router.push({
                query: {
                  ...router.query,
                  page: e,
                },
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
