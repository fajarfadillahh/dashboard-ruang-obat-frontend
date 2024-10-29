import { SuccessResponse } from "@/types/global.type";
import { UserType } from "@/types/user.type";
import { fetcher } from "@/utils/fetcher";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { CaretUpDown, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";

type ModalAddParticipantProps = {
  session: string;
  token: string;
  program_id: string;
};

export default function ModalAddParticipant({
  session,
  token,
  program_id,
}: ModalAddParticipantProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = useState<UserType[]>([]);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGetUsers() {
    try {
      const response = (await fetcher({
        url: `/admin/users?page=all`,
        method: "GET",
        token,
      })) as SuccessResponse<UserType[]>;

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(users);

  async function handleInviteParticipant() {
    setLoading(true);

    const data = {
      program_id: program_id,
      by: session,
      users: [value],
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
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Daftar Pengguna
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-6">
                  <p className="text-sm font-medium leading-[170%] text-gray">
                    Cari pengguna untuk ditambahkan pada program ini, pastikan
                    ID pengguna yang anda cari sudah benar!
                  </p>

                  <Autocomplete
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
                  </Autocomplete>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
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
