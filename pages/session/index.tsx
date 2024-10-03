import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SessionType } from "@/types/session.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

export default function SessionPage({
  sessions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const columnsSession = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Browser", uid: "browser" },
    { name: "Sistem Operasi", uid: "os" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellSessions(session: SessionType, columnKey: React.Key) {
    const cellValue = session[columnKey as keyof SessionType];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{session.user_id}</div>
        );
      case "fullname":
        return (
          <div className="w-max font-medium capitalize text-black">
            {session.fullname}
          </div>
        );
      case "university":
        return (
          <div className="w-max font-medium capitalize text-black">
            {session.university}
          </div>
        );
      case "browser":
        return (
          <div className="w-max font-medium capitalize text-black">
            {session.browser || "-"}
          </div>
        );
      case "os":
        return (
          <div className="w-max font-medium capitalize text-black">
            {session.os === "undefined undefined" ? "-" : session.os}
          </div>
        );
      case "action":
        return (
          <ModalConfirmDelete
            id={session.user_id}
            header="Session"
            title={`Session: ${session.fullname}`}
            handleDelete={() => handleSessionLoginUser(session.user_id)}
          />
        );

      default:
        return cellValue;
    }
  }

  function handleSessionLoginUser(id: string) {
    console.log(`Session pengguna dengan ID: ${id} berhasil terhapus!`);
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
              <TableHeader columns={columnsSession}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody>
                {sessions.map((item: SessionType) => (
                  <TableRow key={item.user_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellSessions(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req }) => {
  const token = req.headers["access_token"] as string;

  const response = await fetcher({
    url: "/admin/sessions",
    method: "GET",
    token,
  });

  if (!response.data) {
    throw new Error("Data not found!");
  }

  return {
    props: {
      sessions: response.data,
    },
  };
}) satisfies GetServerSideProps<{ sessions: SessionType }>;
