import { UserType } from "@/types/user.type";
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
import { ArrowRight, Plus, UserCircle } from "@phosphor-icons/react";

type UserProps = {
  users: any;
};

export default function ModalAddParticipant({ users }: UserProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        variant="solid"
        color="secondary"
        startContent={<Plus weight="bold" size={16} />}
        onPress={onOpen}
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
                    Silakan cari pengguna untuk ditambahkan pada program ini,
                    pastikan ID pengguna yang anda cari itu sudah benar!
                  </p>

                  <Autocomplete
                    variant="flat"
                    labelPlacement="outside"
                    placeholder="Cari Pengguna Berdasarkan ID..."
                    defaultItems={users.users}
                    inputProps={{
                      classNames: {
                        input:
                          "font-semibold placeholder:font-medium placeholder:text-gray",
                      },
                    }}
                    listboxProps={{
                      emptyContent: "ID pengguna tidak ditemukan!",
                    }}
                  >
                    {(user: UserType) => (
                      <AutocompleteItem
                        key={user.user_id}
                        textValue={user.user_id}
                      >
                        <div className="flex items-center gap-3">
                          <UserCircle
                            weight="fill"
                            size={28}
                            className="text-purple"
                          />

                          <div className="flex flex-col">
                            <h5 className="text-sm font-bold text-black">
                              {user.fullname}
                            </h5>
                            <span className="text-[12px] font-medium text-gray">
                              {user.user_id}
                            </span>
                          </div>
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
                  color="secondary"
                  onPress={onClose}
                  endContent={<ArrowRight weight="bold" size={18} />}
                  className="font-bold"
                >
                  Tambahkan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
