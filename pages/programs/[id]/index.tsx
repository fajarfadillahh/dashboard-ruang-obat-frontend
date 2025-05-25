import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalAddParticipant from "@/components/modal/ModalAddParticipant";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalJoiningRequirement from "@/components/modal/ModalJoiningRequirement";
import SearchInput from "@/components/SearchInput";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { DetailsProgramResponse } from "@/types/program.type";
import { Test } from "@/types/test.type";
import { Participant } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Button,
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
  CheckCircle,
  ClockCountdown,
  Copy,
  Export,
  ImageBroken,
  PencilLine,
  Tag,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import * as XLSX from "xlsx";

export default function DetailsProgramPage({
  token,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsProgramResponse>
  >({
    url: getUrl(`/admin/programs/${encodeURIComponent(id)}`, query),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({
        pathname: `/programs/${id}`,
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push(`/programs/${id}`);
    }
  }, [searchValue]);

  const columnsParticipantPaid = [
    { name: "ID Partisipan", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Kode Akses", uid: "code" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Status", uid: "joined_status" },
    { name: "Bergabung Pada", uid: "joined_at" },
    { name: "Aksi", uid: "action" },
  ];

  const columnsParticipantFree = [
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
                    <strong className="font-extrabold text-purple">
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

  async function handleExportDataParticipant() {
    try {
      const response: SuccessResponse<any[]> = await fetcher({
        url: `/admin/exports/codes/${data?.data.program_id}`,
        method: "GET",
        token,
      });

      const { data: item } = response;
      const headers = Object.keys(item[0]);

      const worksheetData = [headers, ...item.map((row) => Object.values(row))];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Partisipan");

      const dateExport = new Date();
      const fileName = `Data Kode Akses Program ${data?.data.title} - ${formatDate(dateExport.toLocaleString())}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success("Data partisipan berhasil diexport 🎉");
    } catch (error: any) {
      console.error(error);
      toast.error("Uh oh! terjadi kesalahan, silakan ulangi 😵");
    }
  }

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

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title={`${data?.data.title}`}>
      <Container>
        <ButtonBack href="/programs" />

        <div className="mt-8 grid gap-16">
          {/* main data program */}
          <div className="flex items-end gap-8">
            <div className="grid flex-1 grid-cols-[max-content_1fr] items-end gap-6">
              {/* cover image */}
              <div className="group relative isolate aspect-square size-[180px] overflow-hidden rounded-xl border-2 border-dashed border-gray/20 p-1">
                {data?.data.qr_code ? (
                  <Image
                    src={data?.data.qr_code as string}
                    alt="qrcode image"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="aspect-square rounded-lg object-cover object-center"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center rounded-lg bg-gray/20">
                    <ImageBroken
                      weight="duotone"
                      size={28}
                      className="text-gray"
                    />

                    <p className="text-sm font-semibold text-gray">
                      Belum ada QR!
                    </p>
                  </div>
                )}

                {/* overlay */}
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(data?.data.url_qr_code, "_blank");
                  }}
                  className="absolute left-0 top-0 hidden size-full items-center justify-center bg-purple/50 text-sm font-semibold text-white backdrop-blur-md group-hover:flex"
                >
                  Lihat Grup Program
                </Link>
              </div>

              {/* data program */}
              <div className="grid gap-8">
                <div className="grid gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={data?.data.is_active ? "success" : "danger"}
                    startContent={
                      data?.data.is_active ? (
                        <CheckCircle weight="duotone" size={18} />
                      ) : (
                        <XCircle weight="duotone" size={18} />
                      )
                    }
                    classNames={{
                      base: "px-2 gap-1",
                      content: "font-bold",
                    }}
                  >
                    {data?.data.is_active
                      ? "Program Aktif"
                      : "Program Tidak Aktif"}
                  </Chip>

                  <h1 className="text-2xl font-bold -tracking-wide text-black">
                    {data?.data.title}
                  </h1>
                </div>

                <div className="flex items-start gap-6">
                  {[
                    [
                      "harga program",
                      data?.data.type === "free" ? (
                        <Chip
                          variant="flat"
                          color="default"
                          startContent={<Tag weight="duotone" size={18} />}
                          classNames={{
                            base: "px-2 gap-1",
                            content: "font-bold text-black",
                          }}
                        >
                          Gratis
                        </Chip>
                      ) : (
                        formatRupiah(data?.data.price as number)
                      ),
                    ],
                    ["jumlah ujian", data?.data.total_tests],
                    ["total partisipan", data?.data.total_participants],
                    ["approved partisipan", data?.data.total_approved_users],
                    [
                      "pending partisipan",
                      (data?.data.total_users ?? 0) -
                        (data?.data.total_approved_users ?? 0),
                    ],
                  ].map(([label, value], index) => (
                    <div key={index} className="grid gap-1">
                      <span className="text-xs font-medium capitalize text-gray">
                        {label}:
                      </span>

                      <h2 className="font-extrabold text-black">{value}</h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="light"
              color="secondary"
              startContent={<PencilLine weight="duotone" size={18} />}
              onClick={() =>
                router.push(`/programs/${data?.data.program_id}/edit`)
              }
              className="font-semibold"
            >
              Edit Program
            </Button>
          </div>

          {/* data list tests */}
          <div className="grid gap-4">
            <h4 className="text-xl font-bold -tracking-wide text-black">
              Daftar Ujian 📋
            </h4>

            <div className="grid gap-2">
              {data?.data.tests.map((test: Test) => (
                <CardTest
                  key={test.test_id}
                  test={test}
                  token={token as string}
                  mutate={mutate}
                />
              ))}
            </div>
          </div>

          {/* data list participants */}
          <div className="grid">
            <h4 className="text-xl font-bold -tracking-wide text-black">
              Daftar Partisipan 🧑🏻‍🤝‍🧑🏻
            </h4>

            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white py-4">
              <SearchInput
                placeholder="Cari Nama Partisipan atau ID Partisipan..."
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

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

                  <Button
                    isIconOnly
                    isDisabled={data?.data.participants.length <= 0}
                    variant="light"
                    color="secondary"
                    onClick={handleExportDataParticipant}
                  >
                    <CustomTooltip content="Export Data Partisipan">
                      <Export weight="duotone" size={18} />
                    </CustomTooltip>
                  </Button>
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
              <TableHeader
                columns={
                  data?.data.type === "paid"
                    ? columnsParticipantPaid
                    : columnsParticipantFree
                }
              >
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.participants}
                emptyContent={<EmptyData text="Partisipan tidak ditemukan!" />}
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

            {data?.data.participants.length ? (
              <Pagination
                isCompact
                showControls
                page={data?.data.page}
                total={data?.data.total_pages}
                onChange={(e) => {
                  router.push({
                    pathname: `/programs/${id}`,
                    query: {
                      ...router.query,
                      page: e,
                    },
                  });
                }}
                classNames={{
                  wrapper: "mt-4 justify-self-center",
                  cursor: "bg-purple text-white",
                }}
              />
            ) : null}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;
  const query = ctx.query;

  return {
    props: {
      query,
      id,
    },
  };
});
