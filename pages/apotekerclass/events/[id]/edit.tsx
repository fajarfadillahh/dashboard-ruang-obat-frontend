import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { EventTestApotekerclass } from "@/types/event.type";
import { SuccessResponse } from "@/types/global.type";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { onCropComplete } from "@/utils/onCropComplete";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
} from "@nextui-org/react";
import { Calendar, FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

const ArticleEditor = dynamic(
  () => import("@/components/editor/ArticleEditor"),
  {
    ssr: false,
  },
);

type InputType = {
  title: string;
  content: string;
  university_name: string;
  start_registration: string;
  end_registration: string;
};

export default function EditEventTestApotekerclassPage({
  token,
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const rawDate = event.registration_date;
  const [startStr, endStr] = rawDate.split(" - ");

  const [input, setInput] = useState<InputType>({
    title: `${event.title}`,
    content: `${event.content}`,
    university_name: `${event.university_name}`,
    start_registration: `${startStr}`,
    end_registration: `${endStr}`,
  });
  const [file, setFile] = useState<string | ArrayBuffer | null>(event.img_url);
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [searchUniversities, setSearchUniversities] = useState(
    event.university_name,
  );
  const [searchUniversitiesValue] = useDebounce(searchUniversities, 300);
  const [universities, setUniversities] = useState<{ name: string }[]>([]);

  const fetchUniversities = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setUniversities([]);
      return;
    }

    setLoadingUniversities(true);

    try {
      const response: SuccessResponse<{ name: string }[]> = await fetcher({
        url: `/universities/search?q=${query}`,
        method: "GET",
      });

      setUniversities(response.data);
    } catch (error) {
      console.error(error);
      setUniversities([]);
    } finally {
      setLoadingUniversities(false);
    }
  }, []);

  const universityOptions = useMemo(() => {
    return universities.slice(0, 15);
  }, [universities]);

  const handleUniversitySelection = useCallback((selectedKey: Key | null) => {
    if (selectedKey) {
      setInput((prev) => ({
        ...prev,
        university: `${selectedKey}`,
      }));
      setSearchUniversities(`${selectedKey}`);
    }
  }, []);

  async function handleEditEventTestApotekerclass() {
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
        formData.append("events", fileConvert);
      }

      formData.append("event_id", event.event_id);
      formData.append("title", input.title);
      formData.append("content", input.content);
      formData.append("university_name", searchUniversities);
      formData.append(
        "registration_date",
        `${input.start_registration} - ${input.end_registration}`,
      );

      await fetcher({
        url: "/events",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      toast.success("Event ujian berhasil diedit!");
      router.back();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUniversities(searchUniversitiesValue);
  }, [searchUniversitiesValue, fetchUniversities]);

  return (
    <Layout title="Buat Event Ujian">
      <Container>
        <ButtonBack href="/apotekerclass/events" />

        <TitleText
          title="Buat Event Ujian ✏️"
          text="Buat event ujian baru untuk dibagikan kepada pengguna."
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid grid-cols-[350px_1fr] items-start gap-16 pt-8">
          <div className="grid gap-6">
            <div className="grid gap-1.5">
              <p className="text-center text-sm font-medium text-gray">
                <strong className="mr-1 text-danger">*</strong>ratio gambar 1:1
              </p>

              <div className="aspect-square h-full w-full rounded-xl border-2 border-dashed border-gray/20 p-1">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gray/20">
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
            </div>

            <Input
              isRequired
              type="file"
              accept="image/jpg, image/png"
              variant="flat"
              label="Logo Universitas"
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
              label="Judul Event"
              labelPlacement="outside"
              placeholder="Contoh: Jadwal Ujian Universitas Pancasila"
              name="title"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              classNames={customStyleInput}
            />

            <Autocomplete
              isRequired
              variant="flat"
              label="Asal Universitas"
              labelPlacement="outside"
              placeholder="Masukan Nama Universitas"
              inputValue={searchUniversities}
              onInputChange={setSearchUniversities}
              onSelectionChange={handleUniversitySelection}
              isLoading={loadingUniversities}
              inputProps={{
                classNames: {
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                },
              }}
              classNames={{
                listboxWrapper: "max-h-60",
              }}
              onFocus={() => {
                if (
                  input.university_name &&
                  searchUniversities === input.university_name
                ) {
                  setSearchUniversities("");
                }
              }}
              selectedKey={input.university_name}
            >
              {universityOptions.map((university) => (
                <AutocompleteItem
                  key={university.name}
                  value={university.name}
                  textValue={university.name}
                >
                  {university.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                isRequired
                hideTimeZone
                showMonthAndYearPickers
                variant="flat"
                label="Pendaftaran Dibuka"
                labelPlacement="outside"
                endContent={<Calendar weight="duotone" size={20} />}
                hourCycle={24}
                minValue={today(getLocalTimeZone())}
                defaultValue={
                  input.start_registration
                    ? parseDate(input.start_registration.substring(0, 10)).add({
                        days: 1,
                      })
                    : undefined
                }
                onChange={(e) => {
                  const value = e.toString();
                  const date = new Date(value);
                  date.setHours(0, 0, 0, 0);
                  setInput({
                    ...input,
                    start_registration: date.toISOString(),
                  });
                }}
              />

              <DatePicker
                isRequired
                hideTimeZone
                showMonthAndYearPickers
                variant="flat"
                label="Pendaftaran Ditutup"
                labelPlacement="outside"
                endContent={<Calendar weight="duotone" size={20} />}
                minValue={today(getLocalTimeZone()).add({ days: 1 })}
                defaultValue={
                  input.end_registration
                    ? parseDate(input.end_registration.substring(0, 10))
                    : undefined
                }
                onChange={(e) => {
                  const value = e.toString();
                  const date = new Date(value);
                  date.setHours(23, 59, 59, 999);
                  setInput({
                    ...input,
                    end_registration: date.toISOString(),
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <p className="text-sm text-foreground after:ml-0.5 after:text-danger after:content-['*']">
                Ringkasan Konten
              </p>

              <ArticleEditor
                value={input.content}
                onChange={(text) => {
                  setInput({ ...input, content: text });
                }}
                token={token}
              />
            </div>

            <Button
              isLoading={loading}
              isDisabled={
                loading ||
                !file ||
                !input.title.trim() ||
                !input.content.trim() ||
                !searchUniversities.trim() ||
                !input.start_registration.trim() ||
                !input.end_registration.trim()
              }
              color="secondary"
              startContent={
                !loading && <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleEditEventTestApotekerclass}
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

export const getServerSideProps = withToken(async (ctx, token) => {
  const { params } = ctx;

  const response: SuccessResponse<EventTestApotekerclass> = await fetcher({
    url: `/events/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

  return {
    props: {
      event: response.data,
    },
  };
});
