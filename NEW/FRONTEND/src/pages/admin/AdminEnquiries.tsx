"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/Dashboard/AnalyticsCard";
import { Search, MessageSquare, User, Clock, Phone, MapPin, Package, Filter, Calendar, Building2 } from "lucide-react";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await adminService.getAllEnquiries();
        console.log("res",res.data);
        setEnquiries(res.data);
        setFilteredEnquiries(res.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    fetchEnquiries();
  }, []);

  useEffect(() => {
    let filtered = [...enquiries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phoneNo?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(enquiry => enquiry.status === statusFilter);
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
      }
      
      filtered = filtered.filter(enquiry => new Date(enquiry.createdAt) >= filterDate);
    }

    setFilteredEnquiries(filtered);
  }, [enquiries, searchTerm, statusFilter, timeFilter]);

  const calculateStats = () => {
    const totalEnquiries = filteredEnquiries.length;
    const waitingCount = filteredEnquiries.filter(e => e.status === "waiting").length;
    const approvedCount = filteredEnquiries.filter(e => e.status === "approved").length;
    const totalValue = filteredEnquiries.reduce((sum, e) => sum + ((e.product?.price || 0) * (e.quantity || 1)), 0);
    
    return { totalEnquiries, waitingCount, approvedCount, totalValue };
  };

  const { totalEnquiries, waitingCount, approvedCount, totalValue } = calculateStats();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Customer Enquiries</h2>
          <p className="text-muted-foreground">Manage and respond to customer enquiries</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <AnalyticsCard
          title="Total Enquiries"
          value={totalEnquiries}
          icon={<MessageSquare className="h-5 w-5" />}
          trend="up"
        />
        <AnalyticsCard
          title="Pending"
          value={waitingCount}
          description="Waiting for response"
          icon={<Clock className="h-5 w-5" />}
          trend="neutral"
        />
        <AnalyticsCard
          title="Approved"
          value={approvedCount}
          description="Successfully processed"
          icon={<Package className="h-5 w-5" />}
          trend="up"
        />
        <AnalyticsCard
          title="Total Value"
          value={`₹${totalValue.toLocaleString()}`}
          description="Potential business"
          icon={<Package className="h-5 w-5" />}
          trend="up"
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product, customer name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-full md:w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">No enquiries found</p>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "No customer enquiries yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredEnquiries.map((enquiry) => (
            <Card key={enquiry._id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                      {enquiry.product?.name || "Unnamed Product"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {enquiry.name || "Guest User"} • {new Date(enquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={enquiry.status === "waiting" ? "secondary" : enquiry.status === "approved" ? "default" : "destructive"}
                    className="shrink-0"
                  >
                    {enquiry.status}
                  </Badge>
                </div>
                
                {enquiry.product?.image && (
                <div className="mt-3 aspect-square w-25 rounded-md overflow-hidden">
                  <img
                    src={enquiry.product.image}
                    alt={enquiry.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Customer</p>
                      <p className="text-sm text-muted-foreground">
                        {enquiry.user ? enquiry.user.name : enquiry.name || "Guest"}
                      </p>
                    </div>
                  </div>

                  {/* Phone no for reg user */}
                  {enquiry.user && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">{enquiry.user.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {enquiry.phoneNo && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">{enquiry.phoneNo}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vendor Info */}
                {enquiry.product?.vendor && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Vendor Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Company</p>
                          <p className="text-sm text-muted-foreground">
                            {enquiry.product.vendor.companyName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Contact Person</p>
                          <p className="text-sm text-muted-foreground">
                            {enquiry.product.vendor.signupPerson?.name} ({enquiry.product.vendor.signupPerson?.designation})
                          </p>
                        </div>
                      </div>
                      {enquiry.product.vendor.signupPerson?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Contact Phone</p>
                            <p className="text-sm text-muted-foreground">
                              {enquiry.product.vendor.signupPerson.phone}
                            </p>
                          </div>
                        </div>
                      )}
                      {enquiry.product.vendor.companyAddress && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Address</p>
                            <p className="text-sm text-muted-foreground">
                              {enquiry.product.vendor.companyAddress}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {enquiry.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">{enquiry.address}</p>
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground">₹{enquiry.product?.price || 0}/{enquiry.product?.unit || 'pcs'}</p>
                      <p className="text-xs text-muted-foreground">Unit Price</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{ (enquiry.quantity || 1)}</p>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{((enquiry.product?.price || 0) * (enquiry.quantity || 1)).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                    </div>
                  </div>
                </div>

                {enquiry.product?.description && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-foreground mb-1">Product Description</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{enquiry.product.description}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                  <span>Created: {new Date(enquiry.createdAt).toLocaleString()}</span>
                  <span>Updated: {new Date(enquiry.updatedAt).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
