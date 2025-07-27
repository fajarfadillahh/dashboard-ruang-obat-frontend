import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input } from "@nextui-org/react";
import { Clock, FloppyDisk, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputState = {
  name: string;
  price: number;
  duration: number;
  type: "apotekerclass";
  link_order: string;
  benefits: string[];
};

export default function CreatePackagePage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState<InputState>({
    name: "",
    price: 0,
    duration: 0,
    type: "apotekerclass",
    link_order: "",
    benefits: [""],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(true);

  const handleChange = (key: keyof InputState, value: any) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addBenefit = () => {
    setInput((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const removeBenefit = (index: number) => {
    setInput((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    const updated = [...input.benefits];
    updated[index] = value;
    setInput((prev) => ({ ...prev, benefits: updated }));
  };

  async function handleAddPackage() {
    const payload = {
      ...input,
      by: session.data?.user.fullname,
      token,
    };

    try {
      setIsLoading(true);

      await fetcher({
        url: "/subscriptions/packages",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Paket berhasil ditambahkan");
      router.push("/apotekerclass/subscriptions");
    } catch (error) {
      setIsLoading(false);
      console.error(error);

      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const isInputValid =
      input.name.trim() !== "" &&
      input.duration > 0 &&
      input.price > 0 &&
      input.link_order.trim() !== "" &&
      input.type === "apotekerclass" &&
      input.benefits.length > 0 &&
      input.benefits.every((b) => b.trim() !== "");

    setIsDisableButton(!isInputValid);
  }, [input]);

  return (
    <Layout title="Tambah Paket" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText
          title="Tambah Paket 📋"
          text="Tambahkan paket untuk kelas masuk Apoteker"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[700px] gap-8 pt-8">
          <div className="grid gap-6">
            <Input
              isRequired
              type="text"
              variant="flat"
              label="Nama Paket"
              labelPlacement="outside"
              placeholder="Contoh: Paket Masuk Apoteker Keren"
              name="name"
              value={input.name}
              onChange={(e) => handleChange("name", e.target.value)}
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
                onChange={(e) => handleChange("price", Number(e.target.value))}
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
                  handleChange("duration", Number(e.target.value))
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
              onChange={(e) => handleChange("link_order", e.target.value)}
              classNames={customStyleInput}
            />

            <div className="mt-4 grid gap-4">
              <h6 className="font-bold text-black">Benefit Paket</h6>

              <div className="grid gap-2">
                {input.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Input
                      isRequired
                      type="text"
                      variant="flat"
                      labelPlacement="outside"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder="Contoh: Akses Semua Video Belajar Masuk Apoteker"
                      classNames={customStyleInput}
                    />

                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      onClick={() => removeBenefit(index)}
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
                onClick={() => addBenefit()}
                className="font-bold"
              >
                Tambahkan Benefit
              </Button>
            </div>
          </div>

          <Button
            isLoading={isLoading}
            isDisabled={isDisableButton || isLoading}
            color="secondary"
            startContent={
              isLoading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleAddPackage}
            className="w-max justify-self-end font-semibold"
          >
            {isLoading ? "Tunggu Sebentar..." : "Tambah Paket"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
