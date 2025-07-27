export type Accesses = {
  access_id: string;
  type: "videocourse" | "apotekerclass";
  duration: number;
  status: "active" | "scheduled" | "expired" | "revoked";
  is_active: boolean;
  user_timezone: string;
  created_at: string;
  started_at: string;
  expired_at: string;
  user_id: string;
  fullname: string;
  update_reason?: string;
  revoked_at?: string;
};

export type AccessesResponse = {
  accesses: Accesses[];
  page: number;
  total_accesses: number;
  total_pages: number;
};

export type DetailAccess = {
  access_id: string;
  type: "videocourse" | "apotekerclass";
  duration: number;
  status: Accesses["status"];
  is_active: boolean;
  user_timezone: string;
  created_at: string;
  started_at: string;
  expired_at: string;
  update_reason: any;
  user_id: string;
  fullname: string;
  order: {
    order_id: string;
    invoice_number: string;
    total_amount: number;
    final_amount: number;
    paid_amount: number;
    discount_amount: number;
    discount_code: any;
    status: string;
    items: {
      item_id: string;
      product_id: string;
      product_name: string;
      product_type: string;
      product_price: number;
    }[];
  };
  universities: {
    title: string;
    access_test_id: string;
    granted_at: string;
    granted_by: string;
  }[];
  revoked_at?: string;
};
