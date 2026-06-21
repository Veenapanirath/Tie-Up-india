
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Login from "./pages/Login";
import UserSignup from "./pages/UserSignup";
import VendorSignup from "./pages/VendorSignup";
import NotFound from "./pages/NotFound";
import AboutUs from "./components/about/About";
import TermsAndConditions from "./components/termsAndCondition/TermsAndCondition";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import ContactUs from "./components/ContactUs/ContactUs";
import UserDashboard from "./pages/UserDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/termsandcondition" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/user" element={<UserSignup />} />
            <Route path="/signup/vendor" element={<VendorSignup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/*" element={<VendorDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
