import { sessions } from "@/_dummy/sessions";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usepagination";
import { SessionType } from "@/types/session.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Link from "next/link";

export default function SessionPage() {
  const { page, pages, data, setPage } = usePagination(sessions, 10);

  const columnsUser = [
    { name: "ID Pengguna", uid: "id" },
    { name: "Nama Lengkap", uid: "name" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Browser", uid: "browser" },
    { name: "Sistem Operasi", uid: "os" },
    { name: "Aksi", uid: "action" },
  ];

  function handleSessionLoginUser(id: string) {
    console.log(`Session pengguna dengan ID: ${id} berhasil terhapus!`);
  }

  function renderCellUsers(user: SessionType, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof SessionType];

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
      case "university":
        return (
          <div className="w-max font-medium text-black">{user.asal_kampus}</div>
        );
      case "browser":
        return (
          <div className="w-max font-medium text-black">{user.browser}</div>
        );
      case "os":
        return (
          <div className="w-max font-medium text-black">
            {user.sistem_operasi}
          </div>
        );
      case "action":
        return (
          <ModalConfirmDelete
            id={user.id_pengguna}
            header="Session"
            title={`Session: ${user.nama_lengkap}`}
            handleDelete={() => handleSessionLoginUser(user.id_pengguna)}
          />
        );

      default:
        return cellValue;
    }
  }

  return (
    <Layout title="Daftar Aktifitas Login Pengguna">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Aktifitas Login 🕚
            </h1>
            <p className="font-medium text-gray">
              Pantau aktifitas login pengguna{" "}
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
