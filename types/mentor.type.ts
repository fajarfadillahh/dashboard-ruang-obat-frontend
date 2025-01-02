export type Mentor = {
  mentor_id: string;
  fullname: string;
  nickname: string;
  mentor_title: string;
  description: string;
  img_url: string;
  created_at: string;
};

export type MentorResponse = {
  mentors: Mentor[];
  page: number;
  total_programs: number;
  total_pages: number;
};
