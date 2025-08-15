export type TestimonialResponse = {
  testimonials: {
    testimonial_id: string;
    img_url: string;
    type: string;
    created_at: string;
  }[];
  page: number;
  total_testimonials: number;
  total_pages: number;
};
