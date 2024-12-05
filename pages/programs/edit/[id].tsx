import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { SuccessResponse } from "@/types/global.type";
import { DetailsProgramResponse } from "@/types/program.type";
import { Test, TestsResponse } from "@/types/test.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
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
import { useEffect, useState } from "react";
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

export default function EditProgramPage({
  token,
  params,
  query,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { setSearch, searchValue } = useSearch(800);
  const {
    data: program,
    error,
    isLoading,
  } = useSWR<SuccessResponse<DetailsProgramResponse>>({
    url: `/admin/programs/${encodeURIComponent(params.id as string)}`,
    method: "GET",
    token,
  });
  const { data: test } = useSWR<SuccessResponse<TestsResponse>>({
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
  const [qrcodeFile, setQrcodeFile] = useState<File | null>();
  const [value, setValue] = useState<Selection>(new Set());
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (searchValue) {
      router.push({
        pathname: `/programs/edit/${id}`,
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push(`/programs/edit/${id}`);
    }
  }, [searchValue]);

  useEffect(() => {
    if (program?.data) {
      const { type, title, price, url_qr_code, tests } = program.data;
      const testIds = tests.map((test) => test.test_id);

      setValue(new Set(testIds));
      setSelectedType(type);
      setInput({
        title,
        price: price ?? 0,
        url_qr_code,
      });
    }
  }, [program]);

  useEffect(() => {
    const selectedTests = Array.from(value);
    const isFormValid = [
      input?.title?.trim(),
      selectedType !== "paid" || input?.price > 0,
      qrcodeFile || input?.url_qr_code?.trim(),
      selectedType.trim(),
      selectedTests.length,
    ].every(Boolean);

    setIsButtonDisabled(!isFormValid);
  }, [input, selectedType, qrcodeFile, value]);

  const columnsTest = [
    { name: "ID Ujian", uid: "test_id" },
    { name: "Judul Ujian", uid: "title" },
  ];

  async function handleEditProgram() {
    setLoading(true);

    try {
      const fullname: any = session.data?.user.fullname;

      const formData = new FormData();
      formData.append("title", input.title);
      formData.append("type", selectedType);
      formData.append("program_id", program?.data.program_id as string);

      if (selectedType == "paid") {
        formData.append("price", `${input.price}`);
      }

      Array.from(value).forEach((test: any) =>
        formData.append("tests[]", test),
      );
      formData.append("by", fullname);
      formData.append("qr_code", qrcodeFile as File);
      formData.append("url_qr_code", input.url_qr_code as string);

      await fetcher({
        url: "/admin/programs",
        method: "PATCH",
        token,
        data: formData,
        file: true,
      });

      toast.success("Program Berhasil Di Perbarui");
      router.push("/programs");
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  if (error) {
    return (
      <Layout title="Edit Program">
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
    <Layout title="Edit Program">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="mt-8 divide-y-2 divide-dashed divide-gray/20">
            <TitleText
              title="Edit Program ✏️"
              text="Anda bebas menyesuaikan program agar lebih menarik"
              className="pb-8"
            />

            <div className="grid gap-6 py-8">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium leading-[170%] text-gray">
                  Gambar QR Code Sebelumnya{" "}
                  <span className="text-danger">*</span>
                </p>

                {program?.data.qr_code ? (
                  <Image
                    src={`${program?.data.qr_code}`}
                    alt="qrcode image"
                    width={180}
                    height={180}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray/30 bg-gray/10 object-cover object-center p-1"
                  />
                ) : (
                  <div className="flex aspect-square size-[180px] flex-col items-center justify-center gap-2 rounded-xl bg-gray/10">
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
                  classNames={{
                    input:
                      "font-semibold placeholder:font-normal placeholder:text-default-600",
                  }}
                  className="flex-1"
                />

                <Input
                  isRequired
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  variant="flat"
                  label="Gambar QR Code Baru"
                  labelPlacement="outside"
                  classNames={{
                    input:
                      "block w-full flex-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple file:text-sm file:font-sans file:font-semibold file:text-white hover:file:bg-purple/80",
                  }}
                  onChange={(e) => {
                    if (e.target.files) {
                      setQrcodeFile(e.target.files[0]);
                    } else {
                      setQrcodeFile(null);
                    }
                  }}
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
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
                className="flex-1"
              />

              <div className="grid grid-cols-2 items-start gap-4">
                <RadioGroup
                  isRequired
                  aria-label="select program type"
                  label={
                    <span className="text-sm font-normal text-foreground">
                      Tipe Program
                    </span>
                  }
                  color="secondary"
                  value={selectedType}
                  onValueChange={setSelectedType}
                  classNames={{
                    base: "font-semibold text-black",
                  }}
                >
                  <Radio value="free">Gratis</Radio>
                  <Radio value="paid">Berbayar</Radio>
                </RadioGroup>

                {selectedType == "paid" ? (
                  <Input
                    isRequired
                    type="number"
                    variant="flat"
                    label="Harga Program"
                    labelPlacement="outside"
                    placeholder="Contoh: 500.000"
                    value={input.price.toString()}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    startContent={
                      <span className="text-sm font-semibold text-default-600">
                        Rp
                      </span>
                    }
                    classNames={{
                      input:
                        "font-semibold placeholder:font-semibold placeholder:text-gray",
                    }}
                    className="flex-1"
                  />
                ) : null}
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
                  variant="solid"
                  color="secondary"
                  startContent={
                    loading ? null : <FloppyDisk weight="bold" size={18} />
                  }
                  onClick={handleEditProgram}
                  className="w-max justify-self-end font-bold"
                >
                  {loading ? "Tunggu Sebentar..." : "Simpan Perubahan"}
                </Button>
              </div>

              <Table
                isHeaderSticky
                aria-label="tests table"
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
                  items={test?.data.tests || []}
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

              {test?.data.tests.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={test?.data.page as number}
                  total={test?.data.total_pages as number}
                  onChange={(e) => {
                    router.push({
                      pathname: `/programs/edit/${id}`,
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
  id: string;
  params: ParsedUrlQuery;
  query: ParsedUrlQuery;
}> = async ({ req, params, query }) => {
  const id = params?.id as string;

  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
      query,
      id,
    },
  };
};
