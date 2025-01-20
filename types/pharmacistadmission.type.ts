export type PharmacistAdmissionUniversityResponse = {
  pharmacist_admission: PharmacistAdmissionUniversity[];
  page: number;
  total_pharmacist_admission: number;
  total_pages: number;
};

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
