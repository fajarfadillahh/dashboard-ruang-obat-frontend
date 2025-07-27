import { customStyleInput } from "@/utils/customStyleInput";
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
        <MagnifyingGlass weight="duotone" size={18} className="text-gray" />
      }
      classNames={customStyleInput}
      className="flex-1"
      {...props}
    />
  );
}
