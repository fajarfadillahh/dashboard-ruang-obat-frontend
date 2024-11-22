import VideoComponent from "@/components/VideoComponent";
import { CreateQuestion } from "@/pages/tests/create";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

type CardQuestionPreviewProps = {
  type?: "create" | "edit";
  question: CreateQuestion;
  index: number;
  buttonAction?: JSX.Element | null;
  className?: string;
};

export default function CardQuestionPreview({
  type,
  question,
  index,
  buttonAction,
  className,
}: CardQuestionPreviewProps) {
  return (
    <div
      className={twMerge(
        `flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6`,
        className,
      )}
    >
      <div className="font-extrabold text-purple">
        {type === "create" ? index + 1 : question.number}.
      </div>

      <div className="grid flex-1 gap-4">
        {question.type == "video" ? (
          <Suspense fallback={<p>Loading video...</p>}>
            <VideoComponent url={question.text as string} />
          </Suspense>
        ) : (
          <p
            className="preventive-list preventive-table list-outside text-[16px] font-semibold leading-[170%] text-black"
            dangerouslySetInnerHTML={{ __html: question.text as string }}
          />
        )}

        <div className="grid gap-1">
          {question.options.map((option, index) => {
            return (
              <div key={index} className="inline-flex items-center gap-2">
                {option.is_correct ? (
                  <CheckCircle
                    weight="bold"
                    size={18}
                    className="text-success"
                  />
                ) : (
                  <XCircle weight="bold" size={18} className="text-danger" />
                )}
                <p
                  className={`flex-1 font-semibold ${
                    option.is_correct ? "text-success" : "text-gray/80"
                  }`}
                >
                  {option.text}
                </p>
              </div>
            );
          })}
        </div>

        <Accordion isCompact variant="bordered">
          <AccordionItem
            aria-label="accordion answer"
            key="answer"
            title="Penjelasan:"
            classNames={{
              title: "font-semibold text-black",
              content: "font-medium text-gray leading-[170%] pb-4",
            }}
          >
            <div
              className="preventive-list preventive-table list-outside text-[16px] leading-[170%] text-black"
              dangerouslySetInnerHTML={{
                __html: question.explanation,
              }}
            ></div>
          </AccordionItem>
        </Accordion>
      </div>

      {buttonAction}
    </div>
  );
}
