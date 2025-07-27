import ButtonBack from "@/components/button/ButtonBack";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { SubscriptionsResponse } from "@/types/subscriptions/packages.type";
import { User, UsersResponse } from "@/types/user.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatRupiah } from "@/utils/formatRupiah";
import { getError } from "@/utils/getError";
import {
  Button,
  getKeyValue,
  Input,
  Pagination,
  Select,
  Selection,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FloppyDisk, Tag } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type InputState = {
  idempotency_key: string;
  type_access: string;
  product_type: string;
  discount_amount: number;
  user_timezone: string;
};

export default function CreateVideoCourseAccess({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const { data: dataUser, isLoading: isLoadingUsers } = useSWR<
    SuccessResponse<UsersResponse>
  >({
    url: getUrl("/admin/users", {
      page,
      q: searchValue,
    }),
    method: "GET",
    token,
  });

  const { data: dataSubscriptions } = useSWR<
    SuccessResponse<SubscriptionsResponse>
  >({
    url: getUrl("/subscriptions/packages?type=videocourse", {
      page: "1",
    }),
    method: "GET",
    token,
  });
  const [userId, setUserId] = useState<Selection>(new Set([]));
  const [packageId, setPackageId] = useState<Selection>(new Set([]));

  const [input, setInput] = useState<InputState>({
    idempotency_key: "",
    type_access: "videocourse",
    product_type: "videocourse",
    discount_amount: 0,
    user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (key: keyof InputState, value: any) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleCreateAccess() {
    const payload = {
      ...input,
      user_id: Array.from(userId)[0] || "",
      product_id: Array.from(packageId)[0] || "",
    };

    try {
      setIsLoading(true);

      await fetcher({
        url: "/accesses",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Akses berhasil ditambahkan");
      localStorage.removeItem("idempotency_key");
      return router.back();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let key = localStorage.getItem("idempotency_key");
    if (!key) {
      key =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("idempotency_key", key);
    }
    setInput((prev) => ({
      ...prev,
      idempotency_key: key as string,
    }));
  }, []);

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
  ];

  const user = Array.from(userId).length
    ? dataUser?.data?.users.find((usr) => usr.user_id === Array.from(userId)[0])
    : null;

  const product = Array.from(packageId).length
    ? dataSubscriptions?.data?.packages.find(
        (pkg) => pkg.package_id === Array.from(packageId)[0],
      )
    : null;

  const preview = [
    ["ID Pengguna", user ? user.user_id : ""],
    ["Nama Pengguna", user ? user.fullname : ""],
    ["Nama Produk", product ? product.name : ""],
    ["Durasi", product ? `${product.duration} bulan` : ""],
    ["Total Harga", product ? formatRupiah(product.price) : ""],
  ];

  if (input.discount_amount) {
    preview.push(
      [
        "Jumlah Diskon",
        input.discount_amount ? formatRupiah(input.discount_amount) : "0",
      ],
      [
        "Jumlah Akhir",
        product
          ? formatRupiah(product.price - (input.discount_amount || 0))
          : "",
      ],
    );
  }

  return (
    <Layout title="Tambah Akses" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText title="Tambah Akses 📋" text="" />

        <div className="grid max-w-[600px] gap-8 pt-8">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <SearchInput
                placeholder="Cari Nama Pengguna atau ID Pengguna..."
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                defaultValue={search}
              />

              <div className="overflow-x-scroll scrollbar-hide">
                <Table
                  isStriped
                  aria-label="users table"
                  color="secondary"
                  selectionMode="single"
                  selectedKeys={userId}
                  onSelectionChange={setUserId}
                  classNames={customStyleTable}
                  className="scrollbar-hide"
                >
                  <TableHeader columns={columnsUser}>
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody
                    items={dataUser?.data?.users || []}
                    emptyContent={
                      <span className="text-sm font-semibold italic text-gray">
                        Pengguna tidak ditemukan!
                      </span>
                    }
                    loadingContent={
                      <Spinner size="md" color="secondary" label="Loading..." />
                    }
                    isLoading={isLoadingUsers}
                  >
                    {(item: User) => (
                      <TableRow key={item.user_id}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {!isLoadingUsers && dataUser?.data?.users.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={dataUser?.data?.page as number}
                  total={dataUser?.data?.total_pages as number}
                  onChange={(e) => {
                    setPage(`${e}`);
                    setPackageId(new Set([]));
                    setUserId(new Set([]));
                    setInput((prev) => ({
                      ...prev,
                      discount_amount: 0,
                    }));
                  }}
                  className="justify-self-center"
                  classNames={{
                    cursor: "bg-purple text-white",
                  }}
                />
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                items={dataSubscriptions?.data?.packages || []}
                label="Pilih paket"
                labelPlacement="outside"
                placeholder="Pilih paket berlangganan"
                selectedKeys={packageId}
                onSelectionChange={setPackageId}
              >
                {(pkg) => (
                  <SelectItem key={pkg.package_id} textValue={pkg.name}>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-small">{pkg.name}</span>
                        <span className="text-md">
                          {formatRupiah(pkg.price)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>

              <Input
                type="number"
                variant="flat"
                label="Diskon (optional)"
                labelPlacement="outside"
                placeholder="Contoh: 10000"
                name="discount_amount"
                value={input.discount_amount.toString()}
                onChange={(e) =>
                  handleChange("discount_amount", Number(e.target.value))
                }
                startContent={
                  <Tag weight="duotone" size={18} className="text-gray" />
                }
                classNames={customStyleInput}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold">Preview</h1>
            <div className="grid flex-1 gap-1.5">
              {preview.map(([label, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-[150px_2px_1fr] gap-4 text-sm font-medium text-black"
                >
                  <p>{label}</p>
                  <span>:</span>
                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            isLoading={isLoading}
            isDisabled={
              isLoading ||
              !Array.from(userId).length ||
              !Array.from(packageId).length
            }
            color="secondary"
            startContent={
              isLoading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleCreateAccess}
            className="w-max justify-self-end font-semibold"
          >
            {isLoading ? "Tunggu Sebentar..." : "Tambah Paket"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
