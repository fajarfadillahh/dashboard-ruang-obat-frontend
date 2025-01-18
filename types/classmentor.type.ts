export type ClassMentor = {
  class_mentor_id: string;
  mentor_id: string;
  fullname: string;
  nickname: string;
  mentor_title: string;
  img_url: string;
};

export type ClassMentorType =
  | "preparation"
  | "private"
  | "thesis"
  | "research"
  | "pharmacist_admission";
