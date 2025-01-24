export type ThesesResponse = {
  theses: Theses[];
  page: number;
  total_theses: number;
  total_pages: number;
};

export type Theses = {
  thesis_id: string;
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
