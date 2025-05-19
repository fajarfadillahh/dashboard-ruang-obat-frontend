export type ContextAIResponse = {
  contexts: ContextAI[];
  page: number;
  total_contexts: number;
  total_pages: number;
};

export type ContextAI = {
  context_id: string;
  title: string;
  content: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};
