import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { SuccessResponse } from "@/types/global.type";
import { Test, TestsResponse } from "@/types/test.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  getKeyValue,
  Image,
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
import { FloppyDisk, ImageBroken } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  title: string;
  price: number;
  url_qr_code?: string;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/tests?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/tests?page=${query.page ? query.page : 1}`;
}

export default function CreateProgramPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();
  const { setSearch, searchValue } = useSearch(800);
  const { data, error, isLoading } = useSWR<SuccessResponse<TestsResponse>>({
    url: getUrl(query) as string,
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputType>({
    title: "",
    price: 0,
    url_qr_code: "",
  });
  const [selectedType, setSelectedType] = useState<string>("");
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState(false);
  const [qrcodeFile, setQrcodeFile] = useState<File | null>();
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
    const selectedTests = Array.from(value);
    const isFormValid = [
      input.title,
      qrcodeFile,
      input.url_qr_code,
      selectedType,
      selectedType !== "paid" || input.price,
      selectedTests.length > 0,
    ].every(Boolean);

    setIsButtonDisabled(!isFormValid);
  }, [input, qrcodeFile, selectedType, value]);

  const columnsTest = [
    { name: "ID Ujian", uid: "test_id" },
    { name: "Judul Ujian", uid: "title" },
  ];

  async function handleCreateProgram() {
    setLoading(true);

    try {
      const fullname = session.data?.user.fullname;
      const formData = new FormData();

      formData.append("title", input.title);
      formData.append("qr_code", qrcodeFile as File);
      formData.append("url_qr_code", input.url_qr_code as string);
      formData.append("type", selectedType);
      formData.append("by", fullname as string);

      if (selectedType == "paid") {
        formData.append("price", `${input.price}`);
      }

      Array.from(value).forEach((test: any) =>
        formData.append("tests[]", test),
      );

      await fetcher({
        url: "/admin/programs",
        method: "POST",
        token,
        data: formData,
        file: true,
      });

      setQrcodeFile(null);
      toast.success("Program berhasil dibuat");
      router.push("/programs");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setQrcodeFile(null);
      setImagePreview(null);
      return;
    }
    setQrcodeFile(file);

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
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
        <section className="grid">
          <ButtonBack href="/programs" />

          <div className="mt-8 divide-y-2 divide-dashed divide-gray/20">
            <TitleText
              title="Buat Program ✏️"
              text="Buatlah program yang menarik untuk para mahasiswa"
              className="pb-8"
            />

            <div className="grid gap-6 py-8">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium leading-[170%] text-gray">
                  Preview QR Code (ratio 1:1){" "}
                  <span className="text-danger">*</span>
                </p>

                {imagePreview ? (
                  <Image
                    src={imagePreview as string}
                    alt="preview qrcode image"
                    width={180}
                    height={180}
                    className="aspect-square justify-self-center rounded-xl border-2 border-dashed border-gray/30 bg-gray/10 object-cover object-center p-1"
                  />
                ) : (
                  <div className="flex aspect-square size-[180px] flex-col items-center justify-center gap-2 justify-self-center rounded-xl bg-gray/10">
                    <ImageBroken
                      weight="bold"
                      size={28}
                      className="text-gray/50"
                    />
                    <p className="text-[12px] font-bold text-gray/50">
                      Belum ada QR!
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Link QR Code"
                  labelPlacement="outside"
                  placeholder="Masukan Link QR Code"
                  name="title"
                  value={input.url_qr_code}
                  onChange={(e) =>
                    setInput({ ...input, url_qr_code: e.target.value })
                  }
                  classNames={customStyleInput}
                  className="flex-1"
                />

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
                  onChange={handleFileChange}
                />
              </div>

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Judul Program"
                labelPlacement="outside"
                placeholder="Contoh: Kelas Ruangobat Tatap Muka"
                name="title"
                value={input.title}
                onChange={(e) => setInput({ ...input, title: e.target.value })}
                classNames={customStyleInput}
                className="flex-1"
              />

              <div className="grid grid-cols-2 items-start gap-4">
                <RadioGroup
                  isRequired
                  aria-label="select program type"
                  label="Tipe Program"
                  color="secondary"
                  value={selectedType}
                  onValueChange={setSelectedType}
                  classNames={{
                    base: "font-semibold text-black",
                    label: "text-sm font-normal text-foreground",
                  }}
                >
                  <Radio value="free">Gratis</Radio>
                  <Radio value="paid">Berbayar</Radio>
                </RadioGroup>

                {selectedType == "paid" && (
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
                      <span className="text-sm font-semibold text-default-600">
                        Rp
                      </span>
                    }
                    classNames={customStyleInput}
                    className="flex-1"
                  />
                )}
              </div>
            </div>

            <div className="grid pt-12">
              <div className="sticky left-0 top-0 z-50 grid grid-cols-[1fr_400px] gap-6 bg-white pb-4">
                <SearchInput
                  placeholder="Cari Ujian ID atau Nama Ujian"
                  defaultValue={query.q as string}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch("")}
                />

                <Button
                  isLoading={loading}
                  isDisabled={isButtonDisabled || loading}
                  color="secondary"
                  startContent={
                    loading ? null : <FloppyDisk weight="bold" size={18} />
                  }
                  onClick={handleCreateProgram}
                  className="w-max justify-self-end font-bold"
                >
                  {loading ? "Tunggu Sebentar..." : "Buat Program"}
                </Button>
              </div>

              <Table
                isHeaderSticky
                aria-label="users table"
                color="secondary"
                selectionMode="multiple"
                selectedKeys={value}
                onSelectionChange={setValue}
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
                  className="mt-4 justify-self-center"
                  classNames={{
                    cursor: "bg-purple text-white",
                  }}
                />
              ) : null}
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  query: ParsedUrlQuery;
}> = async ({ req, query }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      query,
    },
  };
};
