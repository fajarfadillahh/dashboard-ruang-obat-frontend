import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import ModalAddParticipant from "@/components/modal/ModalAddParticipant";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalJoiningRequirement from "@/components/modal/ModalJoiningRequirement";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { ParticipantType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Button,
  Chip,
  Image,
  Input,
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
  Check,
  CheckCircle,
  ClockCountdown,
  Copy,
  ImageBroken,
  MagnifyingGlass,
  Notepad,
  Tag,
  Trash,
  Users,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type DetailsProgramResponse = {
  program_id: string;
  title: string;
  type: string;
  price: number;
  is_active: boolean;
  qr_code: string;
  url_qr_code: string;
  total_tests: number;
  total_users: number;
  page: number;
  total_participants: number;
  total_approved_users: number;
  total_pages: number;
  tests: TestType[];
  participants: ParticipantType[];
};

export default function DetailsProgramPage({
  token,
  id,
  params,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailsProgramResponse>
  >({
    url: getUrlParticipant(query, params?.id as string),
    method: "GET",
    token,
  });
  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, 800);

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
    participant: ParticipantType,
    columnKey: React.Key,
  ) {
    const cellValue = participant[columnKey as keyof ParticipantType];

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
                content: "font-semibold capitalize",
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
                content: "font-semibold capitalize",
              }}
            >
              {participant.joined_at ? "Mengikuti" : "Belum Mengikuti"}
            </Chip>
          </div>
        );
      case "joined_at":
        return (
          <div className="w-max font-medium text-black">
            {participant.joined_at === null
              ? "-"
              : formatDate(participant.joined_at)}
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
                  token: `${token}`,
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
      toast.success("Berhasil Menghapus Partisipan");
    } catch (error) {
      toast.error("Gagal Menghapus Partisipan, Silakan Coba Lagi");
      console.error(error);
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
            <div className="inline-flex items-end gap-12 pb-8">
              {data?.data.qr_code ? (
                <div className="grid gap-2">
                  <Image
                    src={`${data?.data.qr_code}`}
                    alt="qrcode image"
                    width={130}
                    height={130}
                    className="aspect-square rounded-xl object-cover object-center"
                  />

                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(data.data.url_qr_code, "_blank");
                    }}
                    className="w-max justify-self-center text-sm font-bold leading-[170%] text-purple underline"
                  >
                    Link Join Grup!
                  </Link>
                </div>
              ) : (
                <div className="flex aspect-square size-[130px] flex-col items-center justify-center gap-2 rounded-xl bg-gray/10">
                  <ImageBroken
                    weight="bold"
                    size={28}
                    className="text-gray/50"
                  />
                  <p className="text-[12px] font-bold text-gray/50">
                    Belum ada QR!
                  </p>
                </div>
              )}

              <div className="grid w-max">
                <h4 className="max-w-[700px] text-[28px] font-bold leading-[120%] -tracking-wide text-black">
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
                          <Tag weight="bold" size={16} className="text-black" />
                        }
                        classNames={{
                          base: "px-2 gap-1",
                          content: "font-bold text-black",
                        }}
                      >
                        Gratis
                      </Chip>
                    ) : data?.data.price ? (
                      <h5 className="font-extrabold text-purple">
                        {formatRupiah(data?.data.price)}
                      </h5>
                    ) : null}

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
                      <p className="text-[12px] font-medium text-gray">
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
                      <p className="text-[12px] font-medium text-gray">
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
                      <p className="text-[12px] font-medium text-gray">
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

            <div className="grid gap-4 py-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Ujian 📋
              </h4>

              <div className="grid gap-2">
                {data?.data.tests.map((test: TestType) => (
                  <CardTest key={test.test_id} test={test} />
                ))}
              </div>
            </div>

            <div className="grid gap-4 pt-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Partisipan 🧑🏻‍🤝‍🧑🏻
              </h4>

              <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white">
                <Input
                  type="text"
                  variant="flat"
                  labelPlacement="outside"
                  placeholder="Cari User ID atau Nama User"
                  startContent={
                    <MagnifyingGlass
                      weight="bold"
                      size={18}
                      className="text-gray"
                    />
                  }
                  defaultValue={query.q as string}
                  onChange={(e) => setSearch(e.target.value)}
                  classNames={{
                    input:
                      "font-semibold placeholder:font-semibold placeholder:text-gray",
                  }}
                  className={
                    data?.data.type === "paid" ? "flex-1" : "max-w-[500px]"
                  }
                />

                {data?.data.type === "paid" ? (
                  <ModalAddParticipant
                    {...{
                      by:
                        status == "authenticated" ? session.user.fullname : "",
                      token: token as string,
                      program_id: data?.data.program_id as string,
                      mutate,
                    }}
                  />
                ) : null}
              </div>

              <div className="overflow-x-scroll scrollbar-hide">
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
                      <span className="text-sm font-semibold italic text-gray">
                        Partisipan tidak ditemukan!
                      </span>
                    }
                  >
                    {(item: ParticipantType) => (
                      <TableRow key={item.user_id}>
                        {(columnKey) => (
                          <TableCell>
                            {renderCellParticipants(item, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

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
                        ...router.query, // keep existing query params
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
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

function getUrlParticipant(query: ParsedUrlQuery, id: string) {
  if (query.q) {
    return `/admin/programs/${encodeURIComponent(id)}?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/programs/${encodeURIComponent(id)}?page=${query.page ? query.page : 1}`;
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
