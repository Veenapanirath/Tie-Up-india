"use client";
import { useEffect, useState } from "react";
import { PlanService } from "@/services/Plan"; // Adjust this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    amount: "",
    productlimit: "",
    days: ""
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await PlanService.getAllPlans();
      setPlans(res.data || []);
    } catch (error) {
      toast({ title: "Error fetching plans" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      await PlanService.deletePlan(id);
      fetchPlans();
    }
  };

  const handleSubmit = async () => {
    const data = {
      name: form.name,
      description: form.description,
      amount: Number(form.amount),
      productlimit: Number(form.productlimit),
      days: Number(form.days)
    };

    try {
      if (editMode) {
        await PlanService.updatePlan(form.id, data);
        toast({ title: "Plan updated" });
      } else {
        await PlanService.addPlan(data);
        toast({ title: "Plan added" });
      }
      setForm({ id: "", name: "", description: "", amount: "", productlimit: "", days: "" });
      setEditMode(false);
      setOpenDialog(false);
      fetchPlans();
    } catch (err) {
      toast({ title: "Failed to save plan" });
    }
  };

  const openEdit = (plan: any) => {
    setForm({
      id: plan._id,
      name: plan.name,
      description: plan.description,
      amount: plan.amount,
      productlimit: plan.productlimit,
      days: plan.days
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h2>
        <p className="text-gray-600">Manage subscription plans and pricing</p>

        {/* Dialog Trigger */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="mt-4"
              onClick={() => {
                setForm({
                  id: "",
                  name: "",
                  description: "",
                  amount: "",
                  productlimit: "",
                  days: ""
                });
                setEditMode(false);
                setOpenDialog(true);
              }}
            >
              Add New Plan
            </Button>
          </DialogTrigger>

          {/* Dialog Content */}
          <DialogContent className="space-y-4">
            <h3 className="text-xl font-semibold">
              {editMode ? "Edit Plan" : "Add New Plan"}
            </h3>

            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Product Limit"
              value={form.productlimit}
              onChange={(e) => setForm({ ...form, productlimit: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Days"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: e.target.value })}
            />
            <Button onClick={handleSubmit} className="w-full">
              {editMode ? "Update Plan" : "Add Plan"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <div
              key={plan._id}
              className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {plan.name}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Price:</span> <span>₹{plan.amount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Products:</span> <span>{plan.productlimit}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration:</span> <span>{plan.days} days</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => openEdit(plan)}
                  className="w-full bg-primary text-white"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(plan._id)}
                  variant="secondary"
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
