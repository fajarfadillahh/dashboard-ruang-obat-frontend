export type LearningVideoResponse = {
  preparation_classes: LearningVideo[];
  page: number;
  total_preparation_classes: number;
  total_pages: number;
};

export type LearningVideo = {
  subject_id: string;
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
