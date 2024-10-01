import { tests } from "@/_dummy/tests";
import { users } from "@/_dummy/users";
import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import ModalAddParticipant from "@/components/modal/ModalAddParticipant";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usepagination";
import { UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Chip,
  Pagination,
  Snippet,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  BookBookmark,
  Certificate,
  Check,
  CheckCircle,
  Copy,
  Notepad,
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import React from "react";

export default function DetailsProgramPage() {
  const { page, pages, data, setPage } = usePagination(users, 10);

  const columnsUser = [
    { name: "ID Pengguna", uid: "id" },
    { name: "Nama Lengkap", uid: "name" },
    { name: "Kode Akses", uid: "code_access" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Status", uid: "joined_status" },
    { name: "Bergabung Pada", uid: "joined_at" },
    { name: "Aksi", uid: "action" },
  ];

  function handleDeleteParticipant(id: string) {
    console.log(`Partisipan dengan ID: ${id} berhasil terhapus!`);
  }

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
      case "code_access":
        return (
          <Snippet
            symbol=""
            copyIcon={
              <Copy weight="regular" size={16} className="text-black" />
            }
            checkIcon={
              <Check weight="regular" size={16} className="text-black" />
            }
            className="w-max"
            classNames={{
              base: "text-black bg-transparent border-none p-0",
              pre: "font-medium text-black font-sans text-[14px]",
            }}
          >
            {user.kode_akses}
          </Snippet>
        );
      case "university":
        return (
          <div className="w-max font-medium text-black">{user.asal_kampus}</div>
        );
      case "joined_status":
        return (
          <div className="w-max font-medium text-black">
            <Chip
              variant="flat"
              size="sm"
              color={
                user.status_bergabung === "mengikuti" ? "success" : "danger"
              }
              startContent={
                user.status_bergabung === "mengikuti" ? (
                  <CheckCircle
                    weight="fill"
                    size={16}
                    className="text-success"
                  />
                ) : (
                  <XCircle weight="fill" size={16} className="text-danger" />
                )
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-semibold capitalize",
              }}
            >
              {user.status_bergabung}
            </Chip>
          </div>
        );
      case "joined_at":
        return (
          <div className="w-max font-medium text-black">
            {user.bergabung_pada}
          </div>
        );
      case "action":
        return (
          <div className="grid w-[60px]">
            <ModalConfirmDelete
              id={user.id_pengguna}
              header="Partisipan"
              title={user.nama_lengkap}
              handleDelete={handleDeleteParticipant}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  return (
    <Layout title={`Kelas Ruangobat Tatap Muka: Mandiri Agustus 2024 Part 1`}>
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

                <div className="flex items-center gap-12">
                  <Chip
                    variant="flat"
                    color="default"
                    startContent={
                      <Tag weight="bold" size={18} className="text-black" />
                    }
                    classNames={{
                      base: "px-3 gap-1",
                      content: "font-bold text-black",
                    }}
                  >
                    Gratis
                  </Chip>

                  <div className="inline-flex items-center gap-1 text-gray">
                    <Certificate weight="bold" size={18} />
                    <p className="text-sm font-bold">ID: ROP817629</p>
                  </div>

                  <div className="inline-flex items-center gap-1 text-gray">
                    <Notepad weight="bold" size={18} />
                    <p className="text-sm font-bold">9 Modul Ujian</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 py-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Ujian 📋
              </h4>

              <div className="grid gap-2">
                {tests.map((test) => (
                  <CardTest key={test.id} test={test} />
                ))}
              </div>
            </div>

            <div className="grid gap-4 pt-8">
              <div className="flex items-end justify-between gap-4">
                <h4 className="text-[20px] font-bold -tracking-wide text-black">
                  Daftar Partisipan 🧑🏻‍🤝‍🧑🏻
                </h4>

                <ModalAddParticipant />
              </div>

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
              </div>

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
