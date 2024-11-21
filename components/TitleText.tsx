type TitleTextProps = {
  title: string;
  text: string;
};

export default function TitleText({ title, text }: TitleTextProps) {
  return (
    <div className="grid gap-1">
      <h1 className="text-[22px] font-bold -tracking-wide text-black">
        {title}
      </h1>
      <p className="font-medium text-gray">{text}</p>
    </div>
  );
}
