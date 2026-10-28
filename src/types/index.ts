export interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

export interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

export interface ServiceItem {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

export interface TransactionRecord {
  invoice_number: string;
  transaction_type: 'TOPUP' | 'PAYMENT';
  description: string;
  total_amount: number;
  created_on: string;
  customer_id?: string;
  payment_method?: string;
}

export type PaymentMethodCategory = 'saldo' | 'va' | 'ewallet' | 'card';

export interface PaymentMethod {
  id: string;
  name: string;
  category: PaymentMethodCategory;
  categoryLabel: string;
  iconName: string;
  badge?: string;
  badgeColor?: string;
  fee: number;
  description: string;
  bankCode?: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
}
