import { Question } from "@/types/question.type";

export type Test = {
  test_id: string;
  title: string;
  start: string;
  end: string;
  is_active?: boolean;
  duration: number;
  status: string;
};

export type GradeTest = {
  result_id: string;
  user_id: string;
  fullname: string;
  university: string;
  score: number;
  score_category: string;
  created_at: string;
};

export type TestsResponse = {
  tests: Test[];
  page: number;
  total_tests: number;
  total_pages: number;
};

export type DetailsTestResponse = {
  status: string;
  test_id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  duration: number;
  questions: {
    question_id: string;
    type: "text" | "image" | "video";
    number: number;
    text: string;
    explanation: string;
    options: {
      text: string;
      option_id: string;
      is_correct: boolean;
    }[];
  }[];
  page: number;
  total_questions: number;
  total_pages: number;
};

export type GradeTestResponse = {
  test_id: string;
  title: string;
  results: GradeTest[];
  page: number;
  total_results: number;
  total_pages: number;
  total_participants: number;
};

export type TestAnswerResponse = {
  result_id: string;
  score: number;
  user_id: string;
  fullname: string;
  university: string;
  total_correct: number;
  total_incorrect: number;
  questions: Question[];
};
