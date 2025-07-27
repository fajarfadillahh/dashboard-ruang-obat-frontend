import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { PromptType } from "@/types/ai/prompts.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { Button, Textarea } from "@nextui-org/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function PromptsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<PromptType[]>
  >({
    url: "/ai/prompts",
    method: "GET",
    token,
  });
  const [instruction, setInstruction] = useState<PromptType>({
    prompt_id: "",
    content: "",
    type: "INSTRUCTION",
    is_active: false,
    created_at: "",
    updated_at: "",
    created_by: "",
    updated_by: "",
  });
  const [answerFormat, setAnswerFormat] = useState<PromptType>({
    prompt_id: "",
    content: "",
    type: "ANSWER_FORMAT",
    is_active: false,
    created_at: "",
    updated_at: "",
    created_by: "",
    updated_by: "",
  });
  const [loading, setLoading] = useState({
    instruction: false,
    answerFormat: false,
  });

  useEffect(() => {
    if (data && data.data.length) {
      if (data.data.find((item) => item.type === "INSTRUCTION")) {
        setInstruction(
          data?.data.find((item) => item.type === "INSTRUCTION") as PromptType,
        );
      }

      if (data.data.find((item) => item.type === "ANSWER_FORMAT")) {
        setAnswerFormat(
          data?.data.find(
            (item) => item.type === "ANSWER_FORMAT",
          ) as PromptType,
        );
      }
    }
  }, [data]);

  if (error) {
    return (
      <Layout title="Prompt AI">
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  async function handleSavePrompt(item: PromptType) {
    if (item.type === "INSTRUCTION") {
      setLoading({ ...loading, instruction: true });
    } else if (item.type === "ANSWER_FORMAT") {
      setLoading({ ...loading, answerFormat: true });
    }

    await toast
      .promise(
        fetcher({
          url: "/ai/prompts/upsert",
          method: "POST",
          data: {
            prompt_id: item.prompt_id ? item.prompt_id : `${Date.now()}`,
            content: item.content,
            type: item.type,
            by: session.data?.user.fullname as string,
          },
          token,
        }),
        {
          loading: "Menyimpan instruksi...",
          success: () => {
            mutate();
            return "Data berhasil disimpan";
          },
          error: (err) => {
            console.log(err);
            return "Gagal menyimpan data";
          },
        },
      )
      .finally(() => {
        if (item.type === "INSTRUCTION") {
          setLoading({ ...loading, instruction: false });
        } else if (item.type === "ANSWER_FORMAT") {
          setLoading({ ...loading, answerFormat: false });
        }
      });
  }

  return (
    <Layout title="Prompt AI">
      <Container className="gap-12">
        <ButtonBack />

        <div className="flex flex-col gap-4">
          <h1 className="max-w-[550px] text-2xl font-bold -tracking-wide text-black">
            🧠 Instruksi
          </h1>

          <Textarea
            value={instruction.content}
            classNames={customStyleInput}
            onChange={(e) =>
              setInstruction({ ...instruction, content: e.target.value })
            }
          />

          <Button
            color="secondary"
            className="self-end font-semibold"
            isDisabled={isLoading || loading.instruction}
            onClick={() => handleSavePrompt(instruction)}
          >
            {instruction.prompt_id ? "Update" : "Simpan"} Instruksi
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="max-w-[550px] text-2xl font-bold -tracking-wide text-black">
            🧾 Format Jawaban
          </h1>

          <Textarea
            value={answerFormat.content}
            classNames={customStyleInput}
            onChange={(e) =>
              setAnswerFormat({ ...answerFormat, content: e.target.value })
            }
          />

          <Button
            color="secondary"
            className="self-end font-semibold"
            isDisabled={isLoading || loading.answerFormat}
            onClick={() => handleSavePrompt(answerFormat)}
          >
            {answerFormat.prompt_id ? "Update" : "Simpan"} Format Jawaban
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
