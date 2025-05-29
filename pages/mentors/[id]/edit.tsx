import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { Mentor } from "@/types/mentor.type";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { onCropComplete } from "@/utils/onCropComplete";
import { Button, Input, Switch } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

const CKEditor = dynamic(() => import("@/components/editor/CKEditor"), {
  ssr: false,
});

type InputState = {
  fullname: string;
  nickname: string;
  mentor_title: string;
};

export default function EditMentorPage({
  token,
  mentor,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();
  const [input, setInput] = useState<InputState>({
    fullname: mentor.fullname,
    nickname: mentor.mentor_title,
    mentor_title: mentor.mentor_title,
  });
  const [description, setDescription] = useState<string>(mentor.description);

  const [file, setFile] = useState<string | ArrayBuffer | null>();
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(true);

  useEffect(() => {
    const isFormValid = [
      input.fullname,
      input.nickname,
      input.mentor_title,
      description,
    ].every(Boolean);

    setButtonDisabled(!isFormValid);
  }, [input, description]);

  async function handleEditMentor() {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("mentor_id", mentor.mentor_id as string);
      formData.append("fullname", input.fullname);
      formData.append("nickname", input.nickname);
      formData.append("mentor_title", input.mentor_title);
      formData.append("description", description);
      formData.append("by", session.data?.user.fullname as string);
      formData.append("is_show", `${isShow}`);

      if (filename) {
        const croppedImage = await getCroppedImg(file, croppedAreaPixels);
        const response = await fetch(croppedImage as string);
        const blob = await response.blob();
        const fileConvert = new File([blob], `${filename}`, {
          type,
        });

        formData.append("with_image", "true");
        formData.append("img_mentor", fileConvert);
      } else {
        formData.append("with_image", "false");
      }

      await fetcher({
        url: "/admin/mentors",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      toast.success("Mentor berhasil diperbarui");
      router.push("/mentors");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <Layout title="Edit Mentor">
      <Container>
        <ButtonBack />

        <TitleText
          title="Edit Mentor 🧑🏽"
          text="Edit dan sesuaikan data mentor"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[900px] gap-8">
          <div className="grid grid-cols-[300px_1fr] items-start gap-8 pt-8">
            <div className="grid gap-8">
              <div className="grid gap-1">
                {!filename ? (
                  <Image
                    priority
                    src={mentor.img_url as string}
                    alt="mentor img"
                    width={300}
                    height={300}
                    className="aspect-square size-[300px] rounded-xl border-2 border-dashed border-gray/20 p-1"
                  />
                ) : (
                  <div className="aspect-square size-[300px] rounded-xl border-2 border-dashed border-gray/20 p-1">
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
                )}

                <p className="text-center text-sm font-medium leading-[170%] text-gray">
                  <strong className="mr-1 text-danger">*</strong>ratio gambar
                  1:1
                </p>
              </div>

              <Input
                isRequired
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                variant="flat"
                label="Foto Mentor"
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
                    toast.error("Ekstensi file harus png, jpg, atau jpeg");
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

                    toast.error("Terjadi kesalahan saat meload gambar");

                    console.log(error);
                  };
                }}
              />

              <Switch
                color="secondary"
                isSelected={isShow}
                onValueChange={setIsShow}
                classNames={{
                  label: "text-black font-medium text-sm",
                }}
              >
                Tampilkan Di Homepage
              </Switch>
            </div>

            <div className="grid gap-4">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Nama Lengkap"
                labelPlacement="outside"
                placeholder="Contoh: Jhon Doe"
                name="fullname"
                value={input.fullname}
                onChange={(e) =>
                  setInput({ ...input, fullname: e.target.value })
                }
                classNames={customStyleInput}
              />

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Nama Panggilan"
                labelPlacement="outside"
                placeholder="Contoh: Kakak Jhon"
                name="nickname"
                value={input.nickname}
                onChange={(e) =>
                  setInput({ ...input, nickname: e.target.value })
                }
                classNames={customStyleInput}
              />

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Mentor"
                labelPlacement="outside"
                placeholder="Contoh: Mentor Biofarmasi"
                name="mentor_title"
                value={input.mentor_title}
                onChange={(e) =>
                  setInput({ ...input, mentor_title: e.target.value })
                }
                classNames={customStyleInput}
              />

              <div className="grid gap-2">
                <p className="text-sm text-black">
                  Deskripsi Mentor<strong className="text-danger">*</strong>
                </p>

                <CKEditor
                  value={description}
                  onChange={setDescription}
                  token={`${token}`}
                />
              </div>
            </div>
          </div>

          <Button
            isLoading={loading}
            isDisabled={buttonDisabled || loading}
            color="secondary"
            startContent={
              loading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleEditMentor}
            className="w-max justify-self-end font-semibold"
          >
            {loading ? "Tunggu Sebentar..." : "Edit Mentor"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx, token) => {
  const id = ctx.params?.id as string;

  const response = (await fetcher({
    url: `/admin/mentors/${encodeURIComponent(id)}`,
    method: "GET",
    token,
  })) as SuccessResponse<Mentor>;

  return {
    props: {
      mentor: response.data,
    },
  };
});
