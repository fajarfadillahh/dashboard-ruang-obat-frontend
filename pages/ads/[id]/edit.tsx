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
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  type: string;
  link: string;
};

export default function EditAdPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [input, setInput] = useState<InputType>({
    title: (router.query.title as string) || "",
    type: (router.query.type as string) || "",
    link: (router.query.link as string) || "",
  });
  const [file, setFile] = useState<string | ArrayBuffer | null>(
    (router.query.img_url as string) || "",
  );
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleEditAd() {
    setLoading(true);

    try {
      const formData = new FormData();

      if (filename) {
        const croppedImage = await getCroppedImg(file, croppedAreaPixels);
        const response = await fetch(croppedImage as string);
        const blob = await response.blob();
        const fileConvert = new File([blob], `${filename}`, {
          type,
        });

        formData.append("ads", fileConvert);
      }

      formData.append("ad_id", router.query.id as string);
      formData.append("title", input.title);
      formData.append("type", input.type);
      formData.append("link", input.link);

      await fetcher({
        url: "/ads",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      toast.success("Ads berhasil diedit!");
      router.push("/ads");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Edit Ads">
      <Container>
        <ButtonBack href="/ads" />

        <TitleText
          title="Edit Ads ✏️"
          text="Ads artikel bertujuan untuk meningkatkan visibilitas produk atau layanan Anda."
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[900px] grid-cols-2 items-start gap-16 pt-8">
          <div className="grid gap-6">
            <div className="grid gap-1.5">
              <p className="text-center text-sm font-medium text-gray">
                <strong className="mr-1 text-danger">*</strong>ratio gambar 16:9
              </p>

              <div className="aspect-video h-full w-full rounded-xl border-2 border-dashed border-gray/20 p-1">
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

                const validTypes = ["image/png", "image/jpg"];

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
              label="Judul Ads"
              labelPlacement="outside"
              placeholder="Contoh: Ruang Masuk Apoteker"
              name="title"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              classNames={customStyleInput}
            />

            <Select
              isRequired
              aria-label="type"
              size="md"
              variant="flat"
              label="Tipe Ads"
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
              label="Link Ads"
              labelPlacement="outside"
              placeholder="Contoh: Link ke Halaman Ruang Masuk Apoteker"
              name="link"
              value={input.link}
              onChange={(e) => setInput({ ...input, link: e.target.value })}
              classNames={customStyleInput}
            />

            <Button
              isLoading={loading}
              isDisabled={
                loading ||
                !file ||
                !input.title.trim() ||
                !input.type.trim() ||
                !input.link.trim()
              }
              color="secondary"
              startContent={
                !loading && <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleEditAd}
              className="mt-12 justify-self-end font-semibold"
            >
              {loading ? "Tunggu Sebentar..." : "Simpan Ads"}
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
