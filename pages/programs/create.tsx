import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  getKeyValue,
  Input,
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
import { FloppyDisk, MagnifyingGlass } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateProgramPage({
  tests,
  token,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const [input, setInput] = useState<{
    title: string;
    price: number;
  }>({
    title: "",
    price: 0,
  });
  const [selectedType, setSelectedType] = useState<string>("");
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState(false);

  const columnsTest = [
    { name: "ID Ujian", uid: "test_id" },
    { name: "Judul Ujian", uid: "title" },
  ];

  async function handleCreateProgram() {
    setLoading(true);

    try {
      const data = {
        title: input.title,
        type: selectedType,
        ...(selectedType === "paid" && { price: input.price }),
        tests: Array.from(value),
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/admin/programs",
        method: "POST",
        token,
        data: data,
      });

      window.location.href = "/programs";
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
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

  return (
    <Layout title="Buat Program">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="divide-gray/200 mt-8 divide-y-2 divide-dashed">
            <div className="grid gap-1 pb-8">
              <h1 className="text-[22px] font-bold -tracking-wide text-black">
                Buat Program ✏️
              </h1>
              <p className="font-medium text-gray">
                Buatlah program yang menarik untuk para mahasiswa.
              </p>
            </div>

            <div className="grid gap-6 py-8">
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

              <div className="grid grid-cols-[300px_1fr] items-start gap-4">
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

            <div className="grid pt-12">
              <div className="sticky left-0 top-0 z-50 grid grid-cols-[1fr_400px] gap-6 bg-white pb-4">
                <Input
                  type="text"
                  variant="flat"
                  labelPlacement="outside"
                  placeholder="Cari Ujian Berdasarkan ID..."
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
                />

                <Button
                  isLoading={loading}
                  variant="solid"
                  color="secondary"
                  startContent={<FloppyDisk weight="bold" size={18} />}
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
                  items={tests}
                  emptyContent={
                    <span className="text-sm font-semibold italic text-gray">
                      Pengguna tidak ditemukan!
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
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

type DataProps = {
  tests?: TestType[];
  token?: string;
  error?: ErrorDataType;
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: "/admin/tests?page=all",
      method: "GET",
      token,
    })) as SuccessResponse<TestType[]>;

    return {
      props: {
        tests: response.data,
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
