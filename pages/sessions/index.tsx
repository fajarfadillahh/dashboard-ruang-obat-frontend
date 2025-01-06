import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { SuccessResponse } from "@/types/global.type";
import { Session, SessionResponse } from "@/types/session.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Trash } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/sessions?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/sessions?page=${query.page ? query.page : 1}`;
}

export default function SessionPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<SessionResponse>
  >({
    url: getUrl(query) as string,
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push("/sessions");
    }
  }, [searchValue]);

  const columnsSession = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Browser", uid: "browser" },
    { name: "Sistem Operasi", uid: "os" },
    { name: "Expired", uid: "expired" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellSessions(session: Session, columnKey: React.Key) {
    const cellValue = session[columnKey as keyof Session];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{session.user_id}</div>
        );
      case "fullname":
        return (
          <div className="font-medium capitalize text-black">
            {session.fullname}
          </div>
        );
      case "university":
        return (
          <div className="font-medium capitalize text-black">
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
      case "expired":
        return (
          <div className="w-max font-medium capitalize text-black">
            {formatDate(session.expired)}
          </div>
        );
      case "action":
        return (
          <ModalConfirm
            trigger={
              <Button isIconOnly variant="light" color="danger" size="sm">
                <Trash weight="bold" size={18} className="text-danger" />
              </Button>
            }
            header={<h1 className="font-bold text-black">Hapus Session</h1>}
            body={
              <div className="grid gap-3 text-sm font-medium">
                <p className="leading-[170%] text-gray">
                  Apakah anda ingin menghapus session berikut secara permanen?
                </p>

                <div className="grid gap-1">
                  {[
                    ["ID Pengguna", `${session.user_id}`],
                    ["Nama Lengkap", `${session.fullname}`],
                  ].map(([label, value], index) => (
                    <div
                      key={index}
                      className="grid gap-4 [grid-template-columns:110px_2px_1fr;]"
                    >
                      <h1 className="text-gray">{label}</h1>
                      <span>:</span>
                      <h1 className="font-extrabold text-purple">{value}</h1>
                    </div>
                  ))}
                </div>

                <p className="leading-[170%] text-gray">
                  Tindakan ini tidak dapat dibatalkan, dan data yang sudah
                  dihapus tidak dapat dipulihkan.
                </p>
              </div>
            }
            footer={(onClose: any) => (
              <>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-bold"
                >
                  Tutup
                </Button>

                <Button
                  color="danger"
                  onClick={() => handleDeleteSession(session.user_id)}
                  className="font-bold"
                >
                  Ya, Hapus Session
                </Button>
              </>
            )}
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

      mutate();
      toast.success("Session berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Session">
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

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="Session" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Aktifitas Login 🕚"
            text="Pantau aktifitas login pengguna ruangobat.id"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 bg-white pb-4">
              <SearchInput
                placeholder="Cari User ID atau Nama Pengguna"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />
            </div>

            <div className="overflow-x-scroll scrollbar-hide">
              <Table
                isHeaderSticky
                aria-label="sessions table"
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
                  items={data?.data.sessions}
                  emptyContent={
                    <EmptyData text="Aktifitas pengguna tidak ditemukan!" />
                  }
                >
                  {(session: Session) => (
                    <TableRow key={session.user_id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellSessions(session, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {data?.data.sessions.length ? (
            <Pagination
              isCompact
              showControls
              page={data?.data.page as number}
              total={data?.data.total_pages as number}
              onChange={(e) => {
                router.push({
                  query: {
                    ...router.query,
                    page: e,
                  },
                });
              }}
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

export const getServerSideProps: GetServerSideProps<{
  token: string;
  query: ParsedUrlQuery;
}> = async ({ req, query }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      query,
    },
  };
};
