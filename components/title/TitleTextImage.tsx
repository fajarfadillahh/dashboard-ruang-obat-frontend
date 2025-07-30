import Image from "next/image";

interface TitleTextImageProps {
  src: string;
  name: string;
  description?: string;
}

export default function TitleTextImage({
  src,
  name,
  description,
}: TitleTextImageProps) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={src}
        alt={name}
        width={1000}
        height={1000}
        className="size-20 object-fill"
        priority
      />

      <div className="grid gap-1">
        <h1 className="flex-1 text-2xl font-black text-black">{name}</h1>

        <p className="font-medium text-gray">{description}</p>
      </div>
    </div>
  );
}
