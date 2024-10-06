import ButtonBack from "@/components/button/ButtonBack";
import CardTest from "@/components/card/CardTest";
import ErrorPage from "@/components/ErrorPage";
import ModalAddParticipant from "@/components/modal/ModalAddParticipant";
import ModalConfirmDelete from "@/components/modal/ModalConfirmDelete";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { ParticipantType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Chip,
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
  Copy,
  Notepad,
  Tag,
  XCircle,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

export default function DetailsProgramPage({
  programs,
  users,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const columnsParticipant = [
    { name: "ID Partisipan", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Kode Akses", uid: "code" },
    { name: "Asal Kampus", uid: "university" },
    { name: "Status", uid: "joined_status" },
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
      case "joined_status":
        return (
          <div className="w-max font-medium text-black">
            <Chip
              variant="flat"
              size="sm"
              color={participant.joined_at ? "success" : "danger"}
              startContent={
                participant.joined_at ? (
                  <CheckCircle
                    weight="fill"
                    size={16}
                    className="text-success"
                  />
                ) : (
                  <XCircle weight="fill" size={16} className="text-danger" />
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
            {formatDate(participant.joined_at)}
          </div>
        );
      case "action":
        return (
          <div className="grid w-[60px]">
            <ModalConfirmDelete
              id={participant.user_id}
              header="Partisipan"
              title={participant.fullname}
              handleDelete={handleDeleteParticipant}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  function handleDeleteParticipant(id: string) {
    console.log(`Partisipan dengan ID: ${id} berhasil terhapus!`);
  }

  if (error) {
    return (
      <Layout title={`${programs.title}`}>
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
    <Layout title={`${programs.title}`}>
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="flex items-start gap-6 pb-8">
              <BookBookmark weight="bold" size={56} className="text-purple" />

              <div className="grid gap-4">
                <h4 className="max-w-[700px] text-[28px] font-bold leading-[120%] -tracking-wide text-black">
                  {programs.title}
                </h4>

                <div className="flex items-center gap-12">
                  {programs.type === "free" ? (
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
                  ) : (
                    <h5 className="font-extrabold text-purple">
                      {formatRupiah(programs.price)}
                    </h5>
                  )}

                  <div className="inline-flex items-center gap-1 text-gray">
                    <Certificate weight="bold" size={18} />
                    <p className="text-sm font-bold">
                      ID: {programs.program_id}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 text-gray">
                    <Notepad weight="bold" size={18} />
                    <p className="text-sm font-bold">
                      {programs.total_tests} Modul Ujian
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 py-8">
              <h4 className="text-[20px] font-bold -tracking-wide text-black">
                Daftar Ujian 📋
              </h4>

              <div className="grid gap-2">
                {programs.tests.map((test: TestType) => (
                  <CardTest key={test.test_id} test={test} />
                ))}
              </div>
            </div>

            <div className="grid gap-4 pt-8">
              <div className="flex items-end justify-between gap-4">
                <h4 className="text-[20px] font-bold -tracking-wide text-black">
                  Daftar Partisipan 🧑🏻‍🤝‍🧑🏻
                </h4>

                <ModalAddParticipant users={users} />
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
                  <TableHeader columns={columnsParticipant}>
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody
                    items={programs.participants}
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
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  programs?: any;
  users?: any;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const [responsePrograms, responseUsers] = await Promise.all([
      fetcher({
        url: `/admin/programs/${encodeURIComponent(params?.id as string)}`,
        method: "GET",
        token,
      }),
      fetcher({
        url: `/admin/users`,
        method: "GET",
        token,
      }),
    ]);

    return {
      props: {
        programs: responsePrograms.data,
        users: responseUsers.data,
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
