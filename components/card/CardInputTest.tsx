import { Button, Checkbox, Input } from "@nextui-org/react";
import { X } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const EditorCK = dynamic(() => import("@/components/EditorCK"), { ssr: false });

export default function CardInputTest() {
  const [questionContent, setQuestionContent] = useState<string>("");
  const [answerContent, setAnswerContent] = useState<string>("");

  return (
    <div className="rounded-xl border-2 border-gray/20 p-8">
      <div className="flex items-start gap-8">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gray/20 font-bold text-gray">
          1
        </div>

        <div className="grid flex-1 gap-8">
          <div className="grid gap-2">
            <p className="font-medium text-black after:pl-[2px] after:text-danger after:content-['*']">
              Pertanyaan
            </p>

            <EditorCK
              {...{ value: questionContent, onChange: setQuestionContent }}
            />
          </div>

          <div className="grid gap-2">
            <p className="font-medium text-black after:pl-[2px] after:text-danger after:content-['*']">
              Jawaban
            </p>

            <div className="grid gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Checkbox size="lg" color="secondary"></Checkbox>

                  <Input
                    type="text"
                    variant="flat"
                    color="default"
                    labelPlacement="outside"
                    placeholder="Tuliskan Jawaban..."
                    classNames={{
                      input:
                        "font-medium placeholder:font-semibold placeholder:text-gray",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <p className="font-medium text-black after:pl-[2px] after:text-danger after:content-['*']">
              Penjelasan
            </p>

            <EditorCK
              {...{ value: answerContent, onChange: setAnswerContent }}
            />
          </div>
        </div>

        <Button isIconOnly variant="light" size="sm">
          <X weight="bold" size={16} className="text-black" />
        </Button>
      </div>
    </div>
  );
}
