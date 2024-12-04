export type Feedback = {
  user_id: string;
  fullname: string;
  rating: number;
  text: string;
  created_at: string;
};

export type FeedbackResponse = {
  feedback: Feedback[];
  page: number;
  total_feedback: number;
  total_pages: number;
};
