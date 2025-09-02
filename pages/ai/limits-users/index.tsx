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
import { LimitAIUser, LimitAIUserResponse } from "@/types/ai/limit.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
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
import { Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useRef } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function AILimitsCustomPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error, mutate } = useSWR<
    SuccessResponse<LimitAIUserResponse>
  >({
    url: getUrl("/ai/limits/users", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsLimitUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Pengguna", uid: "fullname" },
    { name: "Total", uid: "total" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Expired Pada", uid: "expired_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellLimitUsers(user: LimitAIUser, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof LimitAIUser];

    switch (columnKey) {
      case "user_id":
        return <div className="font-medium text-black">{user.user_id}</div>;
      case "fullname":
        return <div className="font-medium text-black">{user.fullname}</div>;
      case "total":
        return <div className="font-medium text-black">{user.total}</div>;
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(user.created_at)}
          </div>
        );
      case "expired_at":
        return (
          <div className="font-medium text-black">
            {formatDate(user.expired_at)}
          </div>
        );
      case "action":
        return (
          <ModalConfirm
            trigger={
              <Button isIconOnly variant="light" color="danger" size="sm">
                <CustomTooltip content="Hapus Pengguna">
                  <Trash weight="duotone" size={18} className="text-danger" />
                </CustomTooltip>
              </Button>
            }
            header={<h1 className="font-bold text-black">Hapus Pengguna</h1>}
            body={
              <div className="grid gap-3 text-sm font-medium">
                <p className="leading-[170%] text-gray">
                  Apakah anda ingin menghapus limit{" "}
                  <strong className="font-extrabold text-purple">
                    {user.fullname}
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
                  onClick={() => handleDeleteUser(user.user_id)}
                >
                  Ya, Hapus Pengguna
                </Button>
              </>
            )}
          />
        );

      default:
        return cellValue;
    }
  }

  async function handleDeleteUser(user_id: string) {
    try {
      await fetcher({
        url: `/ai/limits/users/${user_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Pengguna berhasil dihapus");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Custom Limitasi Pengguna">
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
    <Layout title="Custom Limitasi Pengguna">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="Custom Limitasi Pengguna 📋"
          text="Semua data kustomisasi limit pengguna ada di sini"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={query.q as string}
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
              onClick={() => router.push("/ai/limits-users/create")}
              className="w-max font-semibold"
            >
              Tambah Pengguna
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              isHeaderSticky
              aria-label="limits user table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsLimitUser}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.users || []}
                isLoading={isLoading}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
                emptyContent={<EmptyData text="Pengguna tidak ditemukan!" />}
              >
                {(user: LimitAIUser) => (
                  <TableRow key={user.user_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellLimitUsers(user, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.users.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              setPage(`${e}`);
              divRef.current?.scrollIntoView({ behavior: "smooth" });
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
