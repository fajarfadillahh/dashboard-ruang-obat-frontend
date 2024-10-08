import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
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
  const [input, setInput] = useState<{ title: string; price?: number }>({
    title: "",
    price: undefined,
  });
  const [selectedType, setSelectedType] = useState<string>("");
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState(false);

  async function handleCreateProgram() {
    setLoading(true);

    try {
      await fetcher({
        url: "/admin/programs",
        method: "POST",
        token,
        data: {
          title: input.title,
          type: selectedType,
          price: input.price,
          tests: Array.from(value),
          by: session.data?.user.fullname,
        },
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

          <div className="border-gray/200 grid gap-1 border-b-2 border-dashed py-8">
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
              onChange={(e) =>
                setInput({
                  ...input,
                  [e.target.name]: e.target.value,
                })
              }
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
                  onChange={(e) =>
                    setInput({
                      ...input,
                      [e.target.name]: e.target.value,
                    })
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

            <div className="grid gap-4">
              <Select
                isRequired
                aria-label="select test"
                label="Pilih Ujian"
                labelPlacement="outside"
                placeholder="Silakan Pilih Ujian..."
                items={tests}
                selectedKeys={value}
                onSelectionChange={setValue}
                selectionMode="multiple"
                classNames={{
                  value: "placeholder:font-black placeholder:text-gray",
                }}
              >
                {(test) => (
                  <SelectItem key={test.test_id}>{test.title}</SelectItem>
                )}
              </Select>

              <div className="grid gap-2 pl-16 text-sm">
                <h6 className="font-semibold text-black">
                  Ujian (ID) Yang Sudah Dipilih:
                </h6>
                <ul className="grid list-inside list-disc gap-[2px]">
                  {Array.from(value).map((test, index) => (
                    <li key={index} className="font-bold text-purple">
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

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
