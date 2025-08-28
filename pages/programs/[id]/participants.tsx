import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalAddParticipant from "@/components/modal/ModalAddParticipant";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalJoiningRequirement from "@/components/modal/ModalJoiningRequirement";
import SearchInput from "@/components/SearchInput";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Participant, ParticipantsResponse } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Snippet,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  CheckCircle,
  ClockCountdown,
  Copy,
  Funnel,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function ParticipantsPage({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<ParticipantsResponse>
  >({
    url: getUrl(`/admin/programs/participants/${encodeURIComponent(id)}`, {
      q: searchValue,
      page,
      sort,
    }),
    method: "GET",
    token,
  });

  const columnsParticipantDefault = [
    { name: "ID Partisipan", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Status", uid: "status" },
    { name: "Bergabung Pada", uid: "joined_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellParticipants(
    participant: Participant,
    columnKey: React.Key,
  ) {
    const cellValue = participant[columnKey as keyof Participant];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">
            {participant.user_id}
          </div>
        );
      case "fullname":
        return (
          <div className="font-medium text-black">{participant.fullname}</div>
        );
      case "code":
        return (
          <Snippet
            symbol=""
            copyIcon={
              <Copy weight="duotone" size={18} className="text-black" />
            }
            checkIcon={
              <CheckCircle weight="duotone" size={18} className="text-black" />
            }
            className="w-max"
            classNames={{
              base: "text-black bg-transparent border-none p-0",
              pre: "font-medium text-black font-sans text-[14px]",
            }}
          >
            {participant.code ?? "-"}
          </Snippet>
        );
      case "university":
        return (
          <div className="font-medium text-black">{participant.university}</div>
        );
      case "status":
        return (
          <div className="w-max">
            <Chip
              variant="flat"
              size="sm"
              color={participant.is_approved ? "success" : "warning"}
              startContent={
                participant.is_approved ? (
                  <CheckCircle weight="duotone" size={18} />
                ) : (
                  <ClockCountdown weight="duotone" size={18} />
                )
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-bold capitalize",
              }}
            >
              {participant.is_approved ? "Mengikuti" : "Menunggu konfirmasi"}
            </Chip>
          </div>
        );
      case "joined_status":
        return (
          <div className="w-max">
            <Chip
              variant="flat"
              size="sm"
              color={participant.joined_at ? "success" : "danger"}
              startContent={
                participant.joined_at ? (
                  <CheckCircle weight="duotone" size={18} />
                ) : (
                  <XCircle weight="duotone" size={18} />
                )
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-bold capitalize",
              }}
            >
              {participant.joined_at ? "Mengikuti" : "Belum Mengikuti"}
            </Chip>
          </div>
        );
      case "joined_at":
        return (
          <div className="w-max font-medium text-black">
            {participant.joined_at ? formatDate(participant.joined_at) : "-"}
          </div>
        );
      case "action":
        return (
          <div className="flex max-w-max items-center gap-2">
            {!(data?.data.type === "paid" || participant?.is_approved) && (
              <ModalJoiningRequirement
                {...{
                  program_id: data?.data.program_id as string,
                  participant: participant,
                  token: token as string,
                  mutate,
                }}
              />
            )}

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Partisipan">
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={
                <h1 className="font-bold text-black">Hapus Partisipan</h1>
              }
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus partisipan{" "}
                    <strong className="font-extrabold text-danger">
                      {participant.fullname}
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
                    className="font-semibold"
                    onClick={() =>
                      handleDeleteParticipant(
                        data?.data.program_id,
                        participant.user_id,
                      )
                    }
                  >
                    Ya, Hapus Partisipan
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

  async function handleDeleteParticipant(
    program_id: string | undefined,
    user_id: string,
  ) {
    try {
      await fetcher({
        url: `/admin/programs/unfollow/${program_id}/${user_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Berhasil menghapus partisipan");
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menghapus partisipan, silakan coba lagi");
    }
  }

  // async function handleExportDataParticipant() {
  //   try {
  //     const response: SuccessResponse<any[]> = await fetcher({
  //       url: `/admin/exports/codes/${data?.data.program_id}`,
  //       method: "GET",
  //       token,
  //     });

  //     const { data: item } = response;
  //     const headers = Object.keys(item[0]);

  //     const worksheetData = [headers, ...item.map((row) => Object.values(row))];
  //     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Data Partisipan");

  //     const dateExport = new Date();
  //     const fileName = `Data Kode Akses Program ${data?.data.title} - ${formatDate(dateExport.toLocaleString())}.xlsx`;
  //     XLSX.writeFile(workbook, fileName);
  //     toast.success("Data partisipan berhasil diexport 🎉");
  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error("Uh oh! terjadi kesalahan, silakan ulangi 😵");
  //   }
  // }

  if (error) {
    return (
      <Layout title={`${data?.data.title}`}>
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

  return (
    <Layout title={`${data?.data.title}`}>
      <Container className="gap-8">
        <ButtonBack />

        <div className="grid" ref={divRef}>
          <h4 className="mb-2 text-2xl font-bold -tracking-wide text-black">
            Daftar Partisipan: {data?.data.title}🧑🏻‍🤝‍🧑🏻
          </h4>

          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white py-4">
            <SearchInput
              placeholder="Cari Nama Partisipan atau ID Partisipan..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Select
              variant="flat"
              startContent={
                <Funnel weight="duotone" size={18} className="text-gray" />
              }
              size="md"
              placeholder="Sort"
              selectedKeys={[sort]}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="joined_at.desc">Terbaru</SelectItem>
              <SelectItem key="joined_at.asc">Terlama</SelectItem>
            </Select>

            {data?.data.type === "paid" && (
              <div className="inline-flex items-center gap-4">
                <ModalAddParticipant
                  {...{
                    by:
                      session.status === "authenticated"
                        ? session.data.user.fullname
                        : "",
                    token: token as string,
                    program_id: data?.data.program_id as string,
                    mutate,
                  }}
                />
              </div>
            )}
          </div>

          <Table
            isStriped
            aria-label="users table"
            color="secondary"
            selectionMode="none"
            classNames={customStyleTable}
            className="scrollbar-hide"
          >
            <TableHeader columns={columnsParticipantDefault}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={data?.data.participants || []}
              emptyContent={<EmptyData text="Partisipan tidak ditemukan!" />}
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." color="secondary" />}
            >
              {(participant: Participant) => (
                <TableRow key={participant.user_id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCellParticipants(participant, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {!isLoading && data?.data.participants.length ? (
            <Pagination
              isCompact
              showControls
              page={data?.data.page}
              total={data?.data.total_pages}
              onChange={(e) => {
                setPage(`${e}`);
                divRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              classNames={{
                wrapper: "mt-4 justify-self-center",
                cursor: "bg-purple text-white",
              }}
            />
          ) : null}
        </div>
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
