type VideoComponentProps = {
  url: string;
};

export default function VideoComponent({ url }: VideoComponentProps) {
  const videoID = new URL(url).searchParams.get("v");
  const embedURL = `https://www.youtube.com/embed/${videoID}`;

  return (
    <iframe
      allowFullScreen
      src={embedURL}
      width={350}
      height={270}
      title="Video Player"
      className="border-0"
    />
  );
}
