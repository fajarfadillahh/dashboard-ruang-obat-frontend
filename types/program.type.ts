export type ProgramType = {
  id_program: string;
  title_program: string;
  amount_test: number;
  status_program: "free" | "paid";
  price_program: number;
  created_at: string;
};
