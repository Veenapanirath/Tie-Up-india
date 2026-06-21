import { api } from '@/lib/api';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserEnquiry {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
    images?: string[];
    description: string;
    price: number;
    category: {
      _id: string;
      name: string;
    };
    vendor: {
      _id: string;
      companyName: string;
      companyAddress: string;
      firmType: string;
      officialPhone?: string;
      officialMail?: string;
      signupPerson: {
        name: string;
        designation: string;
        phone?: string;
      };
    };
    unit?: string;
    formattedQuantity?: string;
  };
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}


export interface UserFavorite {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    description: string;
    price: number;
    category: {
      _id: string;
      name: string;
    };
    unit?: string;
    formattedQuantity?: string;
  };
  createdAt: string;
}

export const userService = {
  async getUserDashboard() {
    try {
      const response = await api.get('/user/dashboard');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user dashboard');
    }
  },

  async updateProfile(data: UserProfile) {
    try {
      const response = await api.put('/user/profile', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  async addToFavorites(productId: string) {
    try {
      const response = await api.post('/user/favorites', { productId });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add to favorites');
    }
  },

  async removeFromFavorites(productId: string) {
    try {
      const response = await api.delete(`/user/favorites/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to remove from favorites');
    }
  },

  async getFavorites() {
    try {
      const response = await api.get('/user/favorites');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch favorites');
    }
  }
};
