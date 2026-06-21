
import { AppSidebar } from "@/components/ui/AppSidebar";
import { Topbar } from "@/components/ui/Topbar";
import { Routes, Route } from "react-router-dom";
import AdminOverview from "./admin/AdminOverview";
import AdminVendors from "./admin/AdminVendors";
import AdminVendorDetail from "./admin/AdminVendorDetail";
import AdminPlans from "./admin/AdminPlans";
import AdminEnquiries from "./admin/AdminEnquiries";
import AdminCategories from "./admin/AdminCategories";
import AdminALlSub from "./admin/AdminALlSub";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminSettings from "./admin/AdminSettings";
import AdminMain from "./admin/AdminMain";
import { MyProducts } from "@/components/vendor/MyProducts";
import AdminAds from "./admin/AdminAds";
import AdminBrands from "./admin/AdminBrands";


export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar userType="admin" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName="Admin User" userType="admin" />
        
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminMain />} />
              <Route path="/vendors" element={<AdminVendors />} />
              <Route path="/vendors/:vendorId" element={<AdminVendorDetail />} />
              <Route path="/plans" element={<AdminPlans />} />
              <Route path="/enquiries" element={<AdminEnquiries />} />
              <Route path="/categories" element={<AdminCategories />} />
              <Route path="/add-product" element={<AdminAddProduct />} />
              <Route path="/Transcation" element={<AdminALlSub />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/ads" element={<AdminAds />} />
              <Route path="/brands" element={<AdminBrands />} />

            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
