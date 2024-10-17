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
import { FloppyDisk, Pencil } from "@phosphor-icons/react";
import { useState } from "react";

type CardInputTestProps = {
  handleEditQuestion: (question: CreateQuestion, index: number) => void;
  question: CreateQuestion;
  index: number;
  type: "create" | "edit";
};

export default function ModalEditQuestion({
  handleEditQuestion,
  question,
  index,
  type,
}: CardInputTestProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
                  <div className="grid gap-2">
                    <p className="font-medium text-black">Pertanyaan</p>

                    <CardSimpleInputTest value={text} onChange={setText} />
                  </div>

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

                    <CardSimpleInputTest
                      value={explanation}
                      onChange={setExplanation}
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
                  {type == "create" ? "Simpan Draft" : "Simpan Soal"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
