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
  link_order: string;
  is_active: boolean;
  created_at: string;
};
