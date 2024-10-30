import { SuccessResponse } from "@/types/global.type";
import { UserType } from "@/types/user.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Input,
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
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

type ModalAddParticipantProps = {
  session: string;
  token: string;
  program_id: string;
};

type UsersType = {
  users: UserType[];
  page: number;
  total_users: number;
  total_pages: number;
};

export default function ModalAddParticipant({
  session,
  token,
  program_id,
}: ModalAddParticipantProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = useState<UsersType>();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 800);

  const fetchUsers = async (url: string) => {
    try {
      const response = await fetcher({
        url,
        method: "GET",
        token,
      });

      setUsers(response.data);
    } catch (error) {
      toast.error("Coba Lagi, Data Pengguna Gagal Dimuat");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const url = searchValue ? `/admin/users?q=${searchValue}` : `/admin/users`;

    setPage(1);
    fetchUsers(url);
  }, [searchValue]);

  useEffect(() => {
    const url = searchValue
      ? `/admin/users?q=${searchValue}&page=${page}`
      : `/admin/users?page=${page}`;

    fetchUsers(url);
  }, [page]);

  async function handleGetUsers() {
    try {
      const response = (await fetcher({
        url: `/admin/users`,
        method: "GET",
        token,
      })) as SuccessResponse<UsersType>;

      setUsers(response.data);
    } catch (error) {
      toast.error("Coba Lagi, Data Pengguna Gagal Dimuat");
      console.error(error);
    }
  }

  async function handleInviteParticipant() {
    setLoading(true);

    const data = {
      program_id: program_id,
      by: session,
      users: Array.from(value),
    };

    try {
      await fetcher({
        url: "/admin/programs/invite",
        method: "POST",
        token,
        data: data,
      });

      toast.success("Berhasil Menambahkan Partisipan");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
  ];

  function renderCellUsers(user: UserType, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof UserType];

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
        variant="solid"
        color="secondary"
        startContent={<Plus weight="bold" size={18} />}
        onPress={() => {
          onOpen(), handleGetUsers();
        }}
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
        }}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Daftar Pengguna
              </ModalHeader>

              <ModalBody className="scrollbar-hide">
                <div className="grid gap-6">
                  <p className="text-sm font-medium leading-[170%] text-gray">
                    Cari pengguna untuk ditambahkan pada program ini, pastikan
                    ID pengguna yang anda cari sudah benar!
                  </p>

                  <div className="grid gap-4">
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
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
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
                          {(item: UserType) => (
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

                    <Pagination
                      isCompact
                      showControls
                      page={users?.page as number}
                      total={users?.total_pages as number}
                      onChange={(e) => {
                        setPage(e);
                      }}
                      className="justify-self-center"
                      classNames={{
                        cursor: "bg-purple text-white",
                      }}
                    />
                  </div>

                  {/* <Autocomplete
                    disableSelectorIconRotation
                    aria-label="select user"
                    labelPlacement="outside"
                    placeholder="Cari ID Pengguna..."
                    defaultItems={users}
                    selectedKey={value}
                    onSelectionChange={(key) => {
                      key !== null ? setValue(key.toString()) : setValue("");
                    }}
                    selectorIcon={<CaretUpDown weight="bold" size={16} />}
                    inputProps={{
                      classNames: {
                        input:
                          "placeholder:font-medium placeholder:text-gray font-semibold text-black",
                      },
                    }}
                    listboxProps={{
                      emptyContent: (
                        <span className="font-medium text-gray">
                          ID pengguna tidak ditemukan.
                        </span>
                      ),
                    }}
                  >
                    {(user: UserType) => (
                      <AutocompleteItem
                        key={user.user_id}
                        textValue={user.user_id}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-black">
                            {user.fullname}
                          </span>
                          <span className="text-xs text-gray">
                            {user.user_id}
                          </span>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete> */}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose(), setPage(1), setValue(new Set([])), setSearch("");
                  }}
                  className="font-bold"
                >
                  Tutup
                </Button>

                <Button
                  isLoading={loading}
                  color="secondary"
                  onClick={handleInviteParticipant}
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
