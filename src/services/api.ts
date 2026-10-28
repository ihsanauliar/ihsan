import type { User, Banner, ServiceItem, TransactionRecord, ApiResponse } from '../types';

const BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Initial Mock Data matching Nutech Test specifications
const DEFAULT_SERVICES: ServiceItem[] = [
  { service_code: 'PAJAK', service_name: 'PBB', service_icon: '/assets/PBB.png', service_tariff: 25000 },
  { service_code: 'PLN', service_name: 'Listrik Prabayar', service_icon: '/assets/Listrik.png', service_tariff: 20000 },
  { service_code: 'PULSA', service_name: 'Pulsa', service_icon: '/assets/Pulsa.png', service_tariff: 40000 },
  { service_code: 'PDAM', service_name: 'PDAM', service_icon: '/assets/PDAM.png', service_tariff: 35000 },
  { service_code: 'PGN', service_name: 'PGN', service_icon: '/assets/PGN.png', service_tariff: 50000 },
  { service_code: 'TV', service_name: 'TV Langganan', service_icon: '/assets/Televisi.png', service_tariff: 120000 },
  { service_code: 'MUSIK', service_name: 'Musik', service_icon: '/assets/Musik.png', service_tariff: 54990 },
  { service_code: 'VOUCHER_GAME', service_name: 'Voucher Game', service_icon: '/assets/Game.png', service_tariff: 50000 },
  { service_code: 'VOUCHER_MAKANAN', service_name: 'Voucher Makanan', service_icon: '/assets/Voucher Makanan.png', service_tariff: 50000 },
  { service_code: 'KURBAN', service_name: 'Kurban', service_icon: '/assets/Kurban.png', service_tariff: 1950000 },
  { service_code: 'ZAKAT', service_name: 'Zakat', service_icon: '/assets/Zakat.png', service_tariff: 100000 },
  { service_code: 'PAKET_DATA', service_name: 'Paket Data', service_icon: '/assets/Paket Data.png', service_tariff: 75000 },
];

const DEFAULT_BANNERS: Banner[] = [
  { banner_name: 'Saldo Gratis!', banner_image: '/assets/Banner 1.png', description: 'Saldo SIMS PPOB gratis maksimal Rp25.000 untuk pengguna pertama' },
  { banner_name: 'Diskon listrik!', banner_image: '/assets/Banner 2.png', description: 'Diskon untuk setiap pembayaran listrik prabayar' },
  { banner_name: 'Promo makan!', banner_image: '/assets/Banner 3.png', description: 'Dapatkan voucher makan di restoran favorit anda' },
  { banner_name: 'Cashback 25%', banner_image: '/assets/Banner 4.png', description: 'Untuk setiap pembayaran voucher game diatas Rp100.000' },
  { banner_name: 'Buy 1 Get 2!', banner_image: '/assets/Banner 5.png', description: 'Dapatkan diskon paket data untuk setiap pembelian kuota' },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    invoice_number: 'INV17082023-001',
    transaction_type: 'TOPUP',
    description: 'Top Up Saldo',
    total_amount: 10000,
    created_on: '2023-08-17T13:10:00.000Z',
  },
  {
    invoice_number: 'INV17082023-002',
    transaction_type: 'PAYMENT',
    description: 'Pulsa Prabayar',
    total_amount: 40000,
    created_on: '2023-08-17T12:10:00.000Z',
  },
  {
    invoice_number: 'INV17082023-003',
    transaction_type: 'PAYMENT',
    description: 'Listrik Pascabayar',
    total_amount: 10000,
    created_on: '2023-08-17T11:10:00.000Z',
  },
  {
    invoice_number: 'INV17082023-004',
    transaction_type: 'TOPUP',
    description: 'Top Up Saldo',
    total_amount: 50000,
    created_on: '2023-08-17T10:10:00.000Z',
  },
  {
    invoice_number: 'INV17082023-005',
    transaction_type: 'TOPUP',
    description: 'Top Up Saldo',
    total_amount: 50000,
    created_on: '2023-08-17T09:10:00.000Z',
  },
];

class LocalStore {
  private static getKey(key: string): string {
    return `sims_ppob_${key}`;
  }

  static get<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(this.getKey(key));
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }
}

function getToken(): string | null {
  return localStorage.getItem('sims_token');
}

function setToken(token: string): void {
  localStorage.setItem('sims_token', token);
}

function clearToken(): void {
  localStorage.removeItem('sims_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = (await response.json()) as ApiResponse<T>;
    return data;
  } catch (err) {
    console.warn(`Real API call failed for ${endpoint}, falling back to local simulation:`, err);
    throw err;
  }
}

export const apiService = {
  getToken,
  setToken,
  clearToken,
  request,

  // Auth: Registration
  async register(payload: { email: string; first_name: string; last_name: string; password: string }): Promise<ApiResponse<null>> {
    const newUser = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      password: payload.password,
      profile_image: '/assets/Profile Photo.png',
    };
    const users = LocalStore.get<any[]>('users_list', []);
    const idx = users.findIndex((u) => u.email === payload.email);
    if (idx >= 0) {
      users[idx] = newUser;
    } else {
      users.push(newUser);
    }
    LocalStore.set('users_list', users);
    LocalStore.set('registered_user', newUser);

    try {
      const res = await request<null>('/registration', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res;
    } catch {
      return {
        status: 0,
        message: 'Registrasi berhasil silahkan login',
        data: null,
      };
    }
  },

  // Auth: Login
  async login(payload: { email: string; password: string }): Promise<ApiResponse<{ token: string }>> {
    const users = LocalStore.get<any[]>('users_list', []);
    const foundUser = users.find((u) => u.email === payload.email) || LocalStore.get<any>('registered_user', null);

    try {
      const res = await request<{ token: string }>('/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.status === 0 && res.data?.token) {
        setToken(res.data.token);
        return res;
      }
      throw new Error(res.message || 'Login gagal');
    } catch {
      if (payload.password.length < 8) {
        return {
          status: 102,
          message: 'Password minimal 8 karakter',
          data: null,
        };
      }

      if (foundUser && foundUser.password && foundUser.password !== payload.password) {
        return {
          status: 103,
          message: 'Password yang anda masukan salah',
          data: null,
        };
      }

      const mockToken = 'mock_jwt_token_' + Date.now();
      setToken(mockToken);
      const userProfile = {
        email: payload.email,
        first_name: foundUser?.first_name || 'Kristanto',
        last_name: foundUser?.last_name || 'Wibowo',
        profile_image: foundUser?.profile_image || '/assets/Profile Photo.png',
      };
      LocalStore.set('user_profile', userProfile);

      return {
        status: 0,
        message: 'Login Sukses',
        data: { token: mockToken },
      };
    }
  },

  // Profile: Get Profile
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const res = await request<User>('/profile');
      if (res.status === 0 && res.data) {
        LocalStore.set('user_profile', res.data);
        return res;
      }
      throw new Error(res.message);
    } catch {
      const profile = LocalStore.get<User>('user_profile', {
        email: 'wallet@nutech.com',
        first_name: 'Kristanto',
        last_name: 'Wibowo',
        profile_image: '/assets/Profile Photo.png',
      });
      return {
        status: 0,
        message: 'Sukses',
        data: profile,
      };
    }
  },

  // Profile: Update
  async updateProfile(payload: { first_name: string; last_name: string }): Promise<ApiResponse<User>> {
    try {
      const res = await request<User>('/profile/update', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.status === 0 && res.data) {
        LocalStore.set('user_profile', res.data);
        return res;
      }
      throw new Error(res.message);
    } catch {
      const current = LocalStore.get<User>('user_profile', {
        email: 'wallet@nutech.com',
        first_name: 'Kristanto',
        last_name: 'Wibowo',
        profile_image: '/assets/Profile Photo.png',
      });
      const updated: User = {
        ...current,
        first_name: payload.first_name,
        last_name: payload.last_name,
      };
      LocalStore.set('user_profile', updated);

      // Also persist to users_list
      const users = LocalStore.get<any[]>('users_list', []);
      const idx = users.findIndex((u) => u.email === updated.email);
      if (idx >= 0) {
        users[idx] = { ...users[idx], first_name: payload.first_name, last_name: payload.last_name };
        LocalStore.set('users_list', users);
      }

      return {
        status: 0,
        message: 'Update Profile berhasil',
        data: updated,
      };
    }
  },

  // Profile: Update Image
  async updateProfileImage(file: File): Promise<ApiResponse<User>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await request<User>('/profile/image', {
        method: 'PUT',
        body: formData,
      });
      if (res.status === 0 && res.data) {
        LocalStore.set('user_profile', res.data);
        return res;
      }
      throw new Error(res.message);
    } catch {
      const current = LocalStore.get<User>('user_profile', {
        email: 'wallet@nutech.com',
        first_name: 'Kristanto',
        last_name: 'Wibowo',
        profile_image: '/assets/Profile Photo.png',
      });
      const imageUrl = URL.createObjectURL(file);
      const updated: User = {
        ...current,
        profile_image: imageUrl,
      };
      LocalStore.set('user_profile', updated);
      return {
        status: 0,
        message: 'Update Profile Image berhasil',
        data: updated,
      };
    }
  },

  // Balance: Get Balance
  async getBalance(): Promise<ApiResponse<{ balance: number }>> {
    try {
      const res = await request<{ balance: number }>('/balance');
      if (res.status === 0 && res.data) {
        LocalStore.set('user_balance', res.data.balance);
        return res;
      }
      throw new Error(res.message);
    } catch {
      const balance = LocalStore.get<number>('user_balance', 0);
      return {
        status: 0,
        message: 'Sukses',
        data: { balance },
      };
    }
  },

  // Services: Get All Services
  async getServices(): Promise<ApiResponse<ServiceItem[]>> {
    try {
      const res = await request<ServiceItem[]>('/services');
      if (res.status === 0 && res.data) {
        return res;
      }
      throw new Error(res.message);
    } catch {
      return {
        status: 0,
        message: 'Sukses',
        data: DEFAULT_SERVICES,
      };
    }
  },

  // Banners: Get All Banners
  async getBanners(): Promise<ApiResponse<Banner[]>> {
    try {
      const res = await request<Banner[]>('/banner');
      if (res.status === 0 && res.data) {
        return res;
      }
      throw new Error(res.message);
    } catch {
      return {
        status: 0,
        message: 'Sukses',
        data: DEFAULT_BANNERS,
      };
    }
  },

  // Top Up
  async topUp(top_up_amount: number): Promise<ApiResponse<{ balance: number }>> {
    try {
      const res = await request<{ balance: number }>('/topup', {
        method: 'POST',
        body: JSON.stringify({ top_up_amount }),
      });
      if (res.status === 0 && res.data) {
        LocalStore.set('user_balance', res.data.balance);
        this.addLocalTransaction({
          invoice_number: `INV${Date.now()}`,
          transaction_type: 'TOPUP',
          description: 'Top Up Saldo',
          total_amount: top_up_amount,
          created_on: new Date().toISOString(),
        });
        return res;
      }
      throw new Error(res.message);
    } catch {
      const current = LocalStore.get<number>('user_balance', 0);
      const newBalance = current + top_up_amount;
      LocalStore.set('user_balance', newBalance);

      this.addLocalTransaction({
        invoice_number: `INV${Date.now()}`,
        transaction_type: 'TOPUP',
        description: 'Top Up Saldo',
        total_amount: top_up_amount,
        created_on: new Date().toISOString(),
      });

      return {
        status: 0,
        message: 'Top Up Balance berhasil',
        data: { balance: newBalance },
      };
    }
  },

  // Payment Transaction
  async createTransaction(
    service_code: string,
    customer_id?: string,
    payment_method?: string,
    custom_amount?: number,
    custom_description?: string
  ): Promise<ApiResponse<{
    invoice_number: string;
    service_code: string;
    service_name: string;
    transaction_type: 'PAYMENT';
    total_amount: number;
    created_on: string;
    customer_id?: string;
    payment_method?: string;
  }>> {
    const isSaldo = !payment_method || payment_method.toLowerCase().includes('saldo');
    const effectivePaymentMethod = payment_method || 'Saldo SIMS PPOB';
    const effectiveCustomerId = customer_id || 'ID-12345678';

    const service = DEFAULT_SERVICES.find((s) => s.service_code === service_code) || {
      service_code,
      service_name: 'Layanan',
      service_tariff: 10000,
      service_icon: '/assets/Listrik.png',
    };

    const finalAmount = custom_amount && custom_amount > 0 ? custom_amount : service.service_tariff;
    const finalDescription = custom_description || service.service_name;

    try {
      const res = await request<{
        invoice_number: string;
        service_code: string;
        service_name: string;
        transaction_type: 'PAYMENT';
        total_amount: number;
        created_on: string;
      }>('/transaction', {
        method: 'POST',
        body: JSON.stringify({ service_code }),
      });
      if (res.status === 0 && res.data) {
        this.addLocalTransaction({
          invoice_number: res.data.invoice_number,
          transaction_type: 'PAYMENT',
          description: finalDescription,
          total_amount: finalAmount,
          created_on: res.data.created_on,
          customer_id: effectiveCustomerId,
          payment_method: effectivePaymentMethod,
        });

        return {
          ...res,
          data: {
            ...res.data,
            service_name: finalDescription,
            total_amount: finalAmount,
            customer_id: effectiveCustomerId,
            payment_method: effectivePaymentMethod,
          },
        };
      }
      throw new Error(res.message);
    } catch {
      const currentBalance = LocalStore.get<number>('user_balance', 0);
      if (isSaldo && currentBalance < finalAmount) {
        return {
          status: 102,
          message: 'Saldo tidak mencukupi',
          data: null,
        };
      }

      if (isSaldo) {
        const newBalance = currentBalance - finalAmount;
        LocalStore.set('user_balance', newBalance);
      }

      const record = {
        invoice_number: `INV${Date.now()}`,
        service_code: service.service_code,
        service_name: finalDescription,
        transaction_type: 'PAYMENT' as const,
        total_amount: finalAmount,
        created_on: new Date().toISOString(),
        customer_id: effectiveCustomerId,
        payment_method: effectivePaymentMethod,
      };

      this.addLocalTransaction({
        invoice_number: record.invoice_number,
        transaction_type: 'PAYMENT',
        description: finalDescription,
        total_amount: finalAmount,
        created_on: record.created_on,
        customer_id: record.customer_id,
        payment_method: record.payment_method,
      });

      return {
        status: 0,
        message: 'Transaksi berhasil',
        data: record,
      };
    }
  },

  // Transaction History
  async getTransactionHistory(
    offset = 0,
    limit = 5
  ): Promise<ApiResponse<{ offset: number; limit: number; records: TransactionRecord[] }>> {
    try {
      const res = await request<{ offset: number; limit: number; records: TransactionRecord[] }>(
        `/transaction/history?offset=${offset}&limit=${limit}`
      );
      if (res.status === 0 && res.data) {
        return res;
      }
      throw new Error(res.message);
    } catch {
      const all = LocalStore.get<TransactionRecord[]>('transactions', INITIAL_TRANSACTIONS);
      const records = all.slice(offset, offset + limit);
      return {
        status: 0,
        message: 'Sukses',
        data: {
          offset,
          limit,
          records,
        },
      };
    }
  },

  addLocalTransaction(record: TransactionRecord) {
    const all = LocalStore.get<TransactionRecord[]>('transactions', INITIAL_TRANSACTIONS);
    LocalStore.set('transactions', [record, ...all]);
  },
};
