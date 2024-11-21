import { ArrowClockwise, SignOut } from "@phosphor-icons/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

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

export const useErrorContent = (): ErrorContentType => {
  const router = useRouter();

  return {
    401: {
      title: "Uppsss.. Session login anda telah berakhir 🚫",
      description: (
        <p className="font-medium leading-[170%] text-gray">
          Silakan{" "}
          <strong className="font-black text-purple">login kembali</strong>{" "}
          untuk bisa mengakses halaman admin Ruang Obat.
        </p>
      ),
      buttonText: "Logout",
      buttonAction: () => {
        if (confirm("Apakah anda yakin?")) {
          signOut();
        }
      },
      buttonIcon: <SignOut weight="bold" size={18} />,
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
      buttonAction: () => window.location.reload(),
      buttonIcon: <ArrowClockwise weight="bold" size={18} />,
    },
  };
};
