import { twMerge } from "tailwind-merge";

type TitleTextProps = {
  title: string;
  text: string;
  className?: string;
};

export default function TitleText({ title, text, className }: TitleTextProps) {
  return (
    <div className={twMerge(`grid gap-1`, className)}>
      <h1 className="max-w-[550px] text-2xl font-bold -tracking-wide text-black">
        {title}
      </h1>
      <p className="font-medium text-gray">{text}</p>
    </div>
  );
}
