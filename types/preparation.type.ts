export type SubjectPreparationResponse = {
  preparation_classes: SubjectPreparation[];
  page: number;
  total_preparation_classes: number;
  total_pages: number;
};

export type SubjectPreparation = {
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
