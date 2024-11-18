import { Button } from "@nextui-org/react";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/router";

type ButtonBackProps = {
  href?: string;
};

export default function ButtonBack({ href }: ButtonBackProps) {
  const router = useRouter();

  const handleClick = () => {
    href ? router.push(href) : router.back();
  };

  return (
    <Button
      variant="light"
      startContent={<ArrowLeft weight="bold" size={16} />}
      onClick={handleClick}
      className="w-max px-4 font-bold text-black"
    >
      Kembali
    </Button>
  );
}
