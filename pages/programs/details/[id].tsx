import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
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
  Tooltip,
} from "@nextui-org/react";
import {
  Check,
  CheckCircle,
  ClockCountdown,
  Copy,
  Export,
  ImageBroken,
  Notepad,
  PencilLine,
  Tag,
  Trash,
  Users,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import * as XLSX from "xlsx";

function getUrlParticipant(query: ParsedUrlQuery, id: string) {
  if (query.q) {
    return `/admin/programs/${encodeURIComponent(id)}?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/programs/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
}

export default function DetailsProgramPage({
  token,
  id,
  params,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsProgramResponse>
  >({
    url: getUrlParticipant(query, params?.id as string),
    method: "GET",
    token,
  });

  useEffect(() => {
    if (searchValue) {
      router.push({
        pathname: `/programs/details/${id}`,
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push(`/programs/details/${id}`);
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
                  <CheckCircle
                    weight="fill"
                    size={18}
                    className="text-success"
                  />
                ) : (
                  <ClockCountdown
                    weight="fill"
                    size={18}
                    className="text-warning"
                  />
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
                  <CheckCircle
                    weight="fill"
                    size={18}
                    className="text-success"
                  />
                ) : (
                  <XCircle weight="fill" size={18} className="text-danger" />
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
                  <Trash weight="bold" size={18} className="text-danger" />
                </Button>
              }
              header={
                <h1 className="font-bold text-black">Hapus Partisipan</h1>
              }
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus partisipan berikut secara
                    permanen?
                  </p>

                  <div className="grid gap-1">
                    {[
                      ["ID Partisipan", `${participant?.user_id}`],
                      ["Nama Lengkap", `${participant?.fullname}`],
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
                    onClick={() =>
                      handleDeleteParticipant(
                        data?.data.program_id,
                        participant?.user_id,
                      )
                    }
                    className="font-bold"
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
        <section className="grid gap-8">
          <ButtonBack href="/programs" />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="flex items-center justify-between gap-12">
              <div className="inline-flex flex-1 items-end gap-12 pb-8">
                {data?.data.qr_code ? (
                  <div className="group relative overflow-hidden rounded-xl">
                    <Image
                      src={data?.data.qr_code as string}
                      alt="qrcode image"
                      width={160}
                      height={160}
                      loading="lazy"
                      className="aspect-square object-cover object-center"
                    />

                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(data.data.url_qr_code, "_blank");
                      }}
                      className="absolute left-0 top-0 hidden h-full w-full items-center justify-center bg-purple text-sm font-semibold text-white backdrop-blur-sm group-hover:flex"
                    >
                      Klik Link Grup!
                    </Link>
                  </div>
                ) : (
                  <div className="flex aspect-square size-[160px] flex-col items-center justify-center gap-2 rounded-xl bg-gray/10">
                    <ImageBroken
                      weight="bold"
                      size={28}
                      className="text-gray/50"
                    />
                    <p className="text-xs font-bold text-gray/50">
                      Belum ada QR!
                    </p>
                  </div>
                )}

                <div className="grid w-max">
                  <h4 className="max-w-[700px] text-2xl font-bold leading-[120%] -tracking-wide text-black">
                    {data?.data.title}
                  </h4>

                  <div className="grid grid-rows-2 divide-y-2 divide-dashed divide-gray/10">
                    <div className="grid grid-cols-3 items-end gap-12 pb-4">
                      {data?.data.type === "free" ? (
                        <Chip
                          variant="flat"
                          color="default"
                          size="sm"
                          startContent={
                            <Tag
                              weight="fill"
                              size={16}
                              className="text-black"
                            />
                          }
                          classNames={{
                            base: "px-2 gap-1",
                            content: "font-bold text-black",
                          }}
                        >
                          Gratis
                        </Chip>
                      ) : (
                        <h5 className="font-extrabold text-purple">
                          {formatRupiah(data?.data.price as number)}
                        </h5>
                      )}

                      <div className="inline-flex items-center gap-1 text-gray">
                        <Notepad weight="bold" size={18} />
                        <p className="text-sm font-bold">
                          {data?.data.total_tests} Ujian
                        </p>
                      </div>

                      <Chip
                        variant="flat"
                        color={data?.data.is_active ? "success" : "danger"}
                        size="sm"
                        startContent={
                          data?.data.is_active ? (
                            <CheckCircle weight="fill" size={16} />
                          ) : (
                            <XCircle weight="fill" size={16} />
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
                    </div>

                    <div className="grid grid-cols-3 items-end gap-12 pt-2">
                      <div>
                        <p className="text-xs font-medium text-gray">
                          Total Partisipan:
                        </p>

                        <div className="inline-flex items-center gap-1 text-gray">
                          <Users weight="bold" size={18} />
                          <p className="text-sm font-bold">
                            {data?.data.total_users}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray">
                          Approved Partisipan:
                        </p>

                        <div className="inline-flex items-center gap-1 text-gray">
                          <Users weight="bold" size={18} />
                          <p className="text-sm font-bold">
                            {data?.data.total_approved_users}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray">
                          Pending Partisipan:
                        </p>

                        <div className="inline-flex items-center gap-1 text-gray">
                          <Users weight="bold" size={18} />
                          <p className="text-sm font-bold">
                            {(data?.data.total_users ?? 0) -
                              (data?.data.total_approved_users ?? 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                color="secondary"
                startContent={<PencilLine weight="bold" size={18} />}
                onClick={() =>
                  router.push(`/programs/edit/${data?.data.program_id}`)
                }
                className="font-bold"
              >
                Edit Program
              </Button>
            </div>

            <div className="grid gap-4 py-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
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

            <div className="grid pt-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Partisipan 🧑🏻‍🤝‍🧑🏻
              </h4>

              <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white py-4">
                <SearchInput
                  placeholder="Cari Partisipan ID atau Nama Partisipan"
                  defaultValue={query.q as string}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch("")}
                />

                {data?.data.type === "paid" && (
                  <div className="inline-flex items-center gap-2">
                    <ModalAddParticipant
                      {...{
                        by:
                          status === "authenticated"
                            ? session.user.fullname
                            : "",
                        token: token as string,
                        program_id: data?.data.program_id as string,
                        mutate,
                      }}
                    />

                    <Tooltip
                      content="Export Data Partisipan"
                      classNames={{
                        content: "max-w-[350px] font-semibold text-black",
                      }}
                    >
                      <Button
                        isIconOnly
                        isDisabled={data?.data.participants.length <= 0}
                        variant="ghost"
                        color="secondary"
                        onClick={handleExportDataParticipant}
                      >
                        <Export weight="bold" size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>

              <Table
                isHeaderSticky
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
                  emptyContent={
                    <EmptyData text="Partisipan tidak ditemukan!" />
                  }
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
                      pathname: `/programs/details/${id}`,
                      query: {
                        ...router.query,
                        page: e,
                      },
                    });
                  }}
                  className="mt-4 justify-self-center"
                  classNames={{
                    cursor: "bg-purple text-white",
                  }}
                />
              ) : null}
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  id: string;
  params: ParsedUrlQuery;
  query: ParsedUrlQuery;
}> = async ({ req, params, query }) => {
  const id = params?.id as string;

  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
      query,
      id,
    },
  };
};
