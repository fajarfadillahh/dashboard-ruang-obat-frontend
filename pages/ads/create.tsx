import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { onCropComplete } from "@/utils/onCropComplete";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  description: string;
  type: string;
  link: string;
};

export default function CreateAdPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [input, setInput] = useState<InputType>({
    title: "",
    description: "",
    type: "",
    link: "",
  });
  const [file, setFile] = useState<string | ArrayBuffer | null>();
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  async function handleCreateAd() {
    setLoading(true);

    try {
      const formData = new FormData();

      const croppedImage = await getCroppedImg(file, croppedAreaPixels);
      const response = await fetch(croppedImage as string);
      const blob = await response.blob();
      const fileConvert = new File([blob], `${filename}`, {
        type,
      });
      formData.append("ads", fileConvert);

      formData.append("title", input.title);
      formData.append("description", input.description);
      formData.append("type", input.type);
      formData.append("link", input.link);

      await fetcher({
        url: "/ads",
        method: "POST",
        data: formData,
        file: true,
        token,
      });

      toast.success("Ads berhasil dibuat!");
      router.push("/ads");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const isInputValid = [
      file,
      input.title,
      input.type,
      input.description,
      input.link,
    ].every(Boolean);

    setIsButtonDisabled(!isInputValid);
  }, [input]);

  return (
    <Layout title="Buat Ads">
      <Container>
        <ButtonBack href="/ads" />

        <TitleText
          title="Buat Ads ✏️"
          text="Ads artikel bertujuan untuk meningkatkan visibilitas produk atau layanan Anda."
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid grid-cols-[400px_1fr] items-start gap-16 pt-8">
          <div className="grid gap-6">
            <div className="grid gap-1.5">
              <p className="text-center text-sm font-medium text-gray">
                <strong className="mr-1 text-danger">*</strong>ratio gambar 16:9
              </p>

              <div className="aspect-video h-full w-[400px] rounded-xl border-2 border-dashed border-gray/20 p-1">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gray/20">
                  <Cropper
                    image={file as string}
                    crop={cropImage}
                    zoom={zoomImage}
                    aspect={16 / 9}
                    onCropChange={setCropImage}
                    onCropComplete={onCropComplete({
                      setCroppedAreaPixels,
                    })}
                    onZoomChange={setZoomImage}
                  />
                </div>
              </div>
            </div>

            <Input
              isRequired
              type="file"
              accept="image/jpg, image/png"
              variant="flat"
              label="Gambar Ads"
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
                  toast.error("Ekstensi file harus png atau jpg");
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
          </div>

          <div className="grid gap-6">
            <Input
              isRequired
              type="text"
              variant="flat"
              label="Judul"
              labelPlacement="outside"
              placeholder="Contoh: Ruang Masuk Apoteker"
              name="title"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              classNames={customStyleInput}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                isRequired
                aria-label="type"
                size="md"
                variant="flat"
                label="Tipe"
                labelPlacement="outside"
                placeholder="Pilih Tipe Ads"
                selectedKeys={[input.type]}
                onChange={(e) => setInput({ ...input, type: e.target.value })}
                classNames={{
                  value: "font-semibold text-gray",
                }}
              >
                <SelectItem key="homepage">Homepage</SelectItem>
                <SelectItem key="detailpage">Detailpage</SelectItem>
              </Select>

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Link"
                labelPlacement="outside"
                placeholder="Contoh: Link ke Halaman Ruang Masuk Apoteker"
                name="link"
                value={input.link}
                onChange={(e) => setInput({ ...input, link: e.target.value })}
                classNames={customStyleInput}
              />
            </div>

            <Textarea
              isRequired
              variant="flat"
              label="Deskripsi"
              labelPlacement="outside"
              placeholder="Contoh: Ayo kunjungi Program Ruang Masuk Apoteker..."
              value={input.description}
              onChange={(e) => {
                setInput({
                  ...input,
                  description: e.target.value,
                });
              }}
              classNames={customStyleInput}
            />

            <Button
              isLoading={loading}
              isDisabled={isButtonDisabled}
              color="secondary"
              startContent={
                !loading && <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleCreateAd}
              className="mt-8 justify-self-end font-semibold"
            >
              {loading ? "Tunggu Sebentar..." : "Buat Ads"}
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
