
import { api } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  role?: string;
}

export interface VendorRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  companyAddress: string;
  firmType: string;
  personDesignation: string;
  personName: string;
  personPhone: string;
  category: string;
  products: string;
  productNumber: number;
  annualIncome: number;
  gst: string;
  website: string;
  teamSize: number;
  companyDocuments: File;
}

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post('/user/login', data);
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await api.post('/user/register', data);
    return response.data;
  },

  async registerVendor(data: VendorRegisterRequest) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'companyDocuments') {
        formData.append(key, value as File);
      } else {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/user/register-vendor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async logout() {
    const response = await api.post('/user/logout');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/user/refresh-token', { refreshToken });
    return response.data;
  },
};
