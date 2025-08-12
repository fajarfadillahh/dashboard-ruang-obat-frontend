export type User = {
  user_id: string;
  fullname: string;
  university: string;
  entry_year: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
  created_at: string;
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
  entry_year: string;
  university: string;
  created_at: string;
  is_verified: boolean;
};

export type ParticipantsResponse = {
  program_id: string;
  title: string;
  type: "free" | "paid";
  participants: Participant[];
  page: number;
  total_participants: number;
  total_pages: number;
};
