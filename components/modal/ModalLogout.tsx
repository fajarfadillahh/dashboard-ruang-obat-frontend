import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ModalLogoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalLogout({ isOpen, onClose }: ModalLogoutProps) {
  const [loading, setLoading] = useState<boolean>(false);

  function handleLogout() {
    setLoading(true);
    toast.success("Berhasil Logout");

    setTimeout(() => {
      signOut();
    }, 800);
  }

  return (
    <Modal hideCloseButton isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-bold text-black">
              Peringatan!
            </ModalHeader>

            <ModalBody>
              <p className="text-sm font-medium leading-[170%] text-gray">
                Apakah anda yakin ingin logout?
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
                isLoading={loading}
                color="danger"
                onClick={handleLogout}
                className="font-bold"
              >
                Ya, Logout
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
