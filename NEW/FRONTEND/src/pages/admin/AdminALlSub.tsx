"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { toast } from "@/components/ui/use-toast";
import { Search, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

export default function SubscribedVendors() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const fetchSubscribedVendors = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllSubscribedVendors();
      setData(res.data || []);
      setFilteredData(res.data || []);
    } catch (error) {
      toast({ title: "Failed to fetch subscriptions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribedVendors();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.signupPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.createdAt || item.startDate) >= filterDate);
    }

    setFilteredData(filtered);
  }, [data, searchTerm, timeFilter]);

  const calculateStats = () => {
    const totalUsers = filteredData.length;
    const totalEarnings = filteredData.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
    const activeSubscriptions = filteredData.filter(item => new Date(item.endDate) > new Date()).length;
    
    return { totalUsers, totalEarnings, activeSubscriptions };
  };

  const { totalUsers, totalEarnings, activeSubscriptions } = calculateStats();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Subscribed Vendors</h2>
          <p className="text-muted-foreground">Manage and track vendor subscriptions</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <AnalyticsCard
          title="Total Subscribers"
          value={totalUsers}
          description={`${activeSubscriptions} active subscriptions`}
          icon={<Users className="h-5 w-5" />}
          trend="up"
        />
        <AnalyticsCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          description="From all subscriptions"
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
        />
        <AnalyticsCard
          title="Active Plans"
          value={activeSubscriptions}
          description={`${totalUsers - activeSubscriptions} expired`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="neutral"
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, vendor name, or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscriptions...</p>
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">No subscriptions found</p>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "No vendor has purchased subscriptions yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredData.map((item: any) => (
            <Card key={item._id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                    {item.vendor.companyName}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : item.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {item.paymentStatus}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.sub.name} Plan</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Contact Person</p>
                    <p className="text-muted-foreground">{item.vendor.signupPerson.name}</p>
                    <p className="text-xs text-muted-foreground">{item.vendor.signupPerson.designation}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">{item.vendor.signupPerson.phone}</p>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground">Amount Paid</p>
                      <p className="text-lg font-semibold text-green-600">₹{item.amountPaid}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Duration</p>
                      <p className="text-muted-foreground">{item.sub.days} days</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground">Start Date</p>
                      <p className="text-muted-foreground">{new Date(item.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">End Date</p>
                      <p className={`${new Date(item.endDate) > new Date() ? 'text-green-600' : 'text-red-600'}`}>
                        {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">Products Remaining</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                      {item.remainingProductCount}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Firm Type: {item.vendor.firmType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
