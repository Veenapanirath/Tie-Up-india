import { api } from "../lib/api"; // Adjust path based on your project structure

export const PlanService = {
  async getAllPlans() {
    const res = await api.get("/subscription/get-plans");
    console.log("PLan",res.data);
    
    return res.data;
  },

  async addPlan(data: {
    name: string;
    description: string;
    days: number;
    amount: number;
    productlimit: number;
  }) {
    const res = await api.post("/admin/add-plan", data);
    return res.data;
  },

  async updatePlan(id: string, data: Partial<{
    name: string;
    description: string;
    days: number;
    amount: number;
    productlimit: number;
  }>) {
    const res = await api.put(`/admin/${id}/update-plan`, data);
    return res.data;
  },

  async deletePlan(id: string) {
    const res = await api.delete(`/admin/${id}/delete-plan`);
    return res.data;
  }
};
