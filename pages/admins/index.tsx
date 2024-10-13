import ErrorPage from "@/components/ErrorPage";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { AdminType } from "@/types/admin.type";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
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
import { MagnifyingGlass, PencilLine, Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminsPage({
  admins,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

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
        return (
          <div className="w-max font-medium text-black">{admin.fullname}</div>
        );
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
              onClick={() => router.push(`/admins/edit/${admin.admin_id}`)}
            >
              <PencilLine weight="bold" size={18} />
            </Button>

            <ModalConfirmDelete
              id={admin.admin_id}
              header="Admin"
              title={admin.fullname}
              handleDelete={() => handleDeleteAdmin(admin.admin_id)}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  function handleDeleteAdmin(id: string) {
    console.log(`Admin dengan ID: ${id} berhasil terhapus!`);
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

  return (
    <Layout title="Daftar Admin">
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

            <div className="overflow-x-scroll">
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
                  items={admins}
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

type DataProps = {
  admins?: AdminType[];
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: "/admins",
      method: "GET",
      token,
    })) as SuccessResponse<AdminType[]>;

    return {
      props: {
        admins: response.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
