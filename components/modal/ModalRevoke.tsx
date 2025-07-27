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
            <ModalHeader className="flex items-center gap-2 text-danger">
              <WarningCircle size={24} className="text-danger" />
              <p>Konfirmasi Menangguhkan Akses</p>
            </ModalHeader>
            <ModalBody>
              <p className="mb-2">
                Apakah Anda yakin ingin menangguhkan akses{" "}
                <span className="font-bold text-danger">{access.fullname}</span>{" "}
                dengan ID{" "}
                <span className="font-bold text-danger">{access.user_id}</span>{" "}
                yang berdurasi{" "}
                <span className="font-bold text-danger">
                  {access.duration} bulan
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
              <Input
                label="Alasan Penangguhan"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Batal
              </Button>
              <Button
                color="danger"
                isLoading={loading}
                onClick={() => {
                  onConfirm(reason);
                  onClose();
                  setReason("");
                }}
                isDisabled={!reason.trim()}
              >
                Tangguhkan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
