export type SubjectPrivateResponse = {
  private_classes: SubjectPrivate[];
  page: number;
  total_private_classes: number;
  total_pages: number;
};

export type SubjectPrivate = {
  subject_id: string;
  title: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  private_sub_classes: SubSubjectPrivate[];
};

export type SubjectPrivateDetails = {
  subject_id: string;
  title: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  subject_part: SubSubjectPrivate[];
};

export type SubSubjectPrivate = {
  subject_part_id: string;
  price: number;
  description: string;
  link_order: string;
};
