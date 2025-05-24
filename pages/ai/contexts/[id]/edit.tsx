import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { ContextAI } from "@/types/ai/context.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  content: string;
  type: string;
};

export default function EditAIContextPage({
  token,
  context,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState<InputType>({
    title: context.title,
    content: context.content,
    type: context.type,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(true);

  async function handleEditContext() {
    const payload = {
      ...input,
      context_id: context.context_id,
      by: session.data?.user.fullname,
      token,
    };

    try {
      setIsLoading(true);

      await fetcher({
        url: "/ai/contexts",
        method: "PATCH",
        data: payload,
        token,
      });

      toast.success("Data konteks berhasil diubah");
      router.push("/ai/contexts");
    } catch (error: any) {
      setIsLoading(false);
      console.error(error);

      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const isInputValid = input.title && input.content && input.type;

    setIsDisableButton(!isInputValid);
  }, [input]);

  return (
    <Layout title="Edit Konteks" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText
          title="Edit Konteks 📋"
          text="Edit data konteks AI yang sudah ditambahkan"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[700px] gap-8 pt-8">
          <div className="grid gap-6">
            <Select
              isRequired
              aria-label="select role"
              variant="flat"
              label="Tipe Konteks"
              labelPlacement="outside"
              placeholder="Pilih Tipe Konteks"
              name="type"
              selectedKeys={[input.type]}
              onChange={(e) =>
                setInput({
                  ...input,
                  type: e.target.value,
                })
              }
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="umum">Seputar Ruang Obat</SelectItem>
              <SelectItem key="faq">Biasa Ditanyakan</SelectItem>
            </Select>

            <Input
              isRequired
              type="text"
              variant="flat"
              label="Judul Konteks"
              labelPlacement="outside"
              placeholder="Contoh: Apa itu kursus Ruang Obat"
              name="title"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              classNames={customStyleInput}
            />

            <Textarea
              isRequired
              minRows={5}
              maxRows={10}
              type="text"
              variant="flat"
              label="Penjelasan Konteks"
              labelPlacement="outside"
              placeholder="Contoh: Ruang Obat adalah bimbel Farmasi No. 1 di Indonesia"
              name="content"
              value={input.content}
              onChange={(e) => setInput({ ...input, content: e.target.value })}
              classNames={customStyleInput}
            />
          </div>

          <Button
            isLoading={isLoading}
            isDisabled={isDisableButton || isLoading}
            color="secondary"
            startContent={
              isLoading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleEditContext}
            className="w-max justify-self-end font-semibold"
          >
            {isLoading ? "Tunggu Sebentar..." : "Simpan Konteks"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx, token) => {
  const { params } = ctx;

  const response = (await fetcher({
    url: `/ai/contexts/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  })) as SuccessResponse<ContextAI>;

  return {
    props: {
      context: response.data,
    },
  };
});
