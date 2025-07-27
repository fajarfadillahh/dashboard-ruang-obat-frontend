import { CreateQuestion } from "@/types/question.type";
import { customStyleInput } from "@/utils/customStyleInput";
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
import { FloppyDisk, PencilLine } from "@phosphor-icons/react";
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
        variant="light"
        color="secondary"
        size="sm"
        onClick={onOpen}
      >
        <PencilLine weight="duotone" size={18} />
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
              <ModalHeader className="font-bold text-black">
                Edit Soal
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-6">
                  <RadioGroup
                    isRequired
                    aria-label="select program type"
                    orientation="horizontal"
                    label={
                      <span className="text-sm font-medium text-black">
                        Tipe Soal
                      </span>
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
                      <p className="text-sm font-medium text-black after:ml-0.5 after:text-base after:text-danger after:content-['*']">
                        Pertanyaan
                      </p>

                      <CKEditor
                        value={text as string}
                        onChange={setText}
                        token={`${token}`}
                      />
                    </div>
                  ) : (
                    <Input
                      isRequired
                      type="text"
                      variant="flat"
                      label="Pertanyaan"
                      labelPlacement="outside"
                      placeholder="Contoh: https://youtube.com/watch?v=xxxxx"
                      name="video"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      classNames={customStyleInput}
                    />
                  )}

                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-black after:ml-0.5 after:text-base after:text-danger after:content-['*']">
                      Jawaban
                    </p>

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
                    <p className="text-sm font-medium text-black after:ml-0.5 after:text-base after:text-danger after:content-['*']">
                      Pembahasan
                    </p>

                    <CKEditor
                      value={explanation as string}
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
                  className="font-semibold"
                >
                  Tutup
                </Button>

                <Button
                  color="secondary"
                  startContent={<FloppyDisk weight="duotone" size={18} />}
                  onClick={() => {
                    handleEditQuestion(
                      {
                        text: text ? text : question.text,
                        options,
                        explanation: explanation
                          ? explanation
                          : question.explanation,
                        type: typeQuestion as "text" | "image" | "video",
                        question_id: question.question_id,
                        number: question.number,
                      },
                      index,
                    );
                    onClose();
                    setText(question.text);
                    setExplanation(question.explanation);
                    setOptions(question.options);
                  }}
                  className="w-max justify-self-end font-semibold"
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
