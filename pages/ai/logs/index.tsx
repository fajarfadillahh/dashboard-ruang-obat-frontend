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
import Image from "next/image";
import { useQueryState } from "nuqs";
import React, { useRef, useState } from "react";
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

  const rowsModal = [
    { name: "ID Chat:", value: isSelectedDetail?.chat_id, type: "text" },
    { name: "Nama Pengguna:", value: isSelectedDetail?.fullname, type: "text" },
    {
      name: "Ditanyakan Pada:",
      value: formatDate(isSelectedDetail?.created_at as string),
      type: "text",
    },
    {
      name: "Gambar:",
      value: isSelectedDetail?.images as LogsAI["images"],
      type: "images",
    },
    { name: "Pertanyaan:", value: isSelectedDetail?.question, type: "text" },
    { name: "Jawaban:", value: isSelectedDetail?.answer, type: "markdown" },
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage("1");
              }}
              onClear={() => {
                setSearch("");
                setPage("");
              }}
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
            size="3xl"
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
                      {rowsModal
                        .filter((row) => {
                          if (
                            row.type === "images" &&
                            (!row.value ||
                              !Array.isArray(row.value) ||
                              !row.value.length)
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((row) => {
                          return (
                            <div key={row.type} className="grid gap-1">
                              <span className="text-sm font-bold text-purple">
                                {row.name}
                              </span>

                              {row.type === "images" &&
                              row.value &&
                              Array.isArray(row.value) &&
                              row.value.length ? (
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                  {(row.value as LogsAI["images"])?.map(
                                    (image, index) => (
                                      <div
                                        key={image.image_id}
                                        className="relative aspect-square w-full max-w-[150px]"
                                      >
                                        <Image
                                          src={image.img_url}
                                          alt={`Gambar ${index + 1}`}
                                          fill
                                          className="cursor-pointer rounded-lg object-cover"
                                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 150px"
                                          onClick={() => {
                                            window.open(
                                              image.img_url,
                                              "_blank",
                                            );
                                          }}
                                        />
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : null}

                              {row.type === "markdown" ||
                              row.type === "text" ? (
                                <p className="font-medium leading-[170%] text-black">
                                  {row.type === "text" ? (
                                    (row.value as string)
                                  ) : (
                                    <ReactMarkdown
                                      remarkPlugins={[remarkMath, remarkGfm]}
                                      rehypePlugins={[rehypeKatex]}
                                      components={{
                                        ol: ({ children, ...props }) => (
                                          <ol
                                            className="my-4 list-decimal space-y-2 pl-6"
                                            {...props}
                                          >
                                            {children}
                                          </ol>
                                        ),
                                        ul: ({ children, ...props }) => (
                                          <ul
                                            className="my-4 list-disc space-y-2 pl-6"
                                            {...props}
                                          >
                                            {children}
                                          </ul>
                                        ),
                                        table: ({ children, ...props }) => (
                                          <div className="my-6 overflow-x-auto rounded-lg border border-gray/20 scrollbar-hide">
                                            <table
                                              className="w-full table-auto border-collapse [&_td]:border-r [&_td]:border-gray/10 [&_td]:p-3 [&_td]:text-sm [&_th]:border-r [&_th]:border-gray/10 [&_th]:bg-gray/10 [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-bold [&_tr:last-child]:border-b-0 [&_tr]:border-b [&_tr]:border-gray/10"
                                              {...props}
                                            >
                                              {children}
                                            </table>
                                          </div>
                                        ),
                                        h1: ({ children, ...props }) => (
                                          <h1
                                            className="mb-4 mt-8 border-b-2 border-purple/20 pb-2 text-3xl font-black text-black"
                                            {...props}
                                          >
                                            {children}
                                          </h1>
                                        ),
                                        h2: ({ children, ...props }) => (
                                          <h2
                                            className="mb-3 mt-6 text-2xl font-bold text-black"
                                            {...props}
                                          >
                                            {children}
                                          </h2>
                                        ),
                                        h3: ({ children, ...props }) => (
                                          <h3
                                            className="mb-2 mt-5 text-xl font-bold text-black"
                                            {...props}
                                          >
                                            {children}
                                          </h3>
                                        ),
                                        h4: ({ children, ...props }) => (
                                          <h4
                                            className="mb-2 mt-4 text-lg font-semibold text-black"
                                            {...props}
                                          >
                                            {children}
                                          </h4>
                                        ),
                                        h5: ({ children, ...props }) => (
                                          <h5
                                            className="mb-2 mt-3 text-base font-semibold text-black"
                                            {...props}
                                          >
                                            {children}
                                          </h5>
                                        ),
                                        h6: ({ children, ...props }) => (
                                          <h6
                                            className="mb-2 mt-3 text-sm font-semibold text-gray"
                                            {...props}
                                          >
                                            {children}
                                          </h6>
                                        ),
                                        em: ({ children, ...props }) => (
                                          <em
                                            className="italic text-purple"
                                            {...props}
                                          >
                                            {children}
                                          </em>
                                        ),
                                        strong: ({ children, ...props }) => (
                                          <strong
                                            className="font-bold text-black"
                                            {...props}
                                          >
                                            {children}
                                          </strong>
                                        ),
                                        a: ({ children, href, ...props }) => (
                                          <a
                                            href={href}
                                            className="text-purple underline transition-colors hover:text-purple/80"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                          >
                                            {children}
                                          </a>
                                        ),
                                        code: ({
                                          children,
                                          className,
                                          ...props
                                        }) => {
                                          const isInline = !className;

                                          if (isInline) {
                                            return (
                                              <code
                                                className="rounded bg-gray/10 px-2 py-1 font-mono text-sm font-bold text-purple"
                                                {...props}
                                              >
                                                {children}
                                              </code>
                                            );
                                          }

                                          return (
                                            <div className="relative">
                                              <pre className="scrollbar-thin scrollbar-thumb-gray-600 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
                                                <code
                                                  className="font-mono text-sm"
                                                  {...props}
                                                >
                                                  {children}
                                                </code>
                                              </pre>
                                            </div>
                                          );
                                        },
                                        pre: ({ children, ...props }) => (
                                          <pre className="my-4" {...props}>
                                            {children}
                                          </pre>
                                        ),
                                        blockquote: ({
                                          children,
                                          ...props
                                        }) => (
                                          <blockquote
                                            className="my-4 border-l-4 border-purple bg-purple/5 py-2 pl-4 italic text-gray"
                                            {...props}
                                          >
                                            {children}
                                          </blockquote>
                                        ),
                                        hr: ({ ...props }) => (
                                          <hr
                                            className="my-8 border-gray/20"
                                            {...props}
                                          />
                                        ),
                                        li: ({ children, ...props }) => {
                                          const childrenArray =
                                            React.Children.toArray(children);
                                          const firstChild = childrenArray[0];

                                          if (
                                            typeof firstChild === "string" &&
                                            firstChild.match(/^\[[ x]\]/)
                                          ) {
                                            const isChecked =
                                              firstChild.startsWith("[x]");
                                            const text = firstChild.replace(
                                              /^\[[ x]\]\s*/,
                                              "",
                                            );

                                            return (
                                              <li
                                                className="mb-2 flex items-start gap-2"
                                                {...props}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={isChecked}
                                                  readOnly
                                                  className="mt-1 accent-purple"
                                                />
                                                <span
                                                  className={
                                                    isChecked
                                                      ? "text-gray line-through"
                                                      : "text-gray"
                                                  }
                                                >
                                                  {text}
                                                  {childrenArray.slice(1)}
                                                </span>
                                              </li>
                                            );
                                          }

                                          return (
                                            <li
                                              className="mb-2 text-gray"
                                              {...props}
                                            >
                                              {children}
                                            </li>
                                          );
                                        },
                                        dl: ({ children, ...props }) => (
                                          <dl
                                            className="my-4 space-y-2"
                                            {...props}
                                          >
                                            {children}
                                          </dl>
                                        ),
                                        dt: ({ children, ...props }) => (
                                          <dt
                                            className="font-bold text-black"
                                            {...props}
                                          >
                                            {children}
                                          </dt>
                                        ),
                                        dd: ({ children, ...props }) => (
                                          <dd
                                            className="mb-2 ml-4 text-gray"
                                            {...props}
                                          >
                                            {children}
                                          </dd>
                                        ),
                                        details: ({ children, ...props }) => (
                                          <details
                                            className="my-4 rounded-lg border border-gray/20"
                                            {...props}
                                          >
                                            {children}
                                          </details>
                                        ),
                                        summary: ({ children, ...props }) => (
                                          <summary
                                            className="cursor-pointer bg-gray/5 p-3 font-semibold text-black transition-colors hover:bg-gray/10"
                                            {...props}
                                          >
                                            {children}
                                          </summary>
                                        ),
                                        mark: ({ children, ...props }) => (
                                          <mark
                                            className="rounded bg-yellow-200 px-1 py-0.5"
                                            {...props}
                                          >
                                            {children}
                                          </mark>
                                        ),
                                        kbd: ({ children, ...props }) => (
                                          <kbd
                                            className="rounded border border-gray-300 bg-gray-100 px-2 py-1 font-mono text-sm shadow-sm"
                                            {...props}
                                          >
                                            {children}
                                          </kbd>
                                        ),
                                        sub: ({ children, ...props }) => (
                                          <sub className="text-xs" {...props}>
                                            {children}
                                          </sub>
                                        ),
                                        sup: ({ children, ...props }) => (
                                          <sup className="text-xs" {...props}>
                                            {children}
                                          </sup>
                                        ),
                                        small: ({ children, ...props }) => (
                                          <small
                                            className="text-sm text-gray"
                                            {...props}
                                          >
                                            {children}
                                          </small>
                                        ),
                                        del: ({ children, ...props }) => (
                                          <del
                                            className="text-red-500 line-through"
                                            {...props}
                                          >
                                            {children}
                                          </del>
                                        ),
                                        ins: ({ children, ...props }) => (
                                          <ins
                                            className="text-green-600 underline decoration-green-600"
                                            {...props}
                                          >
                                            {children}
                                          </ins>
                                        ),
                                      }}
                                    >
                                      {row.value as string}
                                    </ReactMarkdown>
                                  )}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
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
