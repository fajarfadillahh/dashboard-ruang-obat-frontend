import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import ErrorPage from "@/components/ErrorPage";
import ModalAddParticipant from "@/components/modal/ModalAddParticipant";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import ModalJoiningRequirement from "@/components/modal/ModalJoiningRequirement";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import usePagination from "@/hooks/usePagination";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { ParticipantType, UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Button,
  Chip,
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
  BookBookmark,
  Certificate,
  Check,
  CheckCircle,
  ClockCountdown,
  Copy,
  MagnifyingGlass,
  Notepad,
  Plus,
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

type DetailsProgramType = {
  program_id: string;
  title: string;
  type: string;
  price: number;
  is_active: boolean;
  total_tests: number;
  total_users: number;
  tests: TestType[];
  participants: ParticipantType[];
};

type UsersType = {
  users: UserType[];
  total_users: number;
  total_pages: number;
};

export default function DetailsProgramPage({
  program,
  users,
  token,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const { data, page, pages, setPage } = usePagination(
    program?.participants as ParticipantType[],
    10,
  );

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
          <div className="w-max font-medium text-black">
            {participant.fullname}
          </div>
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
          <div className="w-max font-medium text-black">
            {participant.university}
          </div>
        );
      case "status":
        return (
          <div className="w-max">
            <Chip
              variant="flat"
              size="sm"
              color="warning"
              startContent={
                <ClockCountdown
                  weight="fill"
                  size={18}
                  className="text-warning"
                />
              }
              classNames={{
                base: "px-2 gap-1",
                content: "font-semibold capitalize",
              }}
            >
              Menunggu konfirmasi
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
            {program?.type === "free" ? (
              <ModalJoiningRequirement
                program_id={program.program_id}
                participant={participant}
                token={`${token}`}
              />
            ) : null}

            <ModalConfirmDelete
              id={participant.user_id}
              header="Partisipan"
              title={participant.fullname}
              handleDelete={() =>
                handleDeleteParticipant(
                  program?.program_id,
                  participant.user_id,
                )
              }
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

      window.location.reload();
    } catch (error) {
      toast.error("Gagal Menghapus Partisipan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  if (error) {
    return (
      <Layout title={`${program?.title}`}>
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

  const filterParticipants = data.length
    ? data.filter(
        (participant) =>
          participant.user_id.toLowerCase().includes(search.toLowerCase()) ||
          participant.fullname.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <Layout title={`${program?.title}`}>
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="flex items-start gap-6 pb-8">
              <BookBookmark weight="bold" size={56} className="text-purple" />

              <div className="grid gap-4">
                <h4 className="max-w-[700px] text-[28px] font-bold leading-[120%] -tracking-wide text-black">
                  {program?.title}
                </h4>

                <div className="flex items-center gap-12">
                  {program?.type === "free" ? (
                    <Chip
                      variant="flat"
                      color="default"
                      startContent={
                        <Tag weight="bold" size={18} className="text-black" />
                      }
                      classNames={{
                        base: "px-3 gap-1",
                        content: "font-bold text-black",
                      }}
                    >
                      Gratis
                    </Chip>
                  ) : program?.price ? (
                    <h5 className="font-extrabold text-purple">
                      {formatRupiah(program?.price)}
                    </h5>
                  ) : null}

                  <div className="inline-flex items-center gap-1 text-gray">
                    <Certificate weight="bold" size={18} />
                    <p className="text-sm font-bold">
                      ID: {program?.program_id}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 text-gray">
                    <Notepad weight="bold" size={18} />
                    <p className="text-sm font-bold">
                      {program?.total_tests} Modul Ujian
                    </p>
                  </div>

                  <Chip
                    variant="flat"
                    color={program?.is_active ? "success" : "danger"}
                    startContent={
                      program?.is_active ? (
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
                    {program?.is_active
                      ? "Program Aktif"
                      : "Program Tidak Aktif"}
                  </Chip>
                </div>
              </div>
            </div>

            <div className="grid gap-4 py-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Ujian 📋
              </h4>

              <div className="grid gap-2">
                {program?.tests.map((test: TestType) => (
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
                  classNames={{
                    input:
                      "font-semibold placeholder:font-semibold placeholder:text-gray",
                  }}
                  className={
                    program?.type === "paid" ? "flex-1" : "max-w-[500px]"
                  }
                  onChange={(e) => setSearch(e.target.value)}
                />

                {program?.type === "paid" ? (
                  <Button
                    variant="solid"
                    color="secondary"
                    startContent={<Plus weight="bold" size={18} />}
                    onPress={() => setIsModalOpen(true)}
                    className="w-max font-bold"
                  >
                    Tambah Partisipan
                  </Button>
                ) : null}

                <ModalAddParticipant
                  users={users}
                  session={`${session.data?.user.fullname}`}
                  token={`${token}`}
                  program_id={`${program?.program_id}`}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>

              <div className="overflow-x-scroll">
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
                      program?.type === "paid"
                        ? columnsParticipantPaid
                        : columnsParticipantFree
                    }
                  >
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody
                    items={filterParticipants}
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

              {filterParticipants.length ? (
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
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  program?: DetailsProgramType;
  users?: UsersType;
  token?: string;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const [responseProgram, responseUsers] = await Promise.all([
      fetcher({
        url: `/admin/programs/${encodeURIComponent(params?.id as string)}`,
        method: "GET",
        token,
      }) as Promise<SuccessResponse<DetailsProgramType>>,

      fetcher({
        url: "/admin/users",
        method: "GET",
        token,
      }) as Promise<SuccessResponse<UsersType>>,
    ]);

    return {
      props: {
        program: responseProgram.data,
        users: responseUsers.data,
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
