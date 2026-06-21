import { api } from '@/lib/api';

export interface Brand {
  _id: string;
  name: string;
  category: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandData {
  name: string;
  category: string;
  image?: File;
}

export interface UpdateBrandData {
  name?: string;
  category?: string;
  image?: File;
}

export const brandService = {
  // Create brand
  createBrand: async (brandData: CreateBrandData) => {
    const formData = new FormData();
    formData.append('name', brandData.name);
    formData.append('category', brandData.category);
    
    if (brandData.image) {
      formData.append('image', brandData.image);
    }

    const response = await api.post('/brand', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all brands
  getAllBrands: async () => {
    const response = await api.get('/brand');
    return response.data;
  },

  // Update brand
  updateBrand: async (id: string, brandData: UpdateBrandData) => {
    const formData = new FormData();
    
    if (brandData.name) {
      formData.append('name', brandData.name);
    }
    if (brandData.category) {
      formData.append('category', brandData.category);
    }
    if (brandData.image) {
      formData.append('image', brandData.image);
    }

    const response = await api.put(`/brand/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id: string) => {
    const response = await api.delete(`/brand/${id}`);
    return response.data;
  },
};
