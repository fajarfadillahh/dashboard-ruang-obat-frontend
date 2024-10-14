import ErrorPage from "@/components/ErrorPage";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usePagination";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { SessionType } from "@/types/session.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SessionPage({
  sessions,
  token,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useState("");
  const { data, page, pages, setPage } = usePagination(
    sessions as SessionType[],
    10,
  );

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
            handleDelete={() => handleDeleteSession(session.user_id)}
          />
        );

      default:
        return cellValue;
    }
  }

  async function handleDeleteSession(id: string) {
    try {
      await fetcher({
        url: `/auth/session/${id}`,
        method: "DELETE",
        token,
      });

      toast.success("Session Berhasil Dihapus");
      window.location.reload();
    } catch (error) {
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  if (error) {
    return (
      <Layout title="Daftar Aktifitas Login Pengguna">
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

  const filter = data.length
    ? data.filter(
        (session) =>
          session.user_id.toLowerCase().includes(search.toLowerCase()) ||
          session.fullname.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

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
            <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari User ID atau Nama Pengguna"
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
                className="max-w-[500px] flex-1"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

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

              <TableBody
                emptyContent={
                  <span className="text-sm font-semibold italic text-gray">
                    Aktifitas pengguna tidak ditemukan!
                  </span>
                }
              >
                {filter.map((item: SessionType) => (
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

          {filter.length ? (
            <Pagination
              isCompact
              showControls
              page={page}
              total={pages}
              onChange={setPage}
              className="justify-self-center"
              classNames={{
                cursor: "bg-purple text-white",
              }}
            />
          ) : null}
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  sessions?: SessionType[];
  token?: string;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: "/admin/sessions",
      method: "GET",
      token,
    })) as SuccessResponse<SessionType[]>;

    return {
      props: {
        sessions: response.data,
        token,
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
