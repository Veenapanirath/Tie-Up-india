import { api } from '@/lib/api';
import { log } from 'console';

export interface Enquiry {
  _id: number;
  quantity: number;
  status: string;
  name?: string;
  phoneNo?: string;
  address?: string;
  product?: {
    _id: string;
    name: string;
    image: string;
    description?: string;
    price?: number;
  };
  createdAt: string;
  updatedAt: string;
  user?: any;
}

export const vendorApi = {
  async getAllVendorEnquiry() {
    try {
      const res = await api.get('/enquiry/AllVendorEnquiry');
      return res.data;
    } catch (error) {
      throw new Error('Failed to fetch vendor enquiries');
    }
  },

  async updateEnquiry(enquiryId: number, data: Partial<Enquiry>) {
    try {
      const res = await api.put(`/enquiry/enquiry/${enquiryId}`, data);
      return res.data;
    } catch (error) {
      throw new Error('Failed to update enquiry');
    }
  },

  async deleteEnquiry(enquiryId: number) {
    try {
      console.log("running");
      
      console.log( "delete",enquiryId);
      const res = await api.delete(`/enquiry/enquiry/${enquiryId}`);
      console.log(res);
      
      return res.data;
    } catch (error) {
      throw new Error('Failed to delete enquiry');
    }
  },
};