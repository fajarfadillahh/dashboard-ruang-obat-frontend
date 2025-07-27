import { MagnifyingGlass } from "@phosphor-icons/react";

type EmptyDataProps = {
  text: string;
};

export default function EmptyData({ text }: EmptyDataProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-16">
      <MagnifyingGlass weight="duotone" size={20} className="text-gray" />
      <p className="font-semibold text-gray">{text}</p>
    </div>
  );
}
