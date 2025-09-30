import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { GradeTest, GradeTestResponse } from "@/types/test.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDateWithMiliseconds } from "@/utils/formatDate";
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
import { Eye, Trash, XCircle } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function GradeUsersPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });

  const [searchValue] = useDebounce(search, 800);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<GradeTestResponse>
  >({
    url: getUrl(`/admin/tests/results/${encodeURIComponent(id)}`, {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      divRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchValue]);

  const columnsGrade = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Dikumpulkan Pada", uid: "created_at" },
    { name: "Nilai", uid: "score" },
    { name: "Kategori", uid: "category" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUsers(user: GradeTest, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof GradeTest];

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
      case "created_at":
        return (
          <div className="w-max font-medium text-black">
            {formatDateWithMiliseconds(user.created_at)}
          </div>
        );
      case "score":
        return (
          <div className="w-max font-medium text-black">
            {user.score === 0 ? (
              <Chip
                variant="flat"
                color="danger"
                size="sm"
                startContent={<XCircle weight="fill" size={16} />}
                classNames={{
                  base: "px-2 gap-1",
                  content: "font-bold capitalize",
                }}
              >
                Belum ada nilai
              </Chip>
            ) : (
              user.score
            )}
          </div>
        );
      case "category":
        return (
          <div className="w-max font-medium text-black">
            {user.score_category}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max gap-2">
            <Button
              variant="light"
              color="secondary"
              size="sm"
              startContent={<Eye weight="duotone" size={18} />}
              className="w-max font-semibold"
              onClick={() => router.push(`/tests/${user.result_id}/answers`)}
            >
              Jawaban
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Jawaban">
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Nilai</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus nilai{" "}
                    <strong className="font-extrabold text-purple">
                      {user.fullname}
                    </strong>
                    ?
                  </p>
                </div>
              }
              footer={(onClose: any) => (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-semibold"
                  >
                    Tutup
                  </Button>

                  <Button
                    color="danger"
                    onClick={() => handleDeleteAnswer(user.result_id)}
                    className="font-semibold"
                  >
                    Ya, Hapus Nilai
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

  async function handleDeleteAnswer(id: string) {
    try {
      await fetcher({
        url: `/admin/results/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Nilai berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title={`Daftar Nilai ${data?.data.title}`}>
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
    <Layout
      title={`Daftar Nilai ${data?.data.title}`}
      className="scrollbar-hide"
    >
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title={`Daftar Nilai ${data?.data.title} 🎯`}
          text="Lihat semua nilai dari para mahasiswa/i"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Nama Pengguna atau ID Pengguna..."
              defaultValue={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage("1");
              }}
              onClear={() => {
                setSearch("");
                setPage("");
              }}
            />

            <p className="text-sm font-medium text-gray">
              Total Jawaban{" "}
              <strong className="font-black text-purple">
                {data?.data.total_results ? data.data.total_results : "-"}/
                {data?.data.total_participants
                  ? data.data.total_participants
                  : "-"}
              </strong>
            </p>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
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
                items={data?.data.results}
                emptyContent={
                  <EmptyData text="Nilai pengguna tidak ditemukan!" />
                }
              >
                {(item: GradeTest) => (
                  <TableRow key={item.result_id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUsers(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {data?.data.results.length ? (
          <Pagination
            isCompact
            showControls
            page={data.data.page as number}
            total={data.data.total_pages as number}
            onChange={(e) => {
              setPage(`${e}`);
              divRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="justify-self-center"
            classNames={{
              cursor: "bg-purple text-white",
            }}
          />
        ) : null}
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      id,
    },
  };
});
