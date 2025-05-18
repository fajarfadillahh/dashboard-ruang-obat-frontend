import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  name: string;
  model: string;
  api_key: string;
  api_url: string;
  type: string;
};

export default function CreateProviderAI({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState<InputType>({
    name: "",
    model: "",
    api_key: "",
    api_url: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(true);

  async function handleAddProvider() {
    const payload = {
      ...input,
      by: session.data?.user.fullname,
      token,
    };

    try {
      setIsLoading(true);

      await fetcher({
        url: "/ai/providers",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Layanan berhasil ditambahkan");
      router.push("/ai/providers");
    } catch (error: any) {
      setIsLoading(false);
      console.error(error);

      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const isInputValid =
      input.name && input.model && input.api_key && input.api_url && input.type;

    setIsDisableButton(!isInputValid);
  }, [input]);

  return (
    <Layout title="Tambah Layanan" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText
          title="Tambah Layanan 📋"
          text="Tambahkan layanan AI untuk memperbanyak opsi"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[700px] gap-8 pt-8">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Nama Layanan"
                labelPlacement="outside"
                placeholder="Contoh: OpenAI: GPT-4o-mini"
                name="name"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                classNames={customStyleInput}
              />

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Model Layanan"
                labelPlacement="outside"
                placeholder="Contoh: openai/gpt-4o-min"
                name="model"
                value={input.model}
                onChange={(e) => setInput({ ...input, model: e.target.value })}
                classNames={customStyleInput}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="API Key"
                labelPlacement="outside"
                placeholder="Contoh: sk-or-v1-xxxxx"
                name="api_key"
                value={input.api_key}
                onChange={(e) =>
                  setInput({ ...input, api_key: e.target.value })
                }
                classNames={customStyleInput}
              />

              <Input
                isRequired
                type="text"
                variant="flat"
                label="API Url"
                labelPlacement="outside"
                placeholder="Contoh: https://openrouter.ai/xxxxx"
                name="api_url"
                value={input.api_url}
                onChange={(e) =>
                  setInput({ ...input, api_url: e.target.value })
                }
                classNames={customStyleInput}
              />
            </div>

            <RadioGroup
              isRequired
              aria-label="select provider type"
              label="Tipe Layanan"
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
          </div>

          <Button
            isLoading={isLoading}
            isDisabled={isDisableButton || isLoading}
            color="secondary"
            startContent={
              isLoading ? null : <FloppyDisk weight="bold" size={18} />
            }
            onClick={handleAddProvider}
            className="w-max justify-self-end font-semibold"
          >
            {isLoading ? "Tunggu Sebentar..." : "Tambah Layanan"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken<{ token: string }>();
