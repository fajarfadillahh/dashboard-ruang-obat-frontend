export interface LimitAI {
  limit_id: string;
  type: string;
  total: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// ===== seperated =====

export type LimitAIUserResponse = {
  users: LimitAIUser[];
  page: number;
  total_users: number;
  total_pages: number;
};

export type LimitAIUser = {
  user_id: string;
  fullname: string;
  total: number;
  expired_at: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};
