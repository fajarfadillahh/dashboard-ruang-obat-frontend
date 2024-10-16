import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Eye, XCircle } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React from "react";

const users: UserType[] = [
  {
    user_id: "ROUFFA837501",
    fullname: "Fajar Fadillah Agustian",
    university: "Stanford",
    grade: 90,
  },
  {
    user_id: "ROUGAW273329",
    fullname: "Gufronnaka Arif Wildan",
    university: "Cambridge",
    grade: 0,
  },
];

export default function GradeUsersPage() {
  const router = useRouter();
  const { id } = router.query;

  const columnsGrade = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Nilai", uid: "grade" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: UserType, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof UserType];

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
      case "grade":
        return (
          <div className="w-max font-medium text-black">
            {user.grade === 0 ? (
              <Chip
                variant="flat"
                color="danger"
                size="sm"
                startContent={<XCircle weight="fill" size={16} />}
                classNames={{
                  base: "px-2 gap-1",
                  content: "font-semibold capitalize",
                }}
              >
                Belum ada nilai
              </Chip>
            ) : (
              user.grade
            )}
          </div>
        );
      case "action":
        return (
          <Button
            variant="light"
            color="secondary"
            size="sm"
            startContent={<Eye weight="bold" size={16} />}
            onClick={() => router.push(`/tests/grades/${id}/answer`)}
            className="w-max font-bold"
          >
            Lihat Jawaban
          </Button>
        );

      default:
        return cellValue;
    }
  }

  return (
    <Layout title={`Daftar Nilai -- Judul Ujian --`} className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-8">
            <div className="grid gap-1">
              <h1 className="max-w-[550px] text-[24px] font-bold leading-[120%] -tracking-wide text-black">
                Daftar Nilai Tryout Internal Ruangobat Part 1 🎯
              </h1>
              <p className="font-medium text-gray">
                Lihat semua nilai dari para mahasiswa/i
              </p>
            </div>

            <Table
              isHeaderSticky
              aria-label="grade users table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsGrade}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={users}
                emptyContent={
                  <span className="text-sm font-semibold italic text-gray">
                    Pengguna tidak ditemukan!
                  </span>
                }
              >
                {(item: UserType) => (
                  <TableRow key={item.user_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
