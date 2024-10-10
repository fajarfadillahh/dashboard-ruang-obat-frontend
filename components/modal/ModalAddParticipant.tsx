import { UserType } from "@/types/user.type";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { UserCircle } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

type ModalAddParticipantProps = {
  users: any;
  isOpen: boolean;
  loading: boolean;
  value?: Selection;
  setValue?: Dispatch<SetStateAction<Selection>>;
  handleInviteParticipant?: () => void;
  onClose: () => void;
};

export default function ModalAddParticipant({
  users,
  isOpen,
  loading,
  value,
  setValue,
  handleInviteParticipant,
  onClose,
}: ModalAddParticipantProps) {
  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      onOpenChange={onClose}
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

                <Select
                  aria-label="select user"
                  variant="flat"
                  labelPlacement="outside"
                  placeholder="Cari Pengguna Berdasarkan ID..."
                  items={users.users}
                  selectedKeys={value}
                  onSelectionChange={setValue}
                  classNames={{
                    value: "font-medium text-gray",
                  }}
                >
                  {(user: UserType) => (
                    <SelectItem key={user.user_id} textValue={user.user_id}>
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
                    </SelectItem>
                  )}
                </Select>
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
  );
}
