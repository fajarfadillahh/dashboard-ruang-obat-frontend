import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingData from "@/components/loading/LoadingData";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Tryout, TryoutResponse } from "@/types/tryout.type";
import { DetailsUniversityResponse } from "@/types/university.type";
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
  Selection,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type InputType = {
  title: string;
  description: string;
};

export default function EditUniversityPage({
  token,
  university,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();

  const [input, setInput] = useState<InputType>({
    title: university.title,
    description: university.description,
  });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR<SuccessResponse<TryoutResponse>>({
    url: getUrl("/universities/tryouts", { q: searchValue, page }),
    method: "GET",
    token,
  });
  const [dataTryout, setDataTryout] = useState<Selection>(
    new Set(university.tests.map((test) => test.ass_id)),
  );

  const [file, setFile] = useState<string | ArrayBuffer | null>(
    university.thumbnail_url,
  );
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSelected, setIsSelected] = useState<boolean>(!university.is_active);

  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    const isSelectedTest = Array.from(dataTryout);
    const isInputValid = [input, isSelectedTest.length > 0].every(Boolean);

    setIsButtonDisabled(!isInputValid);
  }, [input, file, dataTryout]);

  const columnsTryout = [
    { name: "ID Tryout", uid: "ass_id" },
    { name: "Judul Tryout", uid: "title" },
  ];

  async function handleEditUniversity() {
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
        formData.append("thumbnail", fileConvert);
      }

      formData.append("univ_id", university.univ_id);
      formData.append("title", input.title);
      formData.append("description", input.description);
      formData.append("by", session.data?.user.fullname as string);
      formData.append("is_active", String(!isSelected));

      Array.from(dataTryout).forEach((value: any) =>
        formData.append("tests[]", value),
      );

      await fetcher({
        url: "/universities",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      toast.success("Universitas berhasil diubah!");
      router.push("/apotekerclass/university");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <Layout title="Edit Universitas">
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

  return (
    <Layout title="Edit Universitas" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="Edit Universitas 🏛️"
          text="Sesuaikan data universitas sekarang"
        />

        {isLoading ? (
          <LoadingData />
        ) : (
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
                <Switch
                  size="sm"
                  color="secondary"
                  isSelected={isSelected}
                  onValueChange={setIsSelected}
                  className="-mt-4 text-sm font-semibold text-black"
                >
                  Nonaktifkan Universitas
                </Switch>

                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Nama Universitas"
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

                <Textarea
                  isRequired
                  minRows={4}
                  type="text"
                  variant="flat"
                  label="Deskripsi"
                  labelPlacement="outside"
                  placeholder="Contoh: Universitas Pancasila adalah..."
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

                <div className="grid gap-4">
                  <SearchInput
                    placeholder="Cari Nama Tryout atau ID Tryout..."
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => setSearch("")}
                  />

                  <Table
                    isStriped
                    aria-label="tryout table"
                    color="secondary"
                    selectionMode="multiple"
                    selectedKeys={dataTryout}
                    onSelectionChange={setDataTryout}
                    classNames={customStyleTable}
                    className="scrollbar-hide"
                  >
                    <TableHeader columns={columnsTryout}>
                      {(column) => (
                        <TableColumn key={column.uid}>
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>

                    <TableBody
                      items={data?.data.tryouts}
                      emptyContent={
                        <EmptyData text="Tryout tidak ditemukan!" />
                      }
                    >
                      {(item: Tryout) => (
                        <TableRow key={item.ass_id}>
                          {(columnKey) => (
                            <TableCell>
                              {getKeyValue(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {!isLoading && data?.data.tryouts.length ? (
                    <Pagination
                      isCompact
                      showControls
                      page={data?.data.page as number}
                      total={data?.data.total_pages as number}
                      onChange={(e) => {
                        divRef.current?.scrollIntoView({ behavior: "smooth" });
                        setPage(`${e}`);
                      }}
                      className="justify-self-center"
                      classNames={{
                        cursor: "bg-purple text-white",
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <Button
              isLoading={loading}
              isDisabled={isButtonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleEditUniversity}
              className="justify-self-end font-semibold"
            >
              Simpan Universitas
            </Button>
          </div>
        )}
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx, token) => {
  const { params } = ctx;

  const response: SuccessResponse<DetailsUniversityResponse> = await fetcher({
    url: `/universities/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

  return {
    props: {
      university: response?.data,
    },
  };
});
