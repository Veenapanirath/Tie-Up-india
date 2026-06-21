
import { api } from '@/lib/api';

export interface DashboardStats {
  totalRevenue: number;
  activeVendors: number;
  productionLimited: number;
  totalEnquiries: number;
  enquiryStatusBreakdown: {
    waiting: number;
    inProcess: number;
    done: number;
  };
}

export interface AdData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  adImage?: File;
}

export const adminService = {
  async getDashboardStats(timeFilter: string = 'all') {
    try {
      const response = await api.get(`/admin/dashboard?timeFilter=${timeFilter}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch dashboard stats');
    }
  },

  async getAllEnquiries() {
    try {
      const response = await api.get('/enquiry/AllEnquiry');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch all enquiries');
    }
  },

  async createAd(adData: AdData) {
    try {
      const formData = new FormData();
      formData.append('title', adData.title);
      formData.append('subtitle', adData.subtitle);
      formData.append('description', adData.description);
      formData.append('ctaText', adData.ctaText);
      formData.append('ctaLink', adData.ctaLink);
      formData.append('backgroundColor', adData.backgroundColor);
      if (adData.adImage) {
        formData.append('adImage', adData.adImage);
      }

      const response = await api.post('/admin/create-ad', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create ad');
    }
  },

  async getAds() {
    try {
      const response = await api.get('/admin/ads');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch ads');
    }
  },
  
  async  deleteAds(id: string) {
    try {
      const response = await api.delete(`/admin/ads/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch ads');
    }
  },
  

  async getAllSubscribedVendors() {
    try {
      const response = await api.get('/subscription/all-sub-vendor');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch sub');
    }
  },

  
};
