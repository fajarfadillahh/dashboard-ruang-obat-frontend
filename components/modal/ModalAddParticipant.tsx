import SearchInput from "@/components/SearchInput";
import useSearch from "@/hooks/useSearch";
import { SuccessResponse } from "@/types/global.type";
import { User } from "@/types/user.type";
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

type ModalAddParticipantProps = {
  token: string;
  by: string;
  program_id: string;
  mutate: KeyedMutator<any>;
};

type UsersResponse = {
  users: User[];
  page: number;
  total_users: number;
  total_pages: number;
};

export default function ModalAddParticipant({
  token,
  by,
  program_id,
  mutate,
}: ModalAddParticipantProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setSearch, searchValue } = useSearch(800);
  const [users, setUsers] = useState<UsersResponse>();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState(false);

  async function fetchUsers(url: string) {
    try {
      const response: SuccessResponse<UsersResponse> = await fetcher({
        url,
        method: "GET",
        token,
      });

      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);

      toast.error(getError(error));
    }
  }

  useEffect(() => {
    if (searchValue || page) {
      fetchUsers(`/admin/users?q=${searchValue}&page=${page}`);
    }
  }, [searchValue, page]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers(`/admin/users?page=1`);
    }
  }, [isOpen]);

  async function handleInviteParticipant() {
    setLoading(true);

    try {
      const payload = {
        program_id,
        users: Array.from(value),
        by,
      };

      await fetcher({
        url: "/admin/programs/invite",
        method: "POST",
        token,
        data: payload,
      });

      mutate();
      toast.success("Berhasil menambahkan partisipan");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
  ];

  function renderCellUsers(user: User, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{user.user_id}</div>
        );
      case "fullname":
        return <div className="font-medium text-black">{user.fullname}</div>;

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
        Tambah Partisipan
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
                Daftar Pengguna
              </ModalHeader>

              <ModalBody className="scrollbar-hide">
                <div className="grid gap-6">
                  <p className="max-w-[500px] text-sm font-medium leading-[170%] text-gray">
                    Cari pengguna untuk ditambahkan pada program ini, pastikan
                    ID pengguna yang anda cari sudah benar!
                  </p>

                  <div className="grid gap-4">
                    <SearchInput
                      placeholder="Cari User ID atau Nama User"
                      onChange={(e) => setSearch(e.target.value)}
                      onClear={() => setSearch("")}
                    />

                    <div className="max-h-[300px] overflow-x-scroll scrollbar-hide">
                      <Table
                        isHeaderSticky
                        aria-label="users table"
                        color="secondary"
                        selectionMode="multiple"
                        selectedKeys={value}
                        onSelectionChange={setValue}
                        classNames={customStyleTable}
                        className="scrollbar-hide"
                      >
                        <TableHeader columns={columnsUser}>
                          {(column) => (
                            <TableColumn key={column.uid}>
                              {column.name}
                            </TableColumn>
                          )}
                        </TableHeader>

                        <TableBody
                          items={users?.users ? users.users : []}
                          emptyContent={
                            <span className="text-sm font-semibold italic text-gray">
                              Pengguna tidak ditemukan!
                            </span>
                          }
                        >
                          {(item: User) => (
                            <TableRow key={item.user_id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderCellUsers(item, columnKey)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {users?.users.length ? (
                      <Pagination
                        isCompact
                        showControls
                        page={users?.page as number}
                        total={users?.total_pages as number}
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
                    handleInviteParticipant();
                    setTimeout(() => {
                      onClose();
                    }, 500);
                  }}
                  className="font-bold"
                >
                  Tambah Partisipan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
