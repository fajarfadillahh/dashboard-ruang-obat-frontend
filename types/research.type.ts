export type ResearchResponse = {
  research: Research[];
  page: number;
  total_research: number;
  total_pages: number;
};

export type Research = {
  research_id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  link_order: string;
  thumbnail_url: string;
  thumbnail_type: "image" | "video";
  is_active: boolean;
  created_at: string;
};
