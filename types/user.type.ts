export type User = {
  user_id: string;
  fullname: string;
  university: string;
  email: string;
  phone_number: string;
  grade?: number;
};

export type Participant = {
  user_id: string;
  fullname: string;
  university: string;
  code: string;
  joined_at: string;
  is_approved?: boolean;
};

export type UsersResponse = {
  users: User[];
  page: number;
  total_users: number;
  total_pages: number;
};

export type DetailsUserResponse = {
  user_id: string;
  fullname: string;
  email: string;
  phone_number: string;
  gender: string;
  university: string;
  created_at: string;
};
