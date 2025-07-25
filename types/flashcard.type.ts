export type CardsResponse = {
  sub_category_id?: string;
  category_id?: string;
  name: string;
  slug: string;
  img_url: string;
  type: string;
  cards: Card[];
};

export type Card = {
  card_id: string;
  text?: string | null;
  type: "text" | "image" | "document";
  url?: string | null;
  is_active: boolean;
};
