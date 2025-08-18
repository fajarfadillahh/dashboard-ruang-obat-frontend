export type TopicsResponse = {
  topics: Topic[];
  page: number;
  total_topics: number;
  total_pages: number;
};

export type Topic = {
  topic_id: string;
  name: string;
  first_letter: string;
  created_at: string;
  can_delete: boolean;
};
