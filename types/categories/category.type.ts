export type Category = {
  category_id: string;
  name: string;
  slug: string;
  img_url: string;
  type: "videocourse" | "apotekerclass" | "videoukmppai";
  created_at: string;
  created_by: string;
  total_sub_category?: number;
  is_active?: boolean;
};
