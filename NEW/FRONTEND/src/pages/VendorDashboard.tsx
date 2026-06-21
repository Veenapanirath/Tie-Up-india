
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { Topbar } from "@/components/ui/Topbar";
import { VendorOverview } from "@/components/vendor/VendorOverview";
import { AddProduct } from "@/components/vendor/AddProduct";
import { MyProducts } from "@/components/vendor/MyProducts";
import { VendorEnquiries } from "@/components/vendor/VendorEnquiries";
import { VendorPlan } from "@/components/vendor/VendorPlan";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";

export default function VendorDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <VendorSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName={user?.name || "Vendor"} userType="vendor" />
        
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<VendorOverview />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/products" element={<MyProducts />} />
              <Route path="/enquiries" element={<VendorEnquiries />} />
              <Route path="/plan" element={<VendorPlan />} />
              <Route path="/plans" element={<SubscriptionPlans />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
