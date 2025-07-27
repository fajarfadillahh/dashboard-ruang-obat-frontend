export type TryoutResponse = {
  page: number;
  total_tryouts: number;
  total_pages: number;
  tryouts: Tryout[];
};

export type Tryout = {
  ass_id: string;
  title: string;
  description: string;
  variant: string;
  ass_type: string;
  total_questions: number;
};

// ===================================

export type TryoutDetailResponse = {
  ass_id: string;
  title: string;
  description: string;
  ass_type: string;
  variant: string;
  questions: TryoutQuestion[];
  page: number;
  total_questions: number;
  total_pages: number;
};

export type TryoutQuestion = {
  assq_id: string;
  number: number;
  text: string;
  explanation: string;
  type: string;
  options: TryoutOptions[];
  can_delete: boolean;
};

export type TryoutOptions = {
  asso_id: string;
  text: string;
  is_correct: boolean;
};
