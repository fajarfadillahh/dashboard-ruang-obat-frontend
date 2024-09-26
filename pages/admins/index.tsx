import { admins } from "@/_dummy/admins";
import ModalSeePasswordAdmin from "@/components/modal/ModalSeePasswordAdmin";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { AdminType } from "@/types/admin.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PencilLine, Plus, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminsPage() {
  const router = useRouter();

  const columnsUser = [
    { name: "ID Admin", uid: "id" },
    { name: "Nama Lengkap", uid: "name" },
    { name: "Username", uid: "username" },
    { name: "Kata Sandi", uid: "password" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(admin: AdminType, columnKey: React.Key) {
    const cellValue = admin[columnKey as keyof AdminType];

    switch (columnKey) {
      case "id":
        return <div className="w-max font-medium text-black">{admin.id}</div>;
      case "name":
        return <div className="w-max font-medium text-black">{admin.name}</div>;
      case "username":
        return (
          <div className="w-max font-medium text-black">{admin.username}</div>
        );
      case "password":
        return (
          <>
            <ModalSeePasswordAdmin {...admin} />
          </>
        );
      case "created_at":
        return (
          <div className="w-max font-medium text-black">{admin.created_at}</div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <Button isIconOnly variant="light" color="secondary" size="sm">
              <PencilLine weight="bold" size={18} />
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
    <Layout title="Admins Page">
      <Container>
        <section className="grid gap-6">
          <div className="flex items-end justify-between gap-2">
            <div className="grid gap-1">
              <h1 className="text-[22px] font-bold -tracking-wide text-black">
                Admin Ruangobat.id 🧑🏽
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

            <TableBody items={admins}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCellUsers(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </Container>
    </Layout>
  );
}
