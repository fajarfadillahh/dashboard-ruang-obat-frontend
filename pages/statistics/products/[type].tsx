import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { getUrl } from "@/lib/getUrl";
import { products } from "@/lib/products";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";

import {
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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type ProductLog = {
  product_name: string;
  product_type: string;
  action: "click" | "view";
  user_id: string;
  fullname: string;
};

type ProductsResponse = {
  products: ProductLog[];
  page: number;
  total_logs: number;
  total_pages: number;
};

export default function ProductsStatisticsPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { data, error, isLoading } = useSWR<SuccessResponse<ProductsResponse>>({
    url: getUrl(`/activities/products/${params.type}`, {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsProduct = [
    { name: "Nama Produk", uid: "product_name" },
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Pengguna", uid: "fullname" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellProduct(product: ProductLog, columnKey: React.Key) {
    switch (columnKey) {
      case "product_name":
        return (
          <div className="font-medium text-black">{product.product_name}</div>
        );
      case "user_id":
        return <div className="font-medium text-black">{product.user_id}</div>;
      case "fullname":
        return <div className="font-medium text-black">{product.fullname}</div>;
      case "action":
        return (
          <Chip
            variant="flat"
            size="sm"
            color={
              product.action === "click"
                ? "success"
                : product.action === "view"
                  ? "danger"
                  : "warning"
            }
            classNames={{ base: "px-2 gap-1", content: "font-bold capitalize" }}
          >
            {product.action}
          </Chip>
        );

      default:
        return null;
    }
  }

  if (error) {
    return (
      <Layout title="Statistik Produk">
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
    <Layout title="Aktivitas Produk" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title={`Aktivitas Produk ${products.find((p) => p.code === params.type)?.label} 📦`}
          text=""
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna atau Nama Produk"
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
              aria-label="products table"
              color="secondary"
              selectionMode="none"
              className="scrollbar-hide"
              classNames={customStyleTable}
            >
              <TableHeader columns={columnsProduct}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                isLoading={isLoading}
                items={data?.data.products || []}
                emptyContent={<EmptyData text="Data masih kosong" />}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
              >
                {(product: ProductLog) => (
                  <TableRow key={product.product_name + product.user_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellProduct(product, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.products.length ? (
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
  params: ParsedUrlQuery;
}> = async ({ req, params }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
    },
  };
};
