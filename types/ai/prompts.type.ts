export type PromptType = {
  prompt_id: string;
  content: string;
  type: "INSTRUCTION" | "ANSWER_FORMAT";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};
