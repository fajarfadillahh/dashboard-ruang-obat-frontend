import CardSimpleInputTest from "@/components/card/CardSimpleInputTest";
import { CreateQuestion } from "@/pages/tests/create";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FloppyDisk, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";

type CardInputTestProps = {
  question?: CreateQuestion;
  index?: number;
  handleRemoveQuestion?: (number: number) => void;
  handleEditorChange?: (params: {
    index: number;
    text: string;
    field: "explanation" | "text";
  }) => void;
  handleOptionChange?: (
    qIndex: number,
    oIndex: number,
    option: {
      text: string;
      is_correct: boolean;
    },
  ) => void;
  handleCheckboxChange?: (
    qIndex: number,
    oIndex: number,
    option: {
      text: string;
      is_correct: boolean;
    },
  ) => void;
};

export default function ModalInputQuestion({
  question,
  handleRemoveQuestion,
  handleEditorChange,
  handleOptionChange,
  handleCheckboxChange,
  index,
}: CardInputTestProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");

  return (
    <>
      <Button
        variant="flat"
        color="default"
        startContent={<Plus weight="bold" size={18} />}
        onPress={onOpen}
        className="font-bold"
      >
        Tambah Soal
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Buat Soal
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <p className="font-medium text-black">Pertanyaan</p>

                    <CardSimpleInputTest
                      value={text ? text : question?.text}
                      onChange={setText}
                    />
                  </div>

                  <div className="grid gap-2">
                    <p className="font-medium text-black">Jawaban</p>

                    {Array.from({ length: 5 }, (_, index) => (
                      <div key={index} className="flex">
                        <Checkbox size="lg" color="secondary" />

                        <Input
                          variant="bordered"
                          color="default"
                          labelPlacement="outside"
                          placeholder="Tuliskan Jawaban"
                          classNames={{
                            input: "font-medium",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2">
                    <p className="font-medium text-black">Pembahasan</p>

                    <CardSimpleInputTest
                      value={explanation ? explanation : question?.explanation}
                      onChange={setExplanation}
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-bold"
                >
                  Tutup
                </Button>

                <Button
                  variant="solid"
                  color="secondary"
                  startContent={<FloppyDisk weight="bold" size={18} />}
                  onClick={() =>
                    toast.success("Berhasil Simpan Ke Dalam Draft")
                  }
                  className="w-max justify-self-end font-bold"
                >
                  Simpan Draft
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
