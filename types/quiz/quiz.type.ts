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
