import { CreateQuestion } from "@/pages/tests/create";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { X } from "@phosphor-icons/react";
import { memo, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import CardSimpleInputTest from "./CardSimpleInputTest";

type CardInputTestProps = {
  question: CreateQuestion;
  index: number;
  handleRemoveQuestion: (number: number) => void;
  handleEditorChange: (params: {
    index: number;
    text: string;
    field: "explanation" | "text";
  }) => void;
  handleOptionChange: (
    qIndex: number,
    oIndex: number,
    option: {
      text: string;
      is_correct: boolean;
    },
  ) => void;
  handleCheckboxChange: (
    qIndex: number,
    oIndex: number,
    option: {
      text: string;
      is_correct: boolean;
    },
  ) => void;
};

export default memo(function CardInputTest({
  question,
  handleRemoveQuestion,
  handleEditorChange,
  handleOptionChange,
  handleCheckboxChange,
  index,
}: CardInputTestProps) {
  const [text, setText] = useState("");
  const [textDebounce] = useDebounce(text, 1000);
  const [explanation, setExplanation] = useState("");
  const [explanationDebounce] = useDebounce(explanation, 1000);
  const [optionChange, setOptionChange] = useState<{
    text: string;
    index: null | number;
  }>({ text: "", index: null });

  const [optionChangeDebounce] = useDebounce(optionChange, 800);
  const [checkboxChange, setCheckboxChange] = useState<{
    is_correct: boolean;
    index: null | number;
  }>({
    is_correct: false,
    index: null,
  });
  const [checkboxChangeDebounce] = useDebounce(checkboxChange, 800);

  useEffect(() => {
    handleEditorChange({
      index,
      text: textDebounce,
      field: "text",
    });
  }, [textDebounce]);

  useEffect(() => {
    handleEditorChange({
      index,
      text: explanationDebounce,
      field: "explanation",
    });
  }, [explanationDebounce]);

  useEffect(() => {
    if (checkboxChangeDebounce.index != null) {
      const option = (question.options[checkboxChangeDebounce.index as number] =
        {
          ...question.options[checkboxChangeDebounce.index as number],
          is_correct: checkboxChangeDebounce.is_correct,
        });

      handleCheckboxChange(
        index,
        checkboxChangeDebounce.index as number,
        option,
      );
    }
  }, [checkboxChangeDebounce]);

  useEffect(() => {
    if (optionChangeDebounce.index != null) {
      const option = (question.options[optionChangeDebounce.index as number] = {
        ...question.options[optionChangeDebounce.index as number],
        text: optionChangeDebounce.text,
      });

      handleOptionChange(index, optionChangeDebounce.index as number, option);
    }
  }, [optionChangeDebounce]);

  return (
    <div className="rounded-xl border-2 border-gray/20 p-8">
      <div className="flex items-start gap-8">
        <div className="font-extrabold text-purple">{index + 1}.</div>

        <div className="grid flex-1 gap-8">
          <div>
            <p className="mb-2 font-medium text-black">Pertanyaan</p>

            <CardSimpleInputTest
              value={text ? text : question.text}
              onChange={setText}
            />
          </div>

          <div>
            <p className="mb-2 font-medium text-black">Jawaban</p>

            <div>
              {question.options.map((option, index) => {
                return (
                  <div key={index} className="flex space-y-2">
                    <Checkbox
                      size="lg"
                      color="secondary"
                      isSelected={
                        checkboxChange.index == index
                          ? checkboxChange.is_correct
                          : question.options[index].is_correct
                      }
                      onValueChange={(e) =>
                        setCheckboxChange({ is_correct: e, index })
                      }
                    />

                    <Input
                      value={
                        optionChange.index == index
                          ? optionChange.text
                          : question.options[index].text
                      }
                      variant="bordered"
                      color="default"
                      labelPlacement="outside"
                      placeholder="Tuliskan Jawaban"
                      classNames={{
                        input: "font-medium",
                      }}
                      onChange={(e) =>
                        setOptionChange({ text: e.target.value, index })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-black">Pembahasan</p>

            <CardSimpleInputTest
              value={explanation ? explanation : question.explanation}
              onChange={setExplanation}
            />
          </div>
        </div>

        <Button
          isIconOnly
          variant="light"
          color="default"
          size="sm"
          onClick={() => {
            setText("");
            setExplanation("");
            setOptionChange({
              text: "",
              index: null,
            });
            setCheckboxChange({
              is_correct: false,
              index: null,
            });
            handleRemoveQuestion(index);
          }}
        >
          <X weight="bold" size={16} />
        </Button>
      </div>
    </div>
  );
});
