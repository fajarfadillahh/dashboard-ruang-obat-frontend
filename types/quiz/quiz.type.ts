export type QuizResponse = {
  sub_category_id?: string;
  category_id?: string;
  name: string;
  slug: string;
  img_url: string;
  type: string;
  quizzes: Quiz[];
  page: number;
  total_quizzes: number;
  total_pages: number;
};

export type Quiz = {
  ass_id: string;
  description: string;
  title: string;
  variant: string;
  total_questions: number;
};

// =================================

export type QuizDetailResponse = {
  ass_id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  page: number;
  total_questions: number;
  total_pages: number;
};

export type QuizQuestion = {
  assq_id: string;
  number: number;
  text: string;
  explanation: string;
  type: string;
  options: QuizOption[];
  can_delete: boolean;
};

export type QuizOption = {
  asso_id: string;
  text: string;
  is_correct: boolean;
};
