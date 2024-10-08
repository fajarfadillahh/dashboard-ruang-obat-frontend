import CardTest from "@/components/card/CardTest";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { TestType } from "@/types/test.type";
import { fetcher } from "@/utils/fetcher";
import { Button, Input } from "@nextui-org/react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

export default function TestsPage({
  tests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  function handleDeleteTest(id: string) {
    console.log(`Ujian dengan ID: ${id} berhasil terhapus!`);
  }

  return (
    <Layout title="Daftar Ujian">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Daftar Ujian ✏️
            </h1>
            <p className="font-medium text-gray">
              Ujian yang disesuaikan dengan kebutuhan
            </p>
          </div>

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center gap-4 bg-white pb-4">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari Ujian..."
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
                className="flex-1"
              />

              <Button
                variant="solid"
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={() => router.push("/tests/create")}
                className="font-semibold"
              >
                Tambah Ujian
              </Button>
            </div>

            <div className="grid gap-2">
              {tests?.map((test: TestType) => (
                <CardTest
                  key={test.test_id}
                  test={test}
                  handleDeleteTest={() => handleDeleteTest(test.test_id)}
                />
              ))}
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  tests?: TestType[];
}> = async ({ req }) => {
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
