import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { ParticipantType } from "@/types/user.type";
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
import {
  FloppyDisk,
  ImageBroken,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

type DetailsProgramResponse = {
  program_id: string;
  title: string;
  type: string;
  price: number;
  is_active: boolean;
  qr_code: string;
  url_qr_code: string;
  total_tests: number;
  total_users: number;
  tests: TestType[];
  participants: ParticipantType[];
};

type TestsResponse = {
  tests: TestType[];
  page: number;
  total_tests: number;
  total_pages: number;
};

export default function EditProgramPage({
  program,
  tests,
  token,
  id,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const [input, setInput] = useState<{
    title: string;
    price: number;
    url_qr_code?: string;
  }>({
    title: program?.title || "",
    price: program?.price || 0,
    url_qr_code: program?.url_qr_code || "",
  });
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, 800);
  const [selectedType, setSelectedType] = useState<string>(program?.type || "");
  const [loading, setLoading] = useState(false);
  const [qrcodeFile, setQrcodeFile] = useState<File | null>();

  const testId = program?.tests.map((test) => test.test_id);
  const [value, setValue] = useState<Selection>(new Set(testId));
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

  const columnsTest = [
    { name: "ID Ujian", uid: "test_id" },
    { name: "Judul Ujian", uid: "title" },
  ];

  useEffect(() => {
    const selectedTests = Array.from(value);

    const isFormValid =
      input.title &&
      (selectedType !== "paid" || input.price > 0) &&
      (qrcodeFile || input.url_qr_code) &&
      selectedType &&
      selectedTests.length > 0;

    setIsButtonDisabled(!isFormValid);
  }, [input, selectedType, qrcodeFile, value]);

  async function handleEditProgram() {
    setLoading(true);

    try {
      const fullname: any = session.data?.user.fullname;

      const formData = new FormData();
      formData.append("title", input.title);
      formData.append("type", selectedType);
      formData.append("program_id", program?.program_id as string);

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

      toast.success("Berhasil Memperbarui Program");
      window.location.href = "/programs";
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

  return (
    <Layout title="Edit Program">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="divide-gray/200 mt-8 divide-y-2 divide-dashed">
            <div className="grid gap-1 pb-8">
              <h1 className="text-[22px] font-bold -tracking-wide text-black">
                Edit Program ✏️
              </h1>
              <p className="font-medium text-gray">
                Anda bebas menyesuaikan program agar lebih menarik
              </p>
            </div>

            <div className="grid gap-6 py-8">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium leading-[170%] text-gray">
                  Gambar QR Code Sebelumnya{" "}
                  <span className="text-danger">*</span>
                </p>

                {program?.qr_code ? (
                  <Image
                    src={`${program?.qr_code}`}
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
                    classNames={{
                      input:
                        "font-semibold placeholder:font-semibold placeholder:text-gray",
                    }}
                    className="flex-1"
                  />
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 pt-12">
              <div className="sticky left-0 top-0 z-50 grid grid-cols-[1fr_400px] gap-6 bg-white">
                <Input
                  type="text"
                  variant="flat"
                  labelPlacement="outside"
                  placeholder="Cari Ujian ID atau Nama Ujian"
                  onChange={(e) => setSearch(e.target.value)}
                  startContent={
                    <MagnifyingGlass
                      weight="bold"
                      size={18}
                      className="text-gray"
                    />
                  }
                  classNames={{
                    input:
                      "font-semibold placeholder:font-semibold placeholder:text-gray",
                  }}
                  className="max-w-[500px]"
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
                defaultSelectedKeys={value}
                classNames={customStyleTable}
                className="scrollbar-hide"
              >
                <TableHeader columns={columnsTest}>
                  {(column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  )}
                </TableHeader>

                <TableBody
                  items={tests?.tests}
                  emptyContent={
                    <span className="text-sm font-semibold italic text-gray">
                      Ujian tidak ditemukan!
                    </span>
                  }
                >
                  {(item: TestType) => (
                    <TableRow key={item.test_id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {tests?.tests.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={tests?.page as number}
                  total={tests?.total_pages as number}
                  onChange={(e) => {
                    router.push({
                      pathname: `/programs/edit/${id}`,
                      query: {
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
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  program?: DetailsProgramResponse;
  tests?: TestsResponse;
  id?: string;
  token?: string;
  error?: ErrorDataType;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/tests?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/tests?page=${query.page ? query.page : 1}`;
}

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  params,
  query,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const [responseProgram, responseTests] = await Promise.all([
      fetcher({
        url: `/admin/programs/${encodeURIComponent(params?.id as string)}`,
        method: "GET",
        token,
      }) as Promise<SuccessResponse<DetailsProgramResponse>>,

      fetcher({
        url: getUrl(query) as string,
        method: "GET",
        token,
      }) as Promise<SuccessResponse<TestsResponse>>,
    ]);

    return {
      props: {
        program: responseProgram.data,
        tests: responseTests.data,
        id: params?.id as string,
        token,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
