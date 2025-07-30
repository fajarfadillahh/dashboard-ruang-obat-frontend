import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingData from "@/components/loading/LoadingData";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { DetailsPackageSubscription } from "@/types/subscriptions/packages.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input } from "@nextui-org/react";
import { Clock, FloppyDisk, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputState = {
  name: string;
  price: number;
  duration: number;
  type: "apotekerclass";
  link_order: string;
};

type BenefitState = {
  benefit_id: string;
  description: string;
};

export default function EditPackagePage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { data, isLoading, error, mutate } = useSWR<
    SuccessResponse<DetailsPackageSubscription>
  >({
    url: `/subscriptions/packages/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputState>({
    name: "",
    price: 0,
    duration: 0,
    type: "apotekerclass",
    link_order: "",
  });
  const [benefits, setBenefits] = useState<BenefitState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setInput({
      name: data?.data.name as string,
      price: data?.data.price || 0,
      duration: data?.data.duration || 0,
      type: "apotekerclass",
      link_order: data?.data.link_order as string,
    });
    setBenefits(data?.data.benefits as BenefitState[]);
  }, [data]);

  function addBenefit() {
    setBenefits((prev) => [
      ...prev,
      {
        benefit_id: `idKey-${crypto.randomUUID()}`,
        description: "",
      },
    ]);
  }

  function updateBenefit(index: number, key: keyof BenefitState, value: any) {
    setBenefits((prev) =>
      prev.map((benefit, i) =>
        i === index ? { ...benefit, [key]: value } : benefit,
      ),
    );
  }

  function removeBenefit(index: number) {
    // remove local data
    setBenefits(benefits.filter((_, i) => i !== index));
  }

  function handleRemoveBenefit(index: number) {
    const benefit = benefits[index];

    if (benefit.benefit_id?.startsWith("idKey-")) {
      removeBenefit(index);
    } else {
      handleDeleteBenefit(benefit.benefit_id);
    }
  }

  async function handleDeleteBenefit(benefit_id: string) {
    try {
      await fetcher({
        url: `/subscriptions/benefits/${benefit_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Benefit berhasil dihapus!");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  async function handleEditPackage() {
    setLoading(true);

    try {
      const payload = {
        ...input,
        package_id: data?.data.package_id,
        benefits,
        by: session.data?.user.fullname,
        token,
      };

      await fetcher({
        url: "/subscriptions/packages",
        method: "PATCH",
        data: payload,
        token,
      });

      mutate();
      toast.success("Paket berhasil diubah!");
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
      <Layout title="Edit Paket">
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
    <Layout title="Edit Paket" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText
          title="Edit Paket 📋"
          text="Edit data paket yang sudah ditambahkan"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        {isLoading ? (
          <LoadingData />
        ) : (
          <div className="grid max-w-[700px] gap-8 pt-8">
            <div className="grid gap-6">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Nama Paket"
                labelPlacement="outside"
                placeholder="Contoh: Paket Video Pembelajaran Keren"
                name="name"
                value={input.name}
                onChange={(e) =>
                  setInput({
                    ...input,
                    name: e.target.value,
                  })
                }
                classNames={customStyleInput}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  isRequired
                  type="number"
                  variant="flat"
                  label="Harga Paket"
                  labelPlacement="outside"
                  placeholder="Contoh: 500.000"
                  name="price"
                  value={input.price.toString()}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      price: Number(e.target.value),
                    })
                  }
                  startContent={
                    <span className="text-sm font-semibold text-gray">Rp</span>
                  }
                  classNames={customStyleInput}
                />

                <Input
                  isRequired
                  type="number"
                  variant="flat"
                  label="Durasi Paket"
                  labelPlacement="outside"
                  placeholder="Contoh: 6"
                  name="duration"
                  value={input.duration.toString()}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      duration: Number(e.target.value),
                    })
                  }
                  startContent={
                    <Clock weight="duotone" size={18} className="text-gray" />
                  }
                  classNames={customStyleInput}
                />
              </div>

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Link Order"
                labelPlacement="outside"
                placeholder="Contoh: https://www.lynk.id/xxxxx"
                name="link_order"
                value={input.link_order}
                onChange={(e) =>
                  setInput({
                    ...input,
                    link_order: e.target.value,
                  })
                }
                classNames={customStyleInput}
              />

              <div className="mt-4 grid gap-4">
                <h6 className="font-bold text-black">Benefit Paket</h6>

                <div className="grid gap-2">
                  {benefits?.map((benefit, index) => (
                    <div
                      key={benefit.benefit_id || index}
                      className="flex items-center gap-4"
                    >
                      <Input
                        isRequired
                        type="text"
                        variant="flat"
                        labelPlacement="outside"
                        value={benefit.description}
                        onChange={(e) =>
                          updateBenefit(index, "description", e.target.value)
                        }
                        placeholder="Contoh: Akses Semua Video Pembelajaran"
                        classNames={customStyleInput}
                      />

                      <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        onClick={() => handleRemoveBenefit(index)}
                      >
                        <Trash
                          weight="duotone"
                          size={18}
                          className="text-danger"
                        />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<Plus weight="bold" size={18} />}
                  onClick={addBenefit}
                  className="font-bold"
                >
                  Tambahkan Benefit
                </Button>
              </div>
            </div>

            <Button
              isLoading={loading}
              isDisabled={loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleEditPackage}
              className="w-max justify-self-end font-semibold"
            >
              {loading ? "Tunggu Sebentar..." : "Simpan Perubahan"}
            </Button>
          </div>
        )}
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
