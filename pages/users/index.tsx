import { users } from "@/_dummy/users";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usepagination";
import { UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Button,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye, MagnifyingGlass, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UsersPage() {
  const router = useRouter();
  const { page, pages, data, setPage } = usePagination(users, 5);

  const columnsUser = [
    { name: "ID Pengguna", uid: "id" },
    { name: "Nama Lengkap", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: UserType, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "id":
        return (
          <div className="w-max font-medium text-black">{user.id_pengguna}</div>
        );
      case "name":
        return (
          <div className="w-max font-medium text-black">
            {user.nama_lengkap}
          </div>
        );
      case "email":
        return <div className="w-max font-medium text-black">{user.email}</div>;
      case "action":
        return (
          <div className="flex max-w-[150px] items-center gap-1">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={() =>
                router.push(
                  `/users/details/${encodeURIComponent(user.id_pengguna)}`,
                )
              }
            >
              <Eye weight="bold" size={18} className="text-gray" />
            </Button>

            <Button
              isIconOnly
              variant="light"
              color="danger"
              size="sm"
              onClick={() => confirm("Apakah anda yakin?")}
            >
              <Trash weight="bold" size={18} />
            </Button>
          </div>
        );

      default:
        return cellValue;
    }
  }

  return (
    <Layout title="Users Page">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Pengguna 🧑🏽‍💻
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

            <Table
              isHeaderSticky
              aria-label="users table"
              color="secondary"
              selectionMode="single"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsUser}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody items={data}>
                {(item) => (
                  <TableRow key={item.id_pengguna}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={setPage}
              className="justify-self-center"
            />
          </div>
        </section>
      </Container>
    </Layout>
  );
}
