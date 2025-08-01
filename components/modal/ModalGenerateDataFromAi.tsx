import { SuccessResponse } from "@/types/global.type";
import { CreateQuestion } from "@/types/question.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Robot } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

type ModalGenerateDataFromAiProps = {
  setQuestions: Dispatch<SetStateAction<CreateQuestion[]>>;
};

export default function ModalGenerateDataFromAi({
  setQuestions,
}: ModalGenerateDataFromAiProps) {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  async function handleSubmit() {
    const formData = new FormData();

    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      formData.append("files", element);
    }

    setLoading(true);
    try {
      const response: SuccessResponse<{ text: string }> = await fetcher({
        url: "/converts/docx",
        method: "POST",
        data: formData,
        token: session.data?.user?.access_token,
        file: true,
      });

      const text = response.data.text;

      const data: any = {
        text,
      };

      if (prompt) {
        data.prompt = prompt;
      }

      const responseAi = await fetch("/api/ai/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseJson: SuccessResponse<CreateQuestion[]> =
        await responseAi.json();

      setQuestions(responseJson.data);
      onClose();
      setFiles(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Gagal mengunggah file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        color="secondary"
        onClick={onOpen}
        startContent={<Robot size={16} weight="fill" />}
      >
        Baca File dari AI
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        scrollBehavior="inside"
        onClose={() => {
          setFiles(null);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Baca File dari AI</ModalHeader>
              <ModalBody>
                <Textarea
                  label="Prompt tambahan (optional)"
                  placeholder="contoh: ambil 5 soal"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mb-4"
                  classNames={customStyleInput}
                />
                <Input
                  type="file"
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                  className="mb-2"
                  classNames={customStyleInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onClick={() => {
                    onClose();
                    setFiles(null);
                  }}
                >
                  Batal
                </Button>
                <Button
                  color="secondary"
                  isDisabled={!files || loading}
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Generate
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
