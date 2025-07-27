export type CourseResponse = {
  name: string;
  slug: string;
  img_url: string;
  type: string;
  courses: Course[];
};

export type Course = {
  course_id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  is_active: boolean;
  total_videos: number;
  total_tests: number;
};
