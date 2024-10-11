export type UserType = {
  user_id: string;
  fullname: string;
  university: string;
  grade?: number;
};

export type ParticipantType = {
  user_id: string;
  fullname: string;
  university: string;
  code: string;
  joined_at: string;
  status?: string;
};
