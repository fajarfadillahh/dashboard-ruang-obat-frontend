export type Session = {
  user_id: string;
  fullname: string;
  university: string;
  browser: string;
  os: string;
  created_at: string;
  expired: string;
};

export type SessionResponse = {
  sessions: Session[];
  page: number;
  total_sessions: number;
  total_pages: number;
};
