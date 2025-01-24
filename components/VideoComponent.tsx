import { twMerge } from "tailwind-merge";

type VideoComponentProps = {
  url: string;
  className?: string;
};

export default function VideoComponent({
  url,
  className,
}: VideoComponentProps) {
  const videoID = new URL(url).searchParams.get("v");
  const embedURL = `https://www.youtube.com/embed/${videoID}`;

  return (
    <iframe
      allowFullScreen
      src={embedURL}
      width={350}
      height={270}
      title="Video Player"
      className={twMerge(`border-0 ${className}`)}
    />
  );
}
