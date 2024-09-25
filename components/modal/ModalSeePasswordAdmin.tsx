import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Eye } from "@phosphor-icons/react";

interface Props {
  name: string;
  password: string;
}

export default function ModalSeePasswordAdmin(admin: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        variant="light"
        color="secondary"
        size="sm"
        startContent={<Eye weight="bold" size={16} />}
        onPress={onOpen}
        className="w-max font-bold"
      >
        Lihat Sandi
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Kata Sandi
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-4">
                  <p className="text-sm font-medium leading-[170%] text-gray">
                    <strong className="text-black">Catatan!</strong> Demi
                    menjaga kerahasiaan perusahaan, harap untuk tidak
                    menyebarluaskan kata sandi admin atas nama{" "}
                    <span className="font-extrabold text-purple">
                      {admin.name}
                    </span>
                  </p>

                  <Input
                    readOnly
                    type="text"
                    variant="flat"
                    labelPlacement="outside"
                    defaultValue={admin.password}
                    classNames={{
                      input: "font-semibold text-black",
                    }}
                    className="max-w-[500px]"
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="solid"
                  onPress={onClose}
                  className="font-bold"
                >
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
