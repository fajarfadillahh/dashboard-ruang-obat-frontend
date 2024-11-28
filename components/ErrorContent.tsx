import { useDisclosure } from "@nextui-org/react";
import { ArrowClockwise, ArrowLeft, SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import ModalLogout from "./modal/ModalLogout";

type ErrorContentType = {
  [key: number]: {
    title: string;
    description: JSX.Element | string;
    buttonText: string;
    buttonIcon: JSX.Element;
    buttonAction: () => void;
  };
  default: {
    title: string;
    description: JSX.Element | string;
    buttonText: string;
    buttonIcon: JSX.Element;
    buttonAction: () => void;
  };
};

export function useErrorContent(): ErrorContentType {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const errorContent: ErrorContentType = {
    401: {
      title: "Uppsss.. Session login anda telah berakhir 🚫",
      description: (
        <>
          <p className="font-medium leading-[170%] text-gray">
            Silakan{" "}
            <strong className="font-black text-purple">login kembali</strong>{" "}
            untuk bisa mengakses halaman admin Ruang Obat.
          </p>

          <ModalLogout isOpen={isOpen} onClose={onClose} />
        </>
      ),
      buttonText: "Logout",
      buttonIcon: <SignOut weight="bold" size={18} />,
      buttonAction: () => {
        onOpen;
      },
    },
    403: {
      title: "Larangan Akses Untuk Anda 🚫",
      description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
      buttonText: "Kembali ke Beranda",
      buttonIcon: <ArrowLeft weight="bold" size={18} />,
      buttonAction: () => router.push("/dashboard"),
    },
    default: {
      title: "Telah terjadi kesalahan sistem atau server",
      description: (
        <p className="font-medium leading-[170%] text-gray">
          Sepertinya telah terjadi kesalahan pada sistem. Silakan{" "}
          <strong className="font-black text-purple">muat ulang</strong> halaman
          atau hubungi tim developer jika masalah ini terus berlanjut.
        </p>
      ),
      buttonText: "Muat Ulang Halaman",
      buttonIcon: <ArrowClockwise weight="bold" size={18} />,
      buttonAction: () => window.location.reload(),
    },
  };

  return errorContent;
}
