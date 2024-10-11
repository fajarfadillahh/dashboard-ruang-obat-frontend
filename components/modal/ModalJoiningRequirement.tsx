import { ParticipantType } from "@/types/user.type";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Eye } from "@phosphor-icons/react";

export default function ModalJoiningRequirement(participant: ParticipantType) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        variant="light"
        color="secondary"
        size="sm"
        startContent={<Eye weight="bold" size={16} />}
        onPress={onOpen}
        className="font-bold"
      >
        Lihat Persyaratan
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
                Permintaan Bergabung
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    {[
                      ["ID Partisipan", `${participant.user_id}`],
                      ["Nama Lengkap", `${participant.fullname}`],
                      ["Asal Kampus", `${participant.university}`],
                    ].map(([label, value], index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[100px_2px_1fr] gap-4 text-sm font-medium text-black"
                      >
                        <p>{label}</p>
                        <span>:</span>
                        <p className="font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <div className="aspect-square h-auto w-auto rounded-xl border-2 border-dashed border-gray/30 bg-gray/10" />
                    <div className="aspect-square h-auto w-auto rounded-xl border-2 border-dashed border-gray/30 bg-gray/10" />
                    <div className="aspect-square h-auto w-auto rounded-xl border-2 border-dashed border-gray/30 bg-gray/10" />
                  </div>
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

                <Button variant="solid" color="secondary" className="font-bold">
                  Persyaratan Diterima
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
