import { Button } from "@nextui-org/react";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/router";

export default function ButtonBack() {
  const router = useRouter();

  return (
    <Button
      variant="light"
      startContent={<ArrowLeft weight="bold" size={16} />}
      onClick={() => router.back()}
      className="w-max px-4 font-bold text-black"
    >
      Kembali
    </Button>
  );
}
