import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingData from "@/components/loading/LoadingData";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { Mentor } from "@/types/mentor.type";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Switch } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import useSWR from "swr";

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
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();
  const { data, error, isLoading } = useSWR<SuccessResponse<Mentor>>({
    url: `/admin/mentors/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputState>({
    fullname: "",
    nickname: "",
    mentor_title: "",
  });
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [fileImg, setFileImg] = useState<string | ArrayBuffer | null>();
  const [cropImg, setCropImg] = useState({ x: 0, y: 0 });
  const [zoomImg, setZoomImg] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (!data?.data) return;

    const { fullname, nickname, mentor_title, description } = data.data;

    setInput({
      fullname,
      nickname,
      mentor_title,
    });
    setDescription(description);
  }, [data?.data]);

  useEffect(() => {
    const isFormValid = [
      input.fullname,
      input.nickname,
      input.mentor_title,
      description,
    ].every(Boolean);

    setIsReady(true);
    setButtonDisabled(!isFormValid);
  }, [input, description]);

  function onCropComplete(croppedArea: any, croppedAreaPixels: any) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleEditMentor() {
    setLoading(true);

    try {
      const formData = new FormData();
      const fullname = session.data?.user.fullname;

      formData.append("mentor_id", data?.data.mentor_id as string);
      formData.append("fullname", input.fullname);
      formData.append("nickname", input.nickname);
      formData.append("mentor_title", input.mentor_title);
      formData.append("description", description);
      formData.append("by", fullname as string);

      if (selected) {
        formData.append("with_image", "true");

        const croppedImage = await getCroppedImg(fileImg, croppedAreaPixels);
        const response = await fetch(croppedImage as string);
        const blob = await response.blob();
        const fileConvert = new File(
          [blob],
          `${data?.data.mentor_id}-mentor-img.jpg`,
          {
            type: "image/jpg",
          },
        );
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

  if (error) {
    return (
      <Layout title="Edit Mentor">
        <Container>
          <ErrorPage
            {...{
              status_code: error.status_code,
              message: error.error.message,
              name: error.error.name,
            }}
          />
        </Container>
      </Layout>
    );
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="Edit Mentor">
      <Container>
        <section className="grid">
          <ButtonBack />

          <TitleText
            title="Edit Mentor 🧑🏽"
            text="Edit dan sesuaikan data mentor"
            className="border-b-2 border-dashed border-gray/20 py-8"
          />

          <div className="grid max-w-[900px] gap-8">
            {!isReady ? (
              <LoadingData />
            ) : (
              <div className="grid grid-cols-[300px_1fr] items-start gap-8 pt-8">
                <div className="grid gap-8">
                  <div className="grid gap-1">
                    {!selected ? (
                      <Image
                        priority
                        src={data?.data.img_url as string}
                        alt="mentor img"
                        width={300}
                        height={300}
                        className="aspect-square size-[300px] rounded-xl border-2 border-dashed border-gray/20 p-1"
                      />
                    ) : (
                      <div className="aspect-square size-[300px] rounded-xl border-2 border-dashed border-gray/20 p-1">
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
                    )}

                    <p className="text-center text-sm font-medium leading-[170%] text-gray">
                      <strong className="mr-1 text-danger">*</strong>ratio
                      gambar 1:1
                    </p>
                  </div>

                  <Input
                    isDisabled={!selected}
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    variant="flat"
                    labelPlacement="outside"
                    placeholder="Masukan Foto Mentor"
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
                        toast.error("Terjadi kesalahan saat memasukan gambar!");
                        console.error(error);
                      };
                    }}
                  />

                  <Switch
                    color="secondary"
                    isSelected={selected}
                    onValueChange={setSelected}
                    classNames={{
                      label: "text-black font-medium text-sm",
                    }}
                  >
                    Aktifkan Untuk Ubah Foto
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
            )}

            <Button
              isLoading={loading}
              isDisabled={buttonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleEditMentor}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Edit Mentor"}
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  params: ParsedUrlQuery;
}> = async ({ req, params }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
    },
  };
};
