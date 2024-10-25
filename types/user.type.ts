export type UserType = {
  user_id: string;
  fullname: string;
  university: string;
  email: string;
  phone_number: string;
  grade?: number;
};

export type ParticipantType = {
  user_id: string;
  fullname: string;
  university: string;
  code: string;
  joined_at: string;
  is_approved?: boolean;
};
