import { tests } from "@/_dummy/tests";
import { users } from "@/_dummy/users";
import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usepagination";
import { UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { BookBookmark, Tag } from "@phosphor-icons/react";
import React from "react";

export default function DetailsProgramPage() {
  const { page, pages, data, setPage } = usePagination(users, 10);

  const columnsUser = [
    { name: "ID Pengguna", uid: "id" },
    { name: "Nama Lengkap", uid: "name" },
    { name: "Email", uid: "email" },
    { name: "Asal Kampus", uid: "university" },
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
      case "university":
        return (
          <div className="w-max font-medium text-black">{user.asal_kampus}</div>
        );

      default:
        return cellValue;
    }
  }

  return (
    <Layout title="Details Program Page">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="flex items-start gap-6 pb-8">
              <BookBookmark weight="bold" size={56} className="text-purple" />

              <div className="grid gap-4">
                <h4 className="max-w-[700px] text-[28px] font-bold leading-[120%] -tracking-wide text-black">
                  Kelas Ruangobat Tatap Muka: Mandiri Agustus 2024 Part 1
                </h4>

                <Chip
                  variant="flat"
                  color="default"
                  startContent={<Tag weight="bold" size={18} />}
                  classNames={{
                    base: "px-4 gap-1",
                    content: "font-bold text-black",
                  }}
                >
                  Program Gratis
                </Chip>
              </div>
            </div>

            <div className="grid gap-4 py-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Ujian 📋
              </h4>

              <div className="grid gap-4">
                {tests.map((test) => (
                  <CardTest key={test.id} {...test} />
                ))}
              </div>
            </div>

            <div className="grid gap-4 pt-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Pengikut 🧑🏻‍🤝‍🧑🏻
              </h4>

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
                        <TableCell>
                          {renderCellUsers(item, columnKey)}
                        </TableCell>
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
          </div>
        </section>
      </Container>
    </Layout>
  );
}
