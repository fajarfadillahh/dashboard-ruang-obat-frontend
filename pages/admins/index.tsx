import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { Admin } from "@/types/admin.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye, PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function AdminsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, error, isLoading, mutate } = useSWR<SuccessResponse<Admin[]>>({
    url: "/admins",
    method: "GET",
    token,
  });

  const columnsUser = [
    { name: "ID Admin", uid: "admin_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Role", uid: "role" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(admin: Admin, columnKey: React.Key) {
    const cellValue = admin[columnKey as keyof Admin];

    switch (columnKey) {
      case "admin_id":
        return (
          <div className="w-max font-medium text-black">{admin.admin_id}</div>
        );
      case "fullname":
        return <div className="font-medium text-black">{admin.fullname}</div>;
      case "role":
        return <div className="w-max font-medium text-black">{admin.role}</div>;
      case "created_at":
        return (
          <div className="w-max font-medium text-black">
            {formatDate(admin.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <Button
              isIconOnly
              variant="light"
              color="secondary"
              size="sm"
              onClick={() => router.push(`/admins/${admin.admin_id}`)}
            >
              <CustomTooltip content="Detail Admin">
                <Eye weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <Button
              isIconOnly
              variant="light"
              color="secondary"
              size="sm"
              onClick={() => router.push(`/admins/${admin.admin_id}/edit`)}
            >
              <CustomTooltip content="Edit Admin">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Admin">
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Admin</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus admin{" "}
                    <strong className="font-extrabold text-purple">
                      {admin.fullname}
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
                    onClick={() => handleDeleteAdmin(admin.admin_id)}
                    className="font-semibold"
                  >
                    Ya, Hapus Admin
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

  async function handleDeleteAdmin(id: string) {
    try {
      await fetcher({
        url: `/admins/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Admin berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Admin">
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

  const filterAdmin =
    !isLoading || data?.data.length
      ? data?.data.filter((admin) =>
          [admin.admin_id, admin.fullname].some((value) =>
            value.toLowerCase().includes(search.toLowerCase()),
          ),
        )
      : [];

  return (
    <Layout title="Admin" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Admin 🧑🏽"
          text="Tabel admin yang terdaftar di ruangobat.id"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Admin atau ID Admin..."
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={16} />}
              onClick={() => router.push("/admins/create")}
              className="w-max font-semibold"
            >
              Tambah Admin
            </Button>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              aria-label="admins table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsUser}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={filterAdmin}
                emptyContent={<EmptyData text="Admin tidak ditemukan!" />}
                isLoading={isLoading}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
              >
                {(admin) => (
                  <TableRow key={admin.admin_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(admin, columnKey)}</TableCell>
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
