
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { 
  BarChart3,
  User,
  Package,
  MessageSquare,
  Plus,
  Trash2
} from "lucide-react";



export default function AdminOverview() {

  const [loading, setLoading] = useState(false);

  const { toast } = useToast();





  return (
    <div className="space-y-4 md:space-y-8">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Monitor your marketplace performance and key metrics
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <AnalyticsCard
          title="Total Revenue"
          value="₹24,560"
          description="+12% from last month"
          trend="up"
          icon={<BarChart3 className="h-4 w-4 md:h-6 md:w-6" />}
        />
        <AnalyticsCard
          title="Active Vendors"
          value="156"
          description="+8 new this month"
          trend="up"
          icon={<User className="h-4 w-4 md:h-6 md:w-6" />}
        />
        <AnalyticsCard
          title="Products Listed"
          value="1,234"
          description="+45 this week"
          trend="up"
          icon={<Package className="h-4 w-4 md:h-6 md:w-6" />}
        />
        <AnalyticsCard
          title="Enquiries Made"
          value="89"
          description="24 pending review"
          trend="neutral"
          icon={<MessageSquare className="h-4 w-4 md:h-6 md:w-6" />}
        />
      </div>

   

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
            Recent Vendor Activities
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">John's Crafts</p>
                <p className="text-xs md:text-sm text-gray-600">Added 3 new products</p>
              </div>
              <span className="text-xs md:text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">Fashion Hub</p>
                <p className="text-xs md:text-sm text-gray-600">Plan upgraded to Premium</p>
              </div>
              <span className="text-xs md:text-sm text-gray-500">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 text-sm md:text-base">Tech Store</p>
                <p className="text-xs md:text-sm text-gray-600">Received 5 new enquiries</p>
              </div>
              <span className="text-xs md:text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
            Top Categories
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm md:text-base">Electronics</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-4/5"></div>
                </div>
                <span className="text-xs md:text-sm text-gray-600">234</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm md:text-base">Fashion</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full w-3/5"></div>
                </div>
                <span className="text-xs md:text-sm text-gray-600">156</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm md:text-base">Home & Garden</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full w-2/5"></div>
                </div>
                <span className="text-xs md:text-sm text-gray-600">89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
