export type DetailsArticleResponse = {
  article_id: string;
  title: string;
  slug: string;
  img_url: string;
  content: string;
  description: string;
  created_at: string;
  created_by: string;
  topic: {
    name: string;
    first_letter: string;
  };
  views: number;
};
