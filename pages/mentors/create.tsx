import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input } from "@nextui-org/react";
import { FloppyDisk, ImageSquare } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CKEditor = dynamic(() => import("@/components/editor/CKEditor"), {
  ssr: false,
});

type InputState = {
  fullname: string;
  nickname: string;
  mentor_title: string;
};

export default function CreateMentorPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();
  const [input, setInput] = useState<InputState>({
    fullname: "",
    nickname: "",
    mentor_title: "",
  });
  const [description, setDescription] = useState("");
  const [mentorImgFile, setMentorImgFile] = useState<File | null>();
  const [imgPreview, setImgPreview] = useState<string | null>();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isFormValid = [
      input.fullname,
      input.nickname,
      input.mentor_title,
      description,
    ].every(Boolean);

    setButtonDisabled(!isFormValid);
  }, [input, description]);

  async function handleCreateMentor() {
    setLoading(true);

    try {
      const fullname = session.data?.user.fullname;
      const formData = new FormData();

      formData.append("fullname", input.fullname);
      formData.append("nickname", input.nickname);
      formData.append("mentor_title", input.mentor_title);
      formData.append("description", description);
      formData.append("img_mentor", mentorImgFile as File);
      formData.append("by", fullname as string);

      await fetcher({
        url: "/admin/mentors",
        method: "POST",
        data: formData,
        token,
      });

      setMentorImgFile(null);
      toast.success("Mentor berhasil dibuat");
      router.push("/mentors");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setMentorImgFile(null);
      setImgPreview(null);
      return;
    }
    setMentorImgFile(file);

    const imageUrl = URL.createObjectURL(file);
    setImgPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }

  return (
    <Layout title="Buat Admin" className="scrollbar-hide">
      <Container>
        <section className="grid">
          <ButtonBack />

          <TitleText
            title="Buat Mentor 🧑🏽"
            text="Tambahkan mentor lainnya"
            className="border-b-2 border-dashed border-gray/20 py-8"
          />

          <div className="grid max-w-[900px] gap-8">
            <div className="grid grid-cols-[300px_1fr] items-start gap-8 pt-8">
              <div className="grid gap-8">
                <div className="grid gap-1">
                  {imgPreview ? (
                    <Image
                      src={imgPreview as string}
                      alt="preview qrcode image"
                      width={300}
                      height={300}
                      className="aspect-square justify-self-center rounded-xl border-2 border-dashed border-gray/30 bg-gray/10 object-cover object-center p-1"
                    />
                  ) : (
                    <div className="flex size-[300px] items-center justify-center rounded-xl border-2 border-gray/20">
                      <ImageSquare
                        weight="bold"
                        size={48}
                        className="text-gray/50"
                      />
                    </div>
                  )}

                  <p className="text-center text-sm font-medium leading-[170%] text-gray">
                    <strong className="mr-1 text-danger">*</strong>ratio gambar
                    1:1
                  </p>
                </div>

                <Input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  variant="flat"
                  labelPlacement="outside"
                  placeholder="Masukan Foto Mentor"
                  classNames={{
                    input:
                      "block w-full flex-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple file:text-sm file:font-sans file:font-semibold file:text-white hover:file:bg-purple/80",
                  }}
                  onChange={handleFileChange}
                />
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
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleCreateMentor}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Buat Program"}
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
