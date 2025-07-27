import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Test, TestsResponse } from "@/types/test.type";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { onCropComplete } from "@/utils/onCropComplete";
import {
  Button,
  getKeyValue,
  Input,
  Pagination,
  Radio,
  RadioGroup,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  title: string;
  price: number;
  type: string;
  url_qr_code?: string;
};

export default function CreateProgramPage({
  query,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { setSearch, searchValue } = useSearch(800);
  const { data, isLoading, error } = useSWR<SuccessResponse<TestsResponse>>({
    url: getUrl("/admin/tests", query),
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputType>({
    title: "",
    price: 0,
    type: "",
    url_qr_code: "",
  });
  const [dataTest, setDataTest] = useState<Selection>(new Set([]));

  const [file, setFile] = useState<string | ArrayBuffer | null>();
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (searchValue) {
      router.push({
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push("/programs/create");
    }
  }, [searchValue]);

  useEffect(() => {
    const isSelectedTest = Array.from(dataTest);
    const isInputValid = [
      file,
      input.title,
      input.type,
      input.url_qr_code,
      input.type !== "paid" || input.price,
      isSelectedTest.length > 0,
    ].every(Boolean);

    setIsButtonDisabled(!isInputValid);
  }, [input, file, dataTest]);

  const columnsTest = [
    { name: "ID Ujian", uid: "test_id" },
    { name: "Judul Ujian", uid: "title" },
  ];

  async function handleCreateProgram() {
    setLoading(true);

    try {
      const formData = new FormData();

      const croppedImage = await getCroppedImg(file, croppedAreaPixels);
      const response = await fetch(croppedImage as string);
      const blob = await response.blob();
      const fileConvert = new File([blob], `${filename}`, {
        type,
      });
      formData.append("qr_code", fileConvert);
      formData.append("url_qr_code", input.url_qr_code as string);

      formData.append("title", input.title);
      formData.append("type", input.type);
      formData.append("by", session.data?.user.fullname as string);

      if (input.type == "paid") {
        formData.append("price", `${input.price}`);
      }

      Array.from(dataTest).forEach((value: any) =>
        formData.append("tests[]", value),
      );

      await fetcher({
        url: "/admin/programs",
        method: "POST",
        data: formData,
        file: true,
        token,
      });

      toast.success("Program berhasil dibuat");
      router.push("/programs");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <Layout title="Buat Program">
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
    <Layout title="Buat Program">
      <Container>
        <ButtonBack href="/programs" />

        <TitleText
          title="Buat Program ✏️"
          text="Buatlah program yang menarik untuk para mahasiswa"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid grid-cols-[300px_1fr] items-start gap-16 pt-8">
          {/* input image */}
          <div className="grid gap-8">
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
                <strong className="mr-1 text-danger">*</strong>ratio gambar 1:1
              </p>
            </div>

            <div className="grid gap-6">
              <Input
                isRequired
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                variant="flat"
                label="Gambar QR Code"
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

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Link QR Code"
                labelPlacement="outside"
                placeholder="Contoh: https://chat.whatsapp.com/xxxxx"
                name="url_qr_code"
                value={input.url_qr_code}
                onChange={(e) =>
                  setInput({ ...input, url_qr_code: e.target.value })
                }
                classNames={customStyleInput}
              />
            </div>
          </div>

          {/* input data */}
          <div className="grid gap-8">
            <div className="grid gap-6">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Judul Program"
                labelPlacement="outside"
                placeholder="Contoh: Program Tryout Masuk Apoteker"
                name="title"
                value={input.title}
                onChange={(e) => setInput({ ...input, title: e.target.value })}
                classNames={customStyleInput}
              />

              <div className="grid grid-cols-2 gap-4">
                <RadioGroup
                  isRequired
                  aria-label="select provider type"
                  label="Tipe Program"
                  color="secondary"
                  value={input.type}
                  onValueChange={(value) =>
                    setInput((prev) => ({ ...prev, type: value }))
                  }
                  classNames={{
                    base: "font-semibold text-black",
                    label: "text-sm font-normal text-foreground",
                  }}
                >
                  <Radio value="free">Gratis</Radio>
                  <Radio value="paid">Berbayar</Radio>
                </RadioGroup>

                {input.type == "paid" && (
                  <Input
                    isRequired
                    type="number"
                    variant="flat"
                    label="Harga Program"
                    labelPlacement="outside"
                    placeholder="Contoh: 500.000"
                    name="price"
                    value={input.price.toString()}
                    onChange={(e) =>
                      setInput({ ...input, price: Number(e.target.value) })
                    }
                    startContent={
                      <span className="text-sm font-semibold text-gray">
                        Rp
                      </span>
                    }
                    classNames={customStyleInput}
                  />
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <SearchInput
                placeholder="Cari Nama Ujian atau ID Ujian..."
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <Table
                isStriped
                aria-label="users table"
                color="secondary"
                selectionMode="multiple"
                selectedKeys={dataTest}
                onSelectionChange={setDataTest}
                classNames={customStyleTable}
                className="scrollbar-hide"
              >
                <TableHeader columns={columnsTest}>
                  {(column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  )}
                </TableHeader>

                <TableBody
                  items={data?.data.tests}
                  emptyContent={<EmptyData text="Ujian tidak ditemukan!" />}
                >
                  {(item: Test) => (
                    <TableRow key={item.test_id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {data?.data.tests.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={data.data.page as number}
                  total={data.data.total_pages as number}
                  onChange={(e) => {
                    router.push({
                      query: {
                        ...router.query,
                        page: e,
                      },
                    });
                  }}
                  className="justify-self-center"
                  classNames={{
                    cursor: "bg-purple text-white",
                  }}
                />
              ) : null}
            </div>

            <Button
              isLoading={loading}
              isDisabled={isButtonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleCreateProgram}
              className="justify-self-end font-semibold"
            >
              {loading ? "Tunggu Sebentar..." : "Buat Program"}
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { query } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
    },
  };
});
