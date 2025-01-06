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
import { Mentor, MentorResponse } from "@/types/mentor.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  CheckCircle,
  Eye,
  PencilLine,
  Plus,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/mentors?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/mentors?page=${query.page ? query.page : 1}`;
}

export default function MentorsPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<MentorResponse>
  >({
    url: getUrl(query),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/mentors");
    }
  }, [searchValue]);

  const columnsMentor = [
    { name: "ID Mentor", uid: "mentor_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Mentor", uid: "mentor_title" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Status", uid: "status" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellMentors(mentor: Mentor, columnKey: React.Key) {
    const cellValue = mentor[columnKey as keyof Mentor];

    switch (columnKey) {
      case "mentor_id":
        return (
          <div className="w-max font-medium text-black">{mentor.mentor_id}</div>
        );
      case "fullname":
        return <div className="font-medium text-black">{mentor.fullname}</div>;
      case "mentor_title":
        return (
          <div className="w-max font-medium text-black">
            {mentor.mentor_title}
          </div>
        );
      case "created_at":
        return (
          <div className="w-max font-medium text-black">
            {formatDate(mentor.created_at)}
          </div>
        );
      case "status":
        return (
          <div className="w-max font-medium text-black">
            <Chip
              variant="flat"
              size="sm"
              color={mentor.is_show ? "success" : "danger"}
              startContent={
                mentor.is_show ? (
                  <CheckCircle weight="fill" size={16} />
                ) : (
                  <XCircle weight="fill" size={16} />
                )
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-bold capitalize",
              }}
            >
              {mentor.is_show
                ? "Tampil di homepage"
                : "Tidak tampil di homepage"}
            </Chip>
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <Button
              isIconOnly
              variant="light"
              color="secondary"
              size="sm"
              onClick={() =>
                router.push(
                  `/mentors/details/${encodeURIComponent(mentor.mentor_id)}`,
                )
              }
            >
              <Eye weight="bold" size={18} />
            </Button>

            <Button
              isIconOnly
              variant="light"
              color="secondary"
              size="sm"
              onClick={() =>
                router.push(
                  `/mentors/edit/${encodeURIComponent(mentor.mentor_id)}`,
                )
              }
            >
              <PencilLine weight="bold" size={18} />
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <Trash weight="bold" size={18} className="text-danger" />
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Mentor</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus mentor berikut secara permanen?
                  </p>

                  <div className="grid gap-1">
                    {[
                      ["ID Mentor", `${mentor.mentor_id}`],
                      ["Nama Lengkap", `${mentor.fullname}`],
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
                    className="font-bold"
                    onClick={() => handleDeleteMentor(mentor.mentor_id)}
                  >
                    Ya, Hapus Mentor
                  </Button>
                </>
              )}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  async function handleDeleteMentor(id: string) {
    try {
      await fetcher({
        url: `/admin/mentors/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Mentor berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Mentor">
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
    <Layout title="Mentor" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Mentor 🧑🏽"
            text="Mentor terbaik yang di miliki ruangobat.id"
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput
                placeholder="Cari Mentor ID atau Nama Mentor"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <Button
                color="secondary"
                startContent={<Plus weight="bold" size={16} />}
                onClick={() => router.push("/mentors/create")}
                className="w-max font-bold"
              >
                Tambah Mentor
              </Button>
            </div>

            <div className="overflow-x-scroll scrollbar-hide">
              <Table
                isHeaderSticky
                aria-label="mentors table"
                color="secondary"
                selectionMode="none"
                classNames={customStyleTable}
                className="scrollbar-hide"
              >
                <TableHeader columns={columnsMentor}>
                  {(column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  )}
                </TableHeader>

                <TableBody
                  items={data?.data.mentors}
                  emptyContent={<EmptyData text="Mentor tidak ditemukan!" />}
                >
                  {(mentor) => (
                    <TableRow key={mentor.mentor_id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellMentors(mentor, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {data?.data.mentors.length ? (
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
