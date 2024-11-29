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
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { FloppyDisk, Plus } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const CKEditor = dynamic(() => import("@/components/editor/CKEditor"), {
  ssr: false,
});

type CardInputTestProps = {
  handleAddQuestion: (question: CreateQuestion) => void;
  type: "create" | "edit";
  token?: string;
};

export default function ModalInputQuestion({
  handleAddQuestion,
  type,
  token,
}: CardInputTestProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [typeQuestion, setTypeQuestion] = useState("text");
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  return (
    <>
      <Button
        variant="bordered"
        color="secondary"
        startContent={<Plus weight="bold" size={18} />}
        className="w-max justify-self-end font-bold"
        onClick={onOpen}
        size="md"
      >
        Tambah Soal
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
        onClose={() => {
          setText("");
          setExplanation("");
          setOptions([
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ]);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Buat Soal
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
                        value={text}
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
                    setText("");
                    setExplanation("");
                    setOptions([
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                    ]);
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
                    handleAddQuestion({
                      text,
                      options,
                      explanation,
                      type: typeQuestion as "text" | "image" | "video",
                    });
                    onClose();
                    setText("");
                    setExplanation("");
                    setOptions([
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                      { text: "", is_correct: false },
                    ]);
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
