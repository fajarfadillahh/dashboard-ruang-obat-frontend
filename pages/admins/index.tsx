import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { AdminType } from "@/types/admin.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye, MagnifyingGlass, PencilLine, Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function AdminsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
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

            <ModalConfirmDelete
              id={admin.admin_id}
              header="Admin"
              title={admin.fullname}
              loading={loading}
              handleDelete={() => handleDeleteAdmin(admin.admin_id)}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  async function handleDeleteAdmin(id: string) {
    setLoading(true);

    try {
      await fetcher({
        url: `/admins/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Berhasil Menghapus Admin");
    } catch (error) {
      setLoading(false);
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

  const filterAdmin = data?.data.length
    ? data?.data.filter(
        (admin) =>
          admin.admin_id.toLowerCase().includes(search.toLowerCase()) ||
          admin.fullname.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <Layout title="Daftar Admin" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Daftar Admin 🧑🏽
            </h1>
            <p className="font-medium text-gray">
              Tabel admin yang terdaftar di{" "}
              <Link
                href="https://ruangobat.id"
                target="_blank"
                className="font-bold text-purple"
              >
                ruangobat.id
              </Link>
            </p>
          </div>

          <div className="grid gap-4">
            <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari Admin ID atau Nama Admin"
                onChange={(e) => setSearch(e.target.value)}
                startContent={
                  <MagnifyingGlass
                    weight="bold"
                    size={18}
                    className="text-gray"
                  />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                }}
                className="flex-1"
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
                  emptyContent={
                    <span className="text-sm font-semibold italic text-gray">
                      Admin tidak ditemukan!
                    </span>
                  }
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.headers["access_token"] as string;

  return {
    props: {
      token,
    },
  };
};
