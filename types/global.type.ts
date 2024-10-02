export type SuccessResponse<T> = {
  success: boolean;
  status_code: number;
  data: T;
};
