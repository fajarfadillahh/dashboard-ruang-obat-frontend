import { Input, InputProps } from "@nextui-org/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function SearchInput(props: InputProps) {
  return (
    <Input
      isClearable
      type="text"
      variant="flat"
      labelPlacement="outside"
      startContent={
        <MagnifyingGlass weight="bold" size={18} className="text-gray" />
      }
      classNames={{
        input: "font-semibold placeholder:font-semibold placeholder:text-gray",
      }}
      className="max-w-[500px]"
      {...props}
    />
  );
}
