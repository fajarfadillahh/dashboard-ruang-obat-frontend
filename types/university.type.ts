export type UniversityResponse = {
  univ_id: string;
  slug: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  is_active: boolean;
  description: string;
  total_tests: number;
};

// ===================================

export type DetailsUniversityResponse = {
  univ_id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  is_active: boolean;
  tests: TestUniversity[];
};

export type TestUniversity = {
  ass_id: string;
  title: string;
  description: string;
  total_questions: number;
};
