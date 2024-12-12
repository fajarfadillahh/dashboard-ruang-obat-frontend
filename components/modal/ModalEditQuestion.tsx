import { CreateQuestion } from "@/types/question.type";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { FloppyDisk, Pencil } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const CKEditor = dynamic(() => import("@/components/editor/CKEditor"), {
  ssr: false,
});

type ModalEditQuestionProps = {
  handleEditQuestion: (question: CreateQuestion, index: number) => void;
  question: CreateQuestion;
  index: number;
  page: "create" | "edit";
  type_question?: string;
  token?: string;
};

export default function ModalEditQuestion({
  handleEditQuestion,
  question,
  index,
  page,
  type_question,
  token,
}: ModalEditQuestionProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [typeQuestion, setTypeQuestion] = useState(
    `${page == "create" ? question.type : type_question}`,
  );
  const [text, setText] = useState(question.text);
  const [explanation, setExplanation] = useState(question.explanation);
  const [options, setOptions] = useState(question.options);

  return (
    <>
      <Button
        isIconOnly
        variant="flat"
        color="default"
        size="sm"
        onClick={onOpen}
      >
        <Pencil weight="bold" size={18} className="text-default-600" />
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
        onClose={() => {
          setText(question.text);
          setExplanation(question.explanation);
          setOptions(question.options);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Edit Soal
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-6">
                  <RadioGroup
                    aria-label="select program type"
                    orientation="horizontal"
                    label={
                      <span className="font-medium text-black">Tipe Soal</span>
                    }
                    color="secondary"
                    value={typeQuestion}
                    onValueChange={setTypeQuestion}
                    classNames={{
                      base: "font-semibold text-black",
                    }}
                  >
                    <Radio value="text">Text</Radio>
                    <Radio value="image">Gambar</Radio>
                    <Radio value="video">Video</Radio>
                  </RadioGroup>

                  {typeQuestion == "text" || typeQuestion == "image" ? (
                    <div className="grid gap-2">
                      <p className="font-medium text-black">Pertanyaan</p>

                      <CKEditor
                        value={text as string}
                        onChange={setText}
                        token={`${token}`}
                      />
                    </div>
                  ) : (
                    <Input
                      type="text"
                      variant="flat"
                      label="Pertanyaan"
                      labelPlacement="outside"
                      placeholder="Masukan Link Soal Video"
                      name="video"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      classNames={{
                        input:
                          "font-semibold placeholder:font-normal placeholder:text-default-600",
                        label: "font-medium text-black text-[16px]",
                      }}
                      className="flex-1"
                    />
                  )}

                  <div className="grid gap-2">
                    <p className="font-medium text-black">Jawaban</p>

                    {options.map((option, index) => (
                      <div key={index} className="flex">
                        <Checkbox
                          size="lg"
                          color="secondary"
                          isSelected={option.is_correct}
                          onValueChange={(e) => {
                            const mapping = [...options];
                            mapping[index] = {
                              ...mapping[index],
                              is_correct: e,
                            };

                            setOptions(mapping);
                          }}
                        />

                        <Input
                          value={option.text}
                          variant="bordered"
                          color="default"
                          labelPlacement="outside"
                          placeholder="Tuliskan Jawaban"
                          classNames={{
                            input: "font-medium",
                          }}
                          onChange={(e) => {
                            const mapping = [...options];
                            mapping[index] = {
                              ...mapping[index],
                              text: e.target.value,
                            };

                            setOptions(mapping);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2">
                    <p className="font-medium text-black">Pembahasan</p>

                    <CKEditor
                      value={explanation}
                      onChange={setExplanation}
                      token={`${token}`}
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => {
                    onClose();
                    setText(question.text);
                    setExplanation(question.explanation);
                    setOptions(question.options);
                  }}
                  className="font-bold"
                >
                  Tutup
                </Button>

                <Button
                  variant="solid"
                  color="secondary"
                  startContent={<FloppyDisk weight="bold" size={18} />}
                  onClick={() => {
                    handleEditQuestion(
                      {
                        text: text ? text : question.text,
                        options,
                        explanation: explanation ? explanation : question.text,
                        type: typeQuestion as "text" | "image" | "video",
                      },
                      index,
                    );
                    onClose();
                    setText(question.text);
                    setExplanation(question.explanation);
                    setOptions(question.options);
                  }}
                  className="w-max justify-self-end font-bold"
                >
                  {page == "create" ? "Simpan Draft" : "Simpan Soal"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
