import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { AdminType } from "@/types/admin.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye, PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function AdminsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<AdminType[]>
  >({
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

  function renderCellUsers(admin: AdminType, columnKey: React.Key) {
    const cellValue = admin[columnKey as keyof AdminType];

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
              onClick={() => router.push(`/admins/details/${admin.admin_id}`)}
            >
              <Eye weight="bold" size={18} />
            </Button>

            <Button
              isIconOnly
              variant="light"
              color="secondary"
              size="sm"
              onClick={() => router.push(`/admins/edit/${admin.admin_id}`)}
            >
              <PencilLine weight="bold" size={18} />
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <Trash weight="bold" size={18} className="text-danger" />
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Admin</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus admin berikut secara permanen?
                  </p>

                  <div className="grid gap-1">
                    {[
                      ["ID Admin", `${admin.admin_id}`],
                      ["Nama Lengkap", `${admin.fullname}`],
                    ].map(([label, value], index) => (
                      <div
                        key={index}
                        className="grid gap-4 [grid-template-columns:110px_2px_1fr;]"
                      >
                        <h1 className="text-gray">{label}</h1>
                        <span>:</span>
                        <h1 className="font-extrabold text-purple">{value}</h1>
                      </div>
                    ))}
                  </div>

                  <p className="leading-[170%] text-gray">
                    Tindakan ini tidak dapat dibatalkan, dan data yang sudah
                    dihapus tidak dapat dipulihkan.
                  </p>
                </div>
              }
              footer={(onClose: any) => (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-bold"
                  >
                    Tutup
                  </Button>

                  <Button
                    color="danger"
                    onClick={() => handleDeleteAdmin(admin.admin_id)}
                    className="font-bold"
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
      toast.success("Berhasil Menghapus Admin");
    } catch (error) {
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  if (error) {
    return (
      <Layout title="Daftar Admin">
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

  const filterAdmin = data?.data.filter((admin) =>
    [admin.admin_id, admin.fullname].some((value) =>
      value.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <Layout title="Daftar Admin" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Admin 🧑🏽"
            text="Tabel admin yang terdaftar di ruangobat.id"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput
                placeholder="Cari Admin ID atau Nama Admin"
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <Button
                variant="solid"
                color="secondary"
                startContent={<Plus weight="bold" size={16} />}
                onClick={() => router.push("/admins/create")}
                className="w-max font-bold"
              >
                Tambah Admin
              </Button>
            </div>

            <div className="overflow-x-scroll scrollbar-hide">
              <Table
                isHeaderSticky
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
                >
                  {(item) => (
                    <TableRow key={item.admin_id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellUsers(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
