
import { api } from '@/lib/api';

export interface CreateOrderRequest {
  amount: number;
}

export interface ConfirmPaymentRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  subId: string;
}

export interface UpdateSubscriptionRequest {
  newProductCount?: number;
  extendDays?: number;
}

export const subscriptionService = {
  async createOrder(data: CreateOrderRequest) {
    const response = await api.post('/subscription/buy', data);
    return response.data;
  },

  async confirmPayment(data: ConfirmPaymentRequest) {
    const response = await api.post('/subscription/confirm', data);
    return response.data;
  },

  async getCurrentSubscription(vendorId: string) {
    const response = await api.get(`/subscription/current-plan`);
    console.log("current subscription", response);

    return response.data;
  },

  async updateSubscription(id: string, data: UpdateSubscriptionRequest) {
    const response = await api.put(`/subscription/admin/edit/${id}`, data);
    return response.data;
  },

  async getAllPlans() {
    const response = await api.get('/subscription/get-plans');
    return response.data;
  },
};
