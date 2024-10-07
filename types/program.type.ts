export type ProgramType = {
  program_id: string;
  title: string;
  type: "paid" | "free";
  price?: number;
  created_at: string;
  is_active: boolean;
  total_tests: number;
};
