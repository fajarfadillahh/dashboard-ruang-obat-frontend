import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Radio, RadioGroup, Textarea } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

type InputState = {
  title: string;
  description: string;
  price: number;
  link_order: string;
};

export default function CreatePreparationClass({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState<InputState>({
    title: "",
    description: "",
    price: 0,
    link_order: "",
  });
  const [videoUrl, setVideoUrl] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [thumbnailType, setThumbnailType] = useState("image");

  const [fileImg, setFileImg] = useState<string | ArrayBuffer | null>();
  const [cropImg, setCropImg] = useState({ x: 0, y: 0 });
  const [zoomImg, setZoomImg] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const requiredFields = [
      input.title,
      input.description,
      input.price,
      input.link_order,
    ];

    const isFormValid =
      thumbnailType === "image"
        ? [...requiredFields, fileImg].every(Boolean)
        : [...requiredFields, videoUrl].every(Boolean);

    setButtonDisabled(!isFormValid);
  }, [input, fileImg, videoUrl, thumbnailType]);

  function onCropComplete(croppedArea: any, croppedAreaPixels: any) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleCreatePreparationClass() {
    setLoading(true);

    try {
      const formData = new FormData();
      const fullname = session.data?.user.fullname;

      formData.append("title", input.title);
      formData.append("description", input.description);
      formData.append("thumbnail_type", thumbnailType);
      formData.append("price", input.price.toString());
      formData.append("link_order", input.link_order);
      formData.append("by", fullname as string);

      if (thumbnailType === "image") {
        const croppedImage = await getCroppedImg(fileImg, croppedAreaPixels);
        const response = await fetch(croppedImage as string);
        const blob = await response.blob();
        const fileConvert = new File([blob], "thumbnail.jpg", {
          type: "image/jpg",
        });

        formData.append("thumbnail_subject", fileConvert);
      } else {
        formData.append("video_url", videoUrl);
      }

      await fetcher({
        url: "/admin/subjects/preparation",
        method: "POST",
        data: formData,
        file: true,
        token,
      });

      toast.success("Video pembelajaran berhasil dibuat");
      router.back();
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <Layout
      title="Buat Video Pembelajaran Matkul Farmasi"
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid">
          <ButtonBack />

          <TitleText
            title="Buat Video Pembelajaran Matkul Farmasi 🎬"
            text="Tambahkan video pembelajaran lainnya"
            className="border-b-2 border-dashed border-gray/20 py-8"
          />

          <div className="grid max-w-[900px] gap-8">
            <div className="grid grid-cols-[300px_1fr] items-start gap-8 pt-8">
              <div className="grid gap-8">
                <RadioGroup
                  isRequired
                  label="Tipe Thumbnail"
                  color="secondary"
                  orientation="horizontal"
                  value={thumbnailType}
                  onValueChange={setThumbnailType}
                  classNames={{
                    label: "text-black text-sm font-medium",
                  }}
                >
                  <Radio value="image">Gambar</Radio>
                  <Radio value="video">Video</Radio>
                </RadioGroup>

                {thumbnailType === "image" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <div className="aspect-video size-[300px] rounded-xl border-2 border-dashed border-gray/20 p-1">
                        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl bg-gray/20">
                          <Cropper
                            image={fileImg as string}
                            crop={cropImg}
                            zoom={zoomImg}
                            aspect={1 / 1}
                            onCropChange={setCropImg}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoomImg}
                          />
                        </div>
                      </div>

                      <p className="text-center text-sm font-medium leading-[170%] text-gray">
                        ratio gambar 1:1
                        <strong className="ml-[2px] text-danger">*</strong>
                      </p>
                    </div>

                    <Input
                      type="file"
                      accept="image/jpg, image/jpeg, image/png"
                      variant="flat"
                      labelPlacement="outside"
                      placeholder="Thumbnail Video"
                      classNames={{
                        input:
                          "block w-full flex-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple file:text-sm file:font-sans file:font-semibold file:text-white hover:file:bg-purple/80",
                      }}
                      onChange={(e) => {
                        if (!e.target.value) return;

                        const reader = new FileReader();
                        reader.readAsDataURL(e.target.files?.[0] as File);
                        reader.onload = () => {
                          setFileImg(reader.result as string);
                        };
                        reader.onerror = function (error) {
                          toast.error(
                            "Terjadi kesalahan saat memasukan gambar!",
                          );
                          console.error(error);
                        };
                      }}
                    />
                  </div>
                ) : (
                  <Input
                    isRequired
                    type="text"
                    variant="flat"
                    label="Link Cuplikan Video"
                    labelPlacement="outside"
                    placeholder="Contoh: youtube.com/watch?v=xxxxx"
                    name="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    classNames={customStyleInput}
                  />
                )}
              </div>

              <div className="grid gap-4">
                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Nama Video"
                  labelPlacement="outside"
                  placeholder="Contoh: Video Pembelajaran Bio Farmasi"
                  name="title"
                  value={input.title}
                  onChange={(e) =>
                    setInput({ ...input, title: e.target.value })
                  }
                  classNames={customStyleInput}
                />

                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Harga Video"
                  labelPlacement="outside"
                  placeholder="Contoh: 200000"
                  name="price"
                  value={input.price.toString()}
                  onChange={(e) =>
                    setInput({ ...input, price: Number(e.target.value) })
                  }
                  classNames={customStyleInput}
                />

                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Link Order"
                  labelPlacement="outside"
                  placeholder="Contoh: lynk.id/xxxxx"
                  name="link_order"
                  value={input.link_order}
                  onChange={(e) =>
                    setInput({ ...input, link_order: e.target.value })
                  }
                  classNames={customStyleInput}
                />

                <Textarea
                  isRequired
                  maxRows={6}
                  type="text"
                  variant="flat"
                  label="Deskripsi Video"
                  labelPlacement="outside"
                  placeholder="Masukan Deskripsi"
                  name="description"
                  value={input.description}
                  onChange={(e) =>
                    setInput({ ...input, description: e.target.value })
                  }
                  classNames={customStyleInput}
                />
              </div>
            </div>

            <Button
              isLoading={loading}
              isDisabled={buttonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleCreatePreparationClass}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Buat Video"}
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
