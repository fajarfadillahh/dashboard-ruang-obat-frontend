export type Question = {
  number: number;
  question_id: string;
  text: string;
  explanation: string;
  type: string;
  url: any;
  options: Option[];
  correct_option: string;
  user_answer: string;
  is_correct: boolean;
};

export type CreateQuestion = {
  question_id: string;
  number: number;
  type?: "text" | "image" | "video";
  text?: string;
  explanation: string;
  options: Option[];
};

export type Option = {
  option_id: string;
  text: string;
  is_correct: boolean;
};
