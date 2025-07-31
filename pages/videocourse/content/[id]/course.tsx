import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { onCropComplete } from "@/utils/onCropComplete";
import { Button, Input, Textarea } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

export default function CreateCoursePage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();
  const [input, setInput] = useState<{
    title: string;
    preview_url?: string;
    description: string;
  }>({
    title: "",
    preview_url: "",
    description: "",
  });
  const [file, setFile] = useState<string | ArrayBuffer | null>();
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleCreateCourse() {
    setLoading(true);

    try {
      const formData = new FormData();

      const croppedImage = await getCroppedImg(file, croppedAreaPixels);
      const response = await fetch(croppedImage as string);
      const blob = await response.blob();
      const fileConvert = new File([blob], `${filename}`, {
        type,
      });
      formData.append("thumbnail", fileConvert);

      formData.append("sub_category_id", params.id as string);
      formData.append("title", input.title);
      formData.append("preview_url", input.preview_url as string);
      formData.append("description", input.description);
      formData.append("type", "videocourse");
      formData.append("by", session.data?.user.fullname as string);

      const responseCourse: SuccessResponse<{ course_id: string }> =
        await fetcher({
          url: "/courses",
          method: "POST",
          data: formData,
          file: true,
          token,
        });

      toast.success("Kursus/Playlist berhasil ditambahkan!");
      router.push({
        pathname: `/videocourse/content/${params.id}/segment`,
        query: {
          course_id: responseCourse.data.course_id,
          course_title: input.title,
        },
      });
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Buat Kursus/Playlist" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="Buat Kursus/Playlist 🎥"
          text="Saatnya buat kursus/playlist sekarang"
        />

        <div className="grid max-w-[900px] gap-8">
          <div className="grid grid-cols-[300px_1fr] items-start gap-8">
            {/* input gambar */}
            <div className="grid gap-6">
              <div className="grid gap-1">
                <div className="aspect-video size-[300px] rounded-xl border-2 border-dashed border-gray/20 p-1">
                  <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl bg-gray/20">
                    <Cropper
                      image={file as string}
                      crop={cropImage}
                      zoom={zoomImage}
                      aspect={1 / 1}
                      onCropChange={setCropImage}
                      onCropComplete={onCropComplete({
                        setCroppedAreaPixels,
                      })}
                      onZoomChange={setZoomImage}
                    />
                  </div>
                </div>

                <p className="text-center text-sm font-medium text-gray">
                  <strong className="mr-1 text-danger">*</strong>ratio gambar
                  1:1
                </p>
              </div>

              <Input
                isRequired
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                variant="flat"
                label="Thumbnail Playlist"
                labelPlacement="outside"
                classNames={{
                  input:
                    "block w-full flex-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple file:text-sm file:font-sans file:font-semibold file:text-white hover:file:bg-purple/80",
                }}
                onChange={(e) => {
                  if (!e.target.files?.length) {
                    setFile(null);
                    setFilename("");
                    setType("");
                    return;
                  }

                  const validTypes = ["image/png", "image/jpg", "image/jpeg"];

                  if (!validTypes.includes(e.target.files[0].type)) {
                    toast.error("Ekstensi file harus .png, .jpg, atau .jpeg");
                    setFile(null);
                    setFilename("");
                    setType("");
                    return;
                  }

                  setType(e.target.files[0].type);
                  setFilename(e.target.files[0].name);
                  const reader = new FileReader();
                  reader.readAsDataURL(e.target.files[0]);

                  reader.onload = function () {
                    setFile(reader.result);
                  };

                  reader.onerror = function (error) {
                    setFile(null);
                    setFilename("");
                    setType("");

                    toast.error("Terjadi kesalahan saat me-load gambar");

                    console.log(error);
                  };
                }}
              />
            </div>

            <div className="grid gap-6">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Judul Kursus/Playlist"
                labelPlacement="outside"
                placeholder="Contoh: Belajar Farmakoterapi Dasar"
                name="title"
                value={input.title}
                onChange={(e) => {
                  setInput({
                    ...input,
                    title: e.target.value,
                  });
                }}
                classNames={customStyleInput}
              />

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Link Preview Kursus/Playlist"
                labelPlacement="outside"
                placeholder="Contoh: https://youtube.com/watch?v=xxxxx"
                name="preview_url"
                value={input.preview_url}
                onChange={(e) => {
                  setInput({
                    ...input,
                    preview_url: e.target.value,
                  });
                }}
                classNames={customStyleInput}
              />

              <Textarea
                isRequired
                minRows={4}
                type="text"
                variant="flat"
                label="Deskripsi Kursus/Playlist"
                labelPlacement="outside"
                placeholder="Contoh: Farmakoterapi Dasar adalah disiplin ilmu di dunia farmasi..."
                name="description"
                value={input.description}
                onChange={(e) => {
                  setInput({
                    ...input,
                    description: e.target.value,
                  });
                }}
                classNames={customStyleInput}
              />
            </div>
          </div>

          <Button
            isLoading={loading}
            isDisabled={!input || !file || loading}
            color="secondary"
            startContent={
              loading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleCreateCourse}
            className="justify-self-end font-semibold"
          >
            Simpan Kursus
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
