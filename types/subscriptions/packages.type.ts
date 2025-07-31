export type SubscriptionsResponse = {
  packages: PackageSubscription[];
  page: number;
  total_packages: number;
  total_pages: number;
};

export type PackageSubscription = {
  package_id: string;
  name: string;
  price: number;
  duration: number;
  type: string;
  discount_amount?: number;
  link_order: string;
  is_active: boolean;
  created_at: string;
};

// ==========================================

export type DetailsPackageSubscription = {
  package_id: string;
  name: string;
  price: number;
  duration: number;
  type: string;
  link_order: string;
  is_active: boolean;
  created_at: string;
  discount_amount?: number;
  benefits: {
    benefit_id: string;
    description: string;
  }[];
};
