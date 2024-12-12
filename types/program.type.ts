import { Test } from "@/types/test.type";
import { Participant } from "@/types/user.type";

export type Program = {
  program_id: string;
  title: string;
  type: "paid" | "free";
  price?: number;
  created_at: string;
  is_active: boolean;
  total_tests: number;
};

export type ProgramsResponse = {
  programs: Program[];
  page: number;
  total_programs: number;
  total_pages: number;
};

export type DetailsProgramResponse = {
  program_id: string;
  title: string;
  type: string;
  price: number;
  is_active: boolean;
  qr_code: string;
  url_qr_code: string;
  total_tests: number;
  total_users: number;
  page: number;
  total_participants: number;
  total_approved_users: number;
  total_pages: number;
  tests: Test[];
  participants: Participant[];
};
