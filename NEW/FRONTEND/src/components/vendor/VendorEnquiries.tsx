
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { vendorApi, Enquiry } from "@/services/vendorService";
import { toast } from "sonner";
import { BarChart3, Search, Trash2, RefreshCw } from "lucide-react";

export function VendorEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await vendorApi.getAllVendorEnquiry();
      setEnquiries(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch enquiries");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiryStatus = async (enquiryId: number, status: string) => {
    try {
      await vendorApi.updateEnquiry(enquiryId, { status, quantity: 0 });
      toast.success("Enquiry status updated successfully");
      fetchEnquiries();
    } catch (error) {
      toast.error("Failed to update enquiry status");
      console.error(error);
    }
  };

  const deleteEnquiry = async (enquiryId: number) => {
    try {

      console.log( "running internal  fun",enquiryId);
      
      const res = await vendorApi.deleteEnquiry(enquiryId);
      console.log(res);
      
      toast.success("Enquiry deleted successfully");
      setEnquiries(enquiries.filter(enq => enq._id !== enquiryId));
    } catch (error) {
      toast.error("Failed to delete enquiry");
      console.error(error);
    }
  };

  // Filter enquiries based on search term and status
  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      (enquiry.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter ? enquiry.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Count enquiries by status
  const statusCounts = {
    total: enquiries.length,
    waiting: enquiries.filter(e => e.status === "waiting").length,
    inProcess: enquiries.filter(e => e.status === "in process").length,
    done: enquiries.filter(e => e.status === "done").length
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "in process":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          Product Enquiries
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Manage customer enquiries for your products
        </p>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-3 md:p-4 flex items-center">
            <div className="rounded-full p-2 md:p-3 bg-gray-100 mr-2 md:mr-4">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Enquiries</p>
              <h3 className="text-lg md:text-2xl font-bold">{statusCounts.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-3 md:p-4 flex items-center">
            <div className="rounded-full p-2 md:p-3 bg-yellow-100 mr-2 md:mr-4">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Waiting</p>
              <h3 className="text-lg md:text-2xl font-bold">{statusCounts.waiting}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-3 md:p-4 flex items-center">
            <div className="rounded-full p-2 md:p-3 bg-blue-100 mr-2 md:mr-4">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">In Process</p>
              <h3 className="text-lg md:text-2xl font-bold">{statusCounts.inProcess}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-3 md:p-4 flex items-center">
            <div className="rounded-full p-2 md:p-3 bg-green-100 mr-2 md:mr-4">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Completed</p>
              <h3 className="text-lg md:text-2xl font-bold">{statusCounts.done}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search enquiries..."
            className="pl-10 text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Statuses">All Statuses</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="in process">In Process</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchEnquiries} className="flex items-center gap-2 text-sm md:text-base">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Loading enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No enquiries found</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <Card key={enquiry._id} className="bg-white rounded-xl shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 md:gap-4">
                      {enquiry.product?.image && (
                        <div className="hidden sm:block w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={enquiry.product.image} 
                            alt={enquiry.product.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                          Enquiry for {enquiry.product?.name || "Product"}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-gray-500 gap-1 md:gap-2 sm:gap-4 mb-2">
                          {enquiry.user?.email && <span className="truncate">{enquiry.user.email}</span>}
                          {enquiry.phoneNo && <span>{enquiry.phoneNo}</span>}
                          <span>{new Date(enquiry.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-600 mb-1 md:mb-2 text-sm md:text-base">
                          <span className="font-medium">Quantity:</span> {enquiry.quantity || "Not specified"}
                        </p>
                        {enquiry.name && (
                          <p className="text-gray-600 text-sm md:text-base">
                            <span className="font-medium">Customer:</span> {enquiry.name}
                          </p>
                        )}
                        {enquiry.address && (
                          <p className="text-gray-600 text-sm md:text-base">
                            <span className="font-medium">Address:</span> {enquiry.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass(enquiry.status)}>
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <Select 
                    defaultValue={enquiry.status}
                    onValueChange={(value) => updateEnquiryStatus(enquiry._id, value)}
                  >
                    <SelectTrigger className="w-full sm:w-[120px] md:w-[140px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="in process">In Process</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this enquiry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteEnquiry(enquiry._id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
