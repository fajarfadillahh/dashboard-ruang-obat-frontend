import { Accesses } from "@/types/accesses/accesses.type";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

type ModalRevokeProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  loading?: boolean;
  access: Accesses;
};

export default function ModalRevoke({
  isOpen,
  onOpenChange,
  onConfirm,
  loading,
  access,
  onClose,
}: ModalRevokeProps) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      placement="center"
      onCanPlay={onClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="inline-flex items-center gap-2 font-bold text-black">
              <WarningCircle
                weight="duotone"
                size={24}
                className="text-danger"
              />
              Konfirmasi Menangguhkan Akses
            </ModalHeader>

            <ModalBody className="grid gap-8">
              <p className="text-sm font-medium leading-[170%] text-gray">
                Apakah Anda yakin ingin menangguhkan akses{" "}
                <strong className="font-bold text-danger">
                  {access.fullname}
                </strong>{" "}
                dengan ID{" "}
                <strong className="font-bold text-danger">
                  {access.user_id}
                </strong>{" "}
                yang berdurasi{" "}
                <strong className="font-bold text-danger">
                  {access.duration}
                </strong>{" "}
                bulan? Tindakan ini tidak dapat dibatalkan.
              </p>

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Alasan Penangguhan"
                labelPlacement="outside"
                placeholder="Contoh: Melakukan tindakan tidak pastas"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                color="danger"
                onClick={onClose}
                className="font-semibold text-danger"
              >
                Batal
              </Button>

              <Button
                isLoading={loading}
                isDisabled={!reason.trim()}
                color="danger"
                onClick={() => {
                  onConfirm(reason);
                  onClose();
                  setReason("");
                }}
                className="font-semibold"
              >
                Tangguhkan Akses
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
