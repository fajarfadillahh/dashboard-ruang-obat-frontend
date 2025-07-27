import { Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";

type CustomTooltipProps = {
  children: ReactNode;
  content: string;
};

export default function CustomTooltip({
  children,
  content,
}: CustomTooltipProps) {
  return (
    <Tooltip
      content={content}
      classNames={{
        content: "max-w-[350px] font-semibold text-black",
      }}
    >
      {children}
    </Tooltip>
  );
}
