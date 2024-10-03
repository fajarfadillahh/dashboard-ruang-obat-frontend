import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { User } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
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
import { Eye, MagnifyingGlass } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UsersPage({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: User, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{user.user_id}</div>
        );
      case "fullname":
        return (
          <div className="w-max font-medium text-black">{user.fullname}</div>
        );
      case "university":
        return (
          <div className="w-max font-medium text-black">{user.university}</div>
        );
      case "action":
        return (
          <div className="flex w-max items-center gap-1">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() =>
                router.push(
                  `/users/details/${encodeURIComponent(user.user_id)}`,
                )
              }
            >
              <Eye weight="bold" size={18} />
            </Button>

            <ModalConfirmDelete
              id={user.user_id}
              header="Pengguna"
              title={user.fullname}
              handleDelete={() => handleDeleteUser(user.user_id)}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  function handleDeleteUser(id: string) {
    console.log(`Pengguna dengan ID: ${id} berhasil terhapus!`);
  }

  return (
    <Layout title="Daftar Pengguna">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Daftar Pengguna 🧑🏽‍💻
            </h1>
            <p className="font-medium text-gray">
              Tabel pengguna yang sudah terdaftar di{" "}
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
            <Input
              type="text"
              variant="flat"
              labelPlacement="outside"
              placeholder="Cari Pengguna..."
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
              className="max-w-[500px]"
            />

            <div className="overflow-x-scroll">
              <Table
                isHeaderSticky
                aria-label="users table"
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
                  emptyContent={
                    <span className="text-sm font-semibold italic text-gray">
                      Pengguna tidak ditemukan!
                    </span>
                  }
                >
                  {users.users.map((user: User) => (
                    <TableRow key={user.user_id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellUsers(user, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req }) => {
  const token = req.headers["access_token"] as string;

  const response = await fetcher({
    url: "/admin/users",
    method: "GET",
    token,
  });

  if (!response.data) {
    throw new Error("Data not found");
  }

  return {
    props: {
      users: response.data,
    },
  };
}) satisfies GetServerSideProps<{ users: User }>;
