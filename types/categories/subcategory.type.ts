export type SubCategory = {
  category_id: string;
  name: string;
  slug: string;
  img_url: string;
  type: string;
  sub_categories: {
    sub_category_id: string;
    name: string;
    slug: string;
    img_url: string;
    is_active?: boolean;
  }[];
};
