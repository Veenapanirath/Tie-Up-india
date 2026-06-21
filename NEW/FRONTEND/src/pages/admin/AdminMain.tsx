import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { 
  DollarSign, 
  Building2, 
  Package, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";
import { adminService, AdminDashboardStats } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

export default function AdminMain() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    fetchDashboardStats();
  }, [timeFilter]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats(timeFilter);
      setStats(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeFilterLabel = (filter: string) => {
    switch (filter) {
      case "1day":
        return "Last 24 Hours";
      case "1month":
        return "Last Month";
      case "1year":
        return "Last Year";
      default:
        return "All Time";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Overview of platform performance and statistics</p>
        </div>
        
        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32 md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1day">Last 24 Hours</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Period Display */}
      {stats && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Showing data for: {getTimeFilterLabel(timeFilter)}</span>
              {stats.period && (
                <span className="text-sm">({stats.period})</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <AnalyticsCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString() || '0'}`}
          icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5" />}
          description="Platform earnings"
          trend="up"
        />
        <AnalyticsCard
          title="Active Vendors"
          value={stats?.activeVendors?.toString() || '0'}
          icon={<Building2 className="h-4 w-4 md:h-5 md:w-5" />}
          description="Verified vendors"
          trend="up"
        />
        <AnalyticsCard
          title="Production Limited"
          value={stats?.productionLimited?.toString() || '0'}
          icon={<Package className="h-4 w-4 md:h-5 md:w-5" />}
          description="Vendors at limit"
          trend="neutral"
        />
        <AnalyticsCard
          title="Total Enquiries"
          value={stats?.totalEnquiries?.toString() || '0'}
          icon={<MessageSquare className="h-4 w-4 md:h-5 md:w-5" />}
          description="Customer enquiries"
          trend="up"
        />
      </div>

      {/* Enquiry Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
                Enquiry Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-sm md:text-base">New</span>
                  </div>
                  <span className="text-base md:text-lg font-bold text-blue-600">
                    {stats.enquiryBreakdown.new}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-sm md:text-base">In Process</span>
                  </div>
                  <span className="text-base md:text-lg font-bold text-yellow-600">
                    {stats.enquiryBreakdown.inProcess}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-sm md:text-base">Completed</span>
                  </div>
                  <span className="text-base md:text-lg font-bold text-green-600">
                    {stats.enquiryBreakdown.completed}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

       
        </div>
      )}

      {/* Summary Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-center">
              <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-blue-600">
                  {stats.totalRevenue > 0 ? `${((stats.totalRevenue / 100000) * 100).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-xs md:text-sm text-blue-600">Revenue Growth</div>
              </div>
              <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-green-600">
                  {stats.activeVendors > 0 ? `${((stats.activeVendors / (stats.activeVendors + stats.productionLimited)) * 100).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-xs md:text-sm text-green-600">Vendor Success Rate</div>
              </div>
              <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-purple-600">
                  {stats.totalEnquiries > 0 ? `${((stats.enquiryBreakdown.completed / stats.totalEnquiries) * 100).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-xs md:text-sm text-purple-600">Enquiry Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
