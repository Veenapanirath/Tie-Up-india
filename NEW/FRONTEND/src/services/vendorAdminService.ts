import { api } from '@/lib/api';

export interface VendorInfo {
  signupPerson: {
    designation: string;
    name: string;
    phone: string;
  };
  _id: string;
  userId: string;
  firmType: string;
  companyAddress: string;
  companyName: string;
  officialPhone: string;
  officialMail?: string;
  category: string;
  products: string;
  numberOfProducts: number;
  annualIncome: number;
  companyDocuments: string;
  gstNumber: string;
  website: string;
  teamSize: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // isVerified: boolean;
}

export interface VendorProduct {
  _id: string;
  name: string;
  image: string;
  images: string[];
  description: string;
  quantity: number;
  price: number;
  category: string;
  subCategory: string;
  vendor: string;
  isActive: boolean;
  isTrending: boolean;
  phoneno: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorSubscription {
  _id: string;
  sub: {
    _id: string;
    name: string;
    amount: number;
    days: number;
    description: string;
    productlimit: number;
    createdAt: string;
    updatedAt: string;
  };
  vendor: string;
  startDate: string;
  endDate: string;
  remainingProductCount: number;
  amountPaid: number;
  paymentStatus: string;
  razorpayPaymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorEnquiry {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorDetailResponse {
  vendorInfo: VendorInfo;
  products: VendorProduct[];
  productDetail: {
    _id: string;
    vendor: string;
    phonenos: number[];
    createdAt: string;
    updatedAt: string;

  };
  subscription: VendorSubscription;
  enquiries: VendorEnquiry[];
}

export const vendorAdminService = {
  async getAllVendors() {
    try {
      const response = await api.get('/admin/vendor-list');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch vendors');
    }
  },

  async getVendorDetail(vendorId: string) {
    try {
      console.log( "vendorId",vendorId);
      
      // const response = await api.get(`/admin/685f9d79cd63833add27f384/vendor-detail`);
      const response = await api.get(`/admin/${vendorId}/vendor-detail`);
      console.log(response);
      
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch vendor details');
    }
  },

  async updateSubscription(subscriptionId: string, data: any) {
    try {
      const response = await api.patch(`/admin/${subscriptionId}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update subscription');
    }
  },

  async updateEnquiry(enquiryId: string, data: any) {
    try {
      const response = await api.put(`/enquiry/enquiry/${enquiryId}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update enquiry');
    }
  },

  async deleteEnquiry(enquiryId: string) {
    try {
      const response = await api.delete(`/enquiry/enquiry/${enquiryId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete enquiry');
    }
  },
 

  async updateVendorVerification(vendorId: string, isVerified: boolean) {
    try {
      const response = await api.patch(`/admin/vendor/${vendorId}/verification`, { isVerified });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update vendor verification');
    }
  },

  async updateVendorDetails(vendorId: string, data: Partial<VendorInfo>) {
    try {
      // Using the vendor profile update API as per documentation
      const response = await api.put(`/vendor/profile/${vendorId}`, data);
      console.log(response);
      
      return response.data;
    } catch (error) {
      throw new Error('Failed to update vendor details');
    }
  },

  async deleteVendor(vendorId: string) {
    try {
      const response = await api.delete(`/vendor/delete-all/${vendorId}`);
      console.log("response",response.data);
      
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete vendor');
    }
  },
};