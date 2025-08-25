import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { onCropComplete } from "@/utils/onCropComplete";
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Button, DatePicker, Input, TimeInput } from "@nextui-org/react";
import { Calendar, Clock, FloppyDisk } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  link: string;
  date: CalendarDate | null;
  start: ZonedDateTime | null;
  end: ZonedDateTime | null;
};

export default function EditLivePage() {
  const router = useRouter();
  const [input, setInput] = useState<InputType>({
    title: "",
    link: "",
    date: null,
    start: null,
    end: null,
  });

  const [file, setFile] = useState<string | ArrayBuffer | null>();
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  function handleInputChange(
    field: keyof InputType,
    value: string | ZonedDateTime | CalendarDate | null,
  ) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  async function handleEditLive() {
    const formData = new FormData();

    const croppedImage = await getCroppedImg(file, croppedAreaPixels);
    const response = await fetch(croppedImage as string);
    const blob = await response.blob();
    const fileConvert = new File([blob], `${filename}`, {
      type,
    });
    formData.append("thumbnail", fileConvert);

    formData.append("title", input.title);
    formData.append("link", input.link);
    if (input.date) {
      formData.append("date", input.date.toString());
    }
    if (input.start) {
      formData.append("start", input.start.toString());
    }
    if (input.end) {
      formData.append("end", input.end.toString());
    }

    console.log(Object.fromEntries(formData.entries()));
  }

  return (
    <Layout title="Buat Live Teaching">
      <Container>
        <ButtonBack />

        <TitleText
          title="Buat Live Teaching 🎥"
          text="Saatnya buat live yang menarik untuk para mahasiswa"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid grid-cols-[450px_1fr] items-start gap-16 pt-8">
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
              label="Thumbnail Live"
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
              label="Judul Live"
              labelPlacement="outside"
              placeholder="Contoh: Meet The Expert Researcher..."
              name="title"
              value={input.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              classNames={customStyleInput}
            />

            <Input
              isRequired
              type="text"
              variant="flat"
              label="Link Live"
              labelPlacement="outside"
              placeholder="Contoh: https://www.youtube.com/xxxxxx"
              name="link"
              value={input.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              classNames={customStyleInput}
            />

            <div className="flex items-center gap-4">
              <DatePicker
                isRequired
                hideTimeZone
                variant="flat"
                label="Tanggal Live"
                labelPlacement="outside"
                endContent={<Calendar weight="duotone" size={20} />}
                minValue={today(getLocalTimeZone())}
                value={input.date}
                onChange={(value) => handleInputChange("date", value)}
              />

              <TimeInput
                isRequired
                variant="flat"
                label="Jam Mulai"
                labelPlacement="outside"
                endContent={<Clock weight="duotone" size={20} />}
                granularity="minute"
                hourCycle={24}
                value={input.start}
                onChange={(value) => handleInputChange("start", value)}
              />

              <TimeInput
                isRequired
                variant="flat"
                label="Jam Selesai"
                labelPlacement="outside"
                endContent={<Clock weight="duotone" size={20} />}
                granularity="minute"
                hourCycle={24}
                value={input.end}
                onChange={(value) => handleInputChange("end", value)}
              />
            </div>

            <Button
              isLoading={loading}
              color="secondary"
              startContent={
                !loading && <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleEditLive}
              className="mt-12 justify-self-end font-semibold"
            >
              {loading ? "Tunggu Sebentar..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
