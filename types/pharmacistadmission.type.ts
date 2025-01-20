export type PharmacistAdmissionUniversityResponse = {
  pharmacist_admission: PharmacistAdmissionUniversity[];
  page: number;
  total_pharmacist_admission: number;
  total_pages: number;
};

export type PharmacistAdmissionProductResponse = {
  pa_products: PharmacistAdmissionProduct[];
  page: number;
  total_pa_products: number;
  total_pages: number;
};

// ===== seperated =====

export type PharmacistAdmissionUniversity = {
  university_id: string;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  img_url: string;
  created_at: string;
  total_class: number;
};

export type PharmacistAdmissionProduct = {
  pa_id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  link_order: string;
  thumbnail_url: string;
  thumbnail_type: string;
  is_active: boolean;
  created_at: string;
};
