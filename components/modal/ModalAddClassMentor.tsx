import SearchInput from "@/components/SearchInput";
import useSearch from "@/hooks/useSearch";
import { ClassMentorType } from "@/types/classmentor.type";
import { SuccessResponse } from "@/types/global.type";
import { Mentor } from "@/types/mentor.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { KeyedMutator } from "swr";

type ModalAddClassMentorProps = {
  token: string;
  by: string;
  mutate: KeyedMutator<any>;
  type: ClassMentorType;
};

type MentorsResponse = {
  mentors: Mentor[];
  page: number;
  total_mentors: number;
  total_pages: number;
};

export default function ModalAddClassMentor({
  token,
  by,
  mutate,
  type,
}: ModalAddClassMentorProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setSearch, searchValue } = useSearch(800);
  const [mentors, setMentors] = useState<MentorsResponse>();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState(false);

  async function fetchMentors(url: string) {
    try {
      const response: SuccessResponse<MentorsResponse> = await fetcher({
        url,
        method: "GET",
        token,
      });

      setMentors(response.data);
    } catch (error: any) {
      console.error("Error fetching mentors:", error);

      toast.error(getError(error));
    }
  }

  useEffect(() => {
    if (searchValue || page) {
      fetchMentors(`/admin/mentors?q=${searchValue}&page=${page}`);
    }
  }, [searchValue, page]);

  useEffect(() => {
    if (isOpen) {
      fetchMentors(`/admin/mentors?page=1`);
    }
  }, [isOpen]);

  async function handleAddMentor() {
    setLoading(true);

    try {
      await fetcher({
        url: "/admin/classmentor",
        method: "POST",
        token,
        data: {
          type,
          mentors: Array.from(value),
          by,
        },
      });

      mutate();
      toast.success("Berhasil menambahkan mentor");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  const columnsMentors = [
    { name: "ID Mentor", uid: "mentor_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Mentor", uid: "mentor_title" },
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
          <div className="font-medium text-black">{mentor.mentor_title}</div>
        );

      default:
        return cellValue;
    }
  }

  return (
    <>
      <Button
        color="secondary"
        startContent={<Plus weight="bold" size={18} />}
        onClick={onOpen}
        className="w-max font-bold"
      >
        Tambah Mentor
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        onClose={() => {
          setPage(1);
          setValue(new Set([]));
          setSearch("");
          setLoading(false);
        }}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Daftar Mentor
              </ModalHeader>

              <ModalBody className="scrollbar-hide">
                <div className="grid gap-6">
                  <p className="max-w-[500px] text-sm font-medium leading-[170%] text-gray">
                    Cari mentor untuk ditambahkan pada program ini, pastikan ID
                    mentor atau nama yang anda cari sudah benar!
                  </p>

                  <div className="grid gap-4">
                    <SearchInput
                      placeholder="Cari ID Mentor atau Nama Mentor"
                      onChange={(e) => setSearch(e.target.value)}
                      onClear={() => setSearch("")}
                    />

                    <div className="max-h-[300px] overflow-x-scroll scrollbar-hide">
                      <Table
                        isHeaderSticky
                        aria-label="mentors table"
                        color="secondary"
                        selectionMode="multiple"
                        selectedKeys={value}
                        onSelectionChange={setValue}
                        classNames={customStyleTable}
                        className="scrollbar-hide"
                      >
                        <TableHeader columns={columnsMentors}>
                          {(column) => (
                            <TableColumn key={column.uid}>
                              {column.name}
                            </TableColumn>
                          )}
                        </TableHeader>

                        <TableBody
                          items={mentors?.mentors ? mentors?.mentors : []}
                          emptyContent={
                            <span className="text-sm font-semibold italic text-gray">
                              Mentor tidak ditemukan!
                            </span>
                          }
                        >
                          {(item: Mentor) => (
                            <TableRow key={item.mentor_id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderCellMentors(item, columnKey)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {mentors?.mentors.length ? (
                      <Pagination
                        isCompact
                        showControls
                        page={mentors?.page as number}
                        total={mentors?.total_pages as number}
                        onChange={(e) => setPage(e)}
                        className="justify-self-center"
                        classNames={{
                          cursor: "bg-purple text-white",
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setPage(1);
                    setValue(new Set([]));
                    setSearch("");
                  }}
                  className="font-bold"
                >
                  Tutup
                </Button>

                <Button
                  isLoading={loading}
                  color="secondary"
                  onClick={() => {
                    handleAddMentor();
                    onClose();
                  }}
                  className="font-bold"
                >
                  Tambah Mentor
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
