import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Trash } from "@phosphor-icons/react";

export default function ModalConfirmDelete({
  id,
  header,
  title,
  handleDelete,
}: {
  id: string;
  header: string;
  title: string;
  handleDelete: (id: string) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        color="danger"
        size="sm"
        onPress={onOpen}
      >
        <Trash weight="bold" size={18} className="text-danger" />
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Hapus {header}
              </ModalHeader>

              <ModalBody>
                <p className="text-sm font-medium leading-[170%] text-gray">
                  Apakah anda yakin ingin menghapus{" "}
                  <span className="font-extrabold text-purple">{title}</span>{" "}
                  dengan ID:{" "}
                  <span className="font-extrabold text-purple">{id}</span>{" "}
                  secara permanen? Tindakan ini tidak dapat dibatalkan, dan data
                  yang sudah dihapus tidak dapat dipulihkan.
                </p>
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
                  color="danger"
                  onPress={() => {
                    handleDelete(id);
                    onClose();
                  }}
                  className="font-bold"
                >
                  Ya, Hapus {header}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
