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
import { formatDate } from "@/utils/formatDate";

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
import { Funnel, Link } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useRef } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type ProductLog = {
  user_id: string;
  fullname: string;
  phone_number: string;
  product_name: string;
  product_type: string;
  action: "click" | "view";
  created_at: string;
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
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);

  const { data, error, isLoading } = useSWR<SuccessResponse<ProductsResponse>>({
    url: getUrl(`/activities/products/${params.type}`, {
      q: searchValue,
      page,
      sort,
    }),
    method: "GET",
    token,
  });

  const columnsProduct = [
    { name: "Nama Produk", uid: "product_name" },
    { name: "Nama Pengguna", uid: "fullname" },
    { name: "No. Telp", uid: "phone_number" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellProduct(product: ProductLog, columnKey: React.Key) {
    switch (columnKey) {
      case "product_name":
        return (
          <div className="w-[300px] font-medium text-black">
            {product.product_name}
          </div>
        );
      case "fullname":
        return <div className="font-medium text-black">{product.fullname}</div>;
      case "phone_number":
        return (
          <div className="inline-flex items-center gap-2">
            <div className="font-medium text-black">{product.phone_number}</div>

            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="secondary"
              onClick={() => {
                const formattedNumber = product.phone_number.replace(
                  /^0/,
                  "62",
                );
                window.open(
                  `https://api.whatsapp.com/send?phone=${formattedNumber}`,
                  "_blank",
                );
              }}
            >
              <Link weight="duotone" size={18} />
            </Button>
          </div>
        );
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(product.created_at)}
          </div>
        );
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
          text="Pantau aktivitas pengguna ketika melihat produk RuangObat"
          className="max-w-[500px]"
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
                  <TableRow key={product.created_at}>
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
