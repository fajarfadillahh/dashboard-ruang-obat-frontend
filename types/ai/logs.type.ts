export type LogsAIResponse = {
  logs: LogsAI[];
  page: number;
  total_logs: number;
  total_pages: number;
};

export type LogsAI = {
  user_id: string;
  fullname: string;
  chat_id: string;
  model: string;
  source: string;
  question: string;
  answer: string;
  total_tokens: number;
  total_cost: number;
  created_at: string;
};
